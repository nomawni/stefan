<?php
namespace App\Controller;

use App\Entity\Cart;
use App\Entity\WhishLists;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
        
        return $this->render("default/homepage.html.twig",['products' => $latestProducts,
        
        'nCart' => $nCart,
        'nWishlist' => $nWishlist
        ] );
    }

    public function findCartWithClient() {

        
    }

    /**
     * @Route("/search", name="search_item", methods={"POST"})
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