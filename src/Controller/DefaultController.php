<?php
namespace App\Controller;

use App\Entity\Cart;
use App\Entity\WhishLists;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class DefaultController extends AbstractController {

    /**
     * @Route("/", name="app_homepage")
     */
    public function index(Request $request, ProductRepository $products): Response {

       $latestProducts = $products->findAll();

       $cartManager = $this->getDoctrine()->getManager()->getRepository(Cart::class);

       $wishlistManager = $this->getDoctrine()->getManager()->getRepository(WhishLists::class);

       $nCart = $cartManager->countUserCart($this->getUser());

       $nWishlist = $wishlistManager->countUserWishlist($this->getUser());

       if($this->getUser()) {

        $user = $this->getUser();
        $normalizer = new ObjectNormalizer();
        $encoders = new JsonEncoder();
        $serializer = new Serializer([$normalizer], [$encoders]);

        $serializedUser = $serializer->serialize($user, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]); //$this->get("serializer")->serialize($user, 'json');

       /*$response = new Response();
       $response->headers->setCookie(Cookie::create("userData", $serializedUser));
       $response->send(); */

       }
        
        return $this->render("default/homepage.html.twig",['products' => $latestProducts,
        
        'nCart' => $nCart,
        'nWishlist' => $nWishlist
        ] );
    }

    public function findCartWithClient() {

        
    }

    /**
     * @Route("/search", name="search_item", methods={"POST"}, options={"expose"=true})
     */
    public function searchItem(Request $request, ProductRepository $prodducts): Response {

        

        $data = $request->getContent();
        $productData = json_decode($data);
        
        $searchedTerm = $productData->value;
        $foundProducts = $prodducts->searchItem($searchedTerm);

        $results = \json_encode($foundProducts);

        $response = new Response($results);

        $response->headers->set('Content-Type', 'applicaiton/json');

        return $response;


    }
}