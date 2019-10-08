<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use App\Form\CartType;
use App\Repository\CartRepository;
use App\Repository\ProductRepository;
//use phpDocumentor\Reflection\DocBlock\Serializer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\JsonSerializableNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @Route("/cart")
 */
class CartController extends AbstractController
{
    /**
     * @Route("/", name="cart_index", methods={"GET"})
     */
    public function index(CartRepository $cartRepository): Response
    {
        return $this->render('cart/index.html.twig', [
            'carts' => $cartRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="cart_new", methods={"GET","POST"}) 
     */
    public function new(Request $request): Response
    {

        // ProductRepository to access the set the product into the cart

        $content = $request->getContent();

       // var_dump($content);

        $data = json_decode($content);

        //echo json_last_error();

        // The type of the executed request. if the cart is added or removed

        $type = null;

        $responseId = null;

        $Id = $data->Id;

        $cartId = $data->CartId;

       // $product = $this->get('serializer')->deserialize($data, Product::class, 'json');

       // var_dump($Id);

       $entityManager = $this->getDoctrine()->getManager();

       // $cartRep = $this->getDoctrine()->getManager()->getRepository(Cart::class);

       $cartRep = $entityManager->getRepository(Cart::class);

       //$prodRep = $this->getDoctrine()->getManager()->getRepository(Product::class);
       
       $productrep = $this->getDoctrine()->getManager()->getRepository(Product::class);

       $product = $productrep->find($Id);

       if($cartId) {

        //$catElem = $cartRep->findOneBy(["id" => $cartId, "client" => $this->getUser()]);

        $catElem = $cartRep->find($cartId);

         if($catElem) {

            //$cartRep->remove($catElem);
           // var_dump($catElem);

           $catElem->removeProduct($product);

            $entityManager->remove($catElem);

            $entityManager->flush();         
            
            $type = "removed";
         }
       } else {
        //$prodCart = new ProductCart();

        $cart = new Cart();
       
        $cart->setClient($this->getUser());
        $cart->setCreatedAt(new \DateTimeImmutable());
        //$cart->addProduct($productrep->find(2));
        $cart->addProduct($product);

         // $prodCart->setClient($this->getUser());
         // $prodCart->setProduct($product);
        //  $prodCart->addCart($cart);

        //  $entityManager->persist($prodCart);

            $entityManager->persist($cart);
            $entityManager->flush();

            $type ="added";

            $responseId = $cart->getId();

       }

            $numberCart = $this->getDoctrine()->getManager()->getRepository(Cart::class)
                         ->countUserCart($this->getUser());
            
        // Serizlisation of the response 

        //var_dump($numberCart);

        $responseData = array("numberCart" => $numberCart, "Id" => $responseId, "type" => $type);
       
        $encoded = json_encode($responseData);

        //$encoded = $this->get("serializer")->serialize($responseData, 'json');

        $response = new Response($encoded);

        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/all", name="cart_show_all", methods={"GET"})
     */

     public function showAll(): Response {

        $cartRepository = $this->getDoctrine()->getManager()->getRepository(Cart::class);

        //$listCart = $cartRepository->allCarts($this->getUser());

        $listCart = $cartRepository->findBy(array("client" => $this->getUser()));

        //$listCart = $cartRepository->findAll();  //find(26);

        //var_dump($listCart);

        //$listCart = $cartRepository->findByClient($this->getUser());

       // $listCart = $cartRepository->findBy(array('client', $this->getUser()));

      /*  $encoder = [new JsonEncoder()];

        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return array($object);
            },
        ];

        $normalizer = [new ObjectNormalizer(null, null, null, null, null, null, $defaultContext)];
      
        $serializer = new Serializer([$normalizer], [$encoder]);
      
        $data = $serializer->serialize($listCart, 'json'); */

       //$data = $this->get('serializer')->serialize($listCart, 'json');

       // Avoid circular 

       $encoder = new JsonEncoder();

       $normalizer = new ObjectNormalizer();

       $serializer = new Serializer([$normalizer], [$encoder]);

       $data = $serializer->serialize($listCart, 'json', [
           AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {

            return $object->getId();
           }
       ]); 

       //$data = json_encode($listCart);

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;

     }

     /**
     * @Route("/{id}", name="cart_show", methods={"GET"})
     */
    public function show(Cart $cart): Response
    {
        return $this->render('cart/show.html.twig', [
            'cart' => $cart,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="cart_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Cart $cart): Response
    {
        $form = $this->createForm(CartType::class, $cart);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('cart_index');
        }

        return $this->render('cart/edit.html.twig', [
            'cart' => $cart,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/remove/{id}", name="cart_delete", methods={"DELETE", "POST"})
     */
    public function delete(Request $request, Cart $cart): Response
    {

        $entityManager = $this->getDoctrine()->getManager();
        $type = "error";
       // if ($this->isCsrfTokenValid('delete'.$cart->getId(), $request->request->get('_token'))) {
           if($cart->getClient() == $this->getUser()){
            
            $entityManager->remove($cart);
            $entityManager->flush();

            $type = "removed";
           }
       // }
       $numberCart = $entityManager->getRepository(Cart::class)->countUserCart($this->getUser());

       $data = array("numberCart" => $numberCart,"type" => $type);

       $data = json_encode($data);

       $response = new Response($data);

       $response->headers->set("Content-Type", "application/json");

       return $response;
       // return $this->redirectToRoute('cart_index');
    }
}
