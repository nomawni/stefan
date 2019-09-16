<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use App\Entity\ProductCart;
use App\Form\CartType;
use App\Repository\CartRepository;
use App\Repository\ProductRepository;
use phpDocumentor\Reflection\DocBlock\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
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

        var_dump($content);

        $data = json_decode($content);

        //echo json_last_error();

        // The type of the executed request. if the cart is added or removed

        $type = null;

        $Id = $data->Id;

        $cartId = $data->CartId;

       // $product = $this->get('serializer')->deserialize($data, Product::class, 'json');

       // var_dump($Id);

       $entityManager = $this->getDoctrine()->getManager();

       $cartRep = $this->getDoctrine()->getManager()->getRepository(Cart::class);

       $prodRep = $this->getDoctrine()->getManager()->getRepository(Product::class);
       

       if($cartId) {

        $catElem = $cartRep->findOneBy(["id" => $cartId, "client" => $this->getUser()]);

         if($catElem) {

            //$cartRep->remove($catElem);
           // var_dump($catElem);

         //  $catElem->

            $entityManager->remove($catElem);

            $entityManager->flush();         
            
            $type = "added";
         }
       } else {

        $productrep = $this->getDoctrine()->getManager()->getRepository(Product::class);

        $prodCart = new ProductCart();

        $cart = new Cart();
       
        $cart->setClient($this->getUser());
        $cart->setCreatedAt(new \DateTimeImmutable());
        //$cart->addProduct($productrep->find(2));
        $cart->addProduct($productrep->find($Id));

            $entityManager->persist($cart);
            $entityManager->flush();

            $type ="removed";

       }

            $numberCart = $this->getDoctrine()->getManager()->getRepository(Cart::class)
                         ->countUserCart($this->getUser());
            
        // Serizlisation of the response 
       

        $encoded = json_encode(array("numberCart" => $numberCart, "type" => $type));

        $response = new Response($encoded);

        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/all", name="cart_show_all", methods={"GET"})
     */

     public function showAll(): Response {

        $cartRepository = $this->getDoctrine()->getManager()->getRepository(Cart::class);

        $listCart = $cartRepository->allCarts($this->getUser());

        //$listCart = $cartRepository->findByClient($this->getUser());

       // $listCart = $cartRepository->findBy(array('client', $this->getUser()));

        $encoder = [new JsonEncoder()];

      /*  $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return array($object);
            },
        ];

        $normalizer = [new ObjectNormalizer(null, null, null, null, null, null, $defaultContext)];
      
        $serializer = new Serializer([$normalizer], [$encoder]);
      */
      //  $data = $serializer->serialize($listCart, 'json');

     // $data = $this->get('jms_serializer')->serialize($listCart, 'json');

       $data = json_encode($listCart);

        $request = new Response($data);

        $request->headers->set('Content-Type', "application/json");

        return $request;

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
     * @Route("/{id}", name="cart_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Cart $cart): Response
    {
        if ($this->isCsrfTokenValid('delete'.$cart->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($cart);
            $entityManager->flush();
        }

        return $this->redirectToRoute('cart_index');
    }
}
