<?php

namespace App\Controller;

use App\Entity\Address;
use App\Entity\Customer;
use App\Entity\Orders;
use App\Entity\Product;
use App\Entity\Shipment;
use App\Entity\Transactions;
use App\Form\TransactionsType;
use App\Repository\TransactionsRepository;
use Exception;
use stdClass;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/transactions")
 */
class TransactionsController extends AbstractController
{
    /**
     * @Route("/", name="transactions_index", methods={"GET"})
     */
    public function index(TransactionsRepository $transactionsRepository): Response
    {
        return $this->render('transactions/index.html.twig', [
            'transactions' => $transactionsRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="transactions_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request): Response
    {
        $user = $this->getUser();
        if(!$user) {
            return $this->json([
                "message" => "You are not connected !",
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $transaction = new Transactions();

        $content = $request->getContent();
        $content = json_decode($content);
        //var_dump($content);
        $token = $content->token;
      /*  $fullName = $content->fullName;
        $careOf = $content->careOf;
        $street = $content->street;
        $city = $content->city;
        $postalCode = $content->postalCode;
        $phoneNumber = $content->phoneNumber;
        $instructions = $content->instructions; */
        $orderType = $content->orderType;
        $orderTypeId = $content->orderTypeId;
        $addressId = $content->addressId;

        if(!$addressId) {
            return $this->json([
                "message" => "The address can not be null", 
                "code" => 403
            ], 403);
        }

        $productInfo = $content->productInfo;
        $totalPrice = $this->calculateProduct($productInfo, $transaction);

        if(!$totalPrice) {
            return $this->json([
                "message" => "An error occured when calculating the price !",
                "code" => 403
            ], 403);
        }
        //var_dump($totalPrice);

        if(!$orderType || !$orderTypeId) {
            return $this->json([
                "message" => "something went wrong !",
                "code" => 403
            ], 403);
        }

        // The price for stripe must be an integer
        $stripeTotalPrice = $totalPrice * 100;

        $customer = \Stripe\Customer::create(array(
            "email" => $user->getEmail(), 
            "source" => $token
        ));

        $charge = \Stripe\Charge::create(array(
            "amount" => $stripeTotalPrice,
            "currency" => "EUR",
            "description" => "Buying new bird",
            "customer" => $customer->id        
        ));
       // print_r($charge);

        // The address of the custommer 
       /* $address = new Address();
        $address->addUser($user);
        $address->setCountry("Germany");
        $address->setFullName($fullName);
        $address->setPhoneNumber($phoneNumber);
        $address->setPostalCode($postalCode);
        $address->setStreet($street);
        $address->setCity($city);
        $address->setInstructions($instructions);
        $address->setCareOf($careOf);
        // We persist if it's a new address 
        $entityManager->persist($address); */
        // End of the address customer

        // This is the customer he is represented by his address 
        $oldCustomer = $this->getDoctrine()->getRepository(Customer::class)->findBy(["user" => $user]);

        $address= $this->getDoctrine()->getRepository(Address::class)->find($addressId);

        if(!$address) {
            return $this->json([
                "message" => "The Delivery address can not be null",
                "code" => 403
            ], 403);
        }
        //var_dump(($oldCustomer[0]->getId()));
        if($oldCustomer) {
            $transaction->setCustomer($oldCustomer[0]);
        }else {
        $entityCustomer = new Customer();
        $entityCustomer->setUser($user);
        $entityCustomer->addAddress($address);
        $entityManager->persist($entityCustomer);

        $transaction->setCustomer($entityCustomer);
        } 

        // The transaction 
        $transaction->setStripeCustomerId($customer->id);
        $transaction->setAmount($totalPrice);
        $transaction->setCurrency($charge->currency);
        $transaction->setStatus($charge->status);
        $transaction->setCreatedAt(new \DateTimeImmutable());
        $transaction->setDeliveryAddress($address);
        // We persist it 
        $entityManager->persist($transaction);

        $entityManager->flush();

        // End of the transaction

       // $shipment = new Shipment();
        //$shipment->setSingleOrder();
       // $shipment->setAddress($address);

        return new JsonResponse($charge); 
      
    }

    /**
     * @Route("/{id}", name="transactions_show", methods={"GET"})
     */
    public function show(Transactions $transaction): Response
    {
        return $this->render('transactions/show.html.twig', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * @Route("/list/transactions", name="list_transactions", methods={"GET"}, options={"expose"=true})
     */
    public function getListTransactions(Request $request): Response {
        
        try {
        $user = $this->getUser();
        if(!$user) {
            return $this->json([
                "message" => "You have to be connected to access your transactions !",
                "code" => 403
            ], 403);
        }
        $customer = $this->getDoctrine()->getRepository(Customer::class)->findOneBy(["user" => $user]);
        if(!$customer)  {
            return $this->json([
                "message" => "You have not done any transactions !", 
                "code" => 403,
            ], 403);
        }
        $listTransaction = $this->getDoctrine()->getRepository(Transactions::class)->findBy(["customer" => $customer]);

        if(!$listTransaction) {
            return $this->json([
                "message" => "Your list of transactions are empty !",
                "code" => 403,
            ],403);
        }

        $normalizer = new ObjectNormalizer();
        $encoder = new JsonEncoder();
        $serializer = new Serializer([$normalizer],[$encoder]);

       // return new JsonResponse($listTransaction);
       $object = new stdClass();
        foreach($listTransaction as $key => $trans) {

        $data = $serializer->serialize($trans, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]); 
        $object->$key = $data;
        }

       // $data = json_encode($listTransaction[0]);

       /* $response = new Response($data);
        $response->headers->set("Content-Type", "application/json"); */

       // return $response;
       return new JsonResponse($object); //JsonResponse::fromJsonString($data);
        }catch(Exception $e) {
            return new Response($e);
        }
    }

    /**
     * @Route("/{id}/edit", name="transactions_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Transactions $transaction): Response
    {
        $form = $this->createForm(TransactionsType::class, $transaction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('transactions_index');
        }

        return $this->render('transactions/edit.html.twig', [
            'transaction' => $transaction,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="transactions_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Transactions $transaction): Response
    {
        if ($this->isCsrfTokenValid('delete'.$transaction->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($transaction);
            $entityManager->flush();
        }

        return $this->redirectToRoute('transactions_index');
    }

    public function calculateProduct($itemsInfoContent, $transaction) {

        if(!$itemsInfoContent) {
            return false;
        }
        
        $itemInfo = $itemsInfoContent->itemInfo;
        $orderType = $itemsInfoContent->orderType;
        $totalPrice = 0;

        if($orderType == "singleItem") {
            $productId = intval($itemInfo->productId);
           $quantity = intval($itemInfo->quantity);
           $product = $this->getDoctrine()->getRepository(Product::class)->find($productId);

           if($product) {
               // If the product exists we want to add it into the transaction table so that we can
               // get the list of the products that the client have ordered
               $transaction->addProduct($product);
               $price = $product->getPrice();
               $totalPrice = $price * $quantity;

               return $totalPrice;
           }
           return false;
        }else {
           foreach($itemInfo as  $item ) {
               $productId = intval($item->productId);
               $quantity = intval($item->quantity);
               $product = $this->getDoctrine()->getRepository(Product::class)->find($productId);

               if($product) {
                   // If the product exists we want to add it into the transaction table so that we can
                   // get the list of the products that the client have ordered
                   $transaction->addProduct($product);
                   $price = $product->getPrice();
                   $totalPrice += $price * $quantity;
               }
           }
           //setlocale(LC_MONETARY, 'de_DE');
           $totalPrice = number_format(floatval($totalPrice),2, '.', '');
           return $totalPrice;
        }

    }
}
