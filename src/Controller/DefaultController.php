<?php
namespace App\Controller;

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
        
        return $this->render("default/homepage.html.twig",['products' => $latestProducts] );
    }
}