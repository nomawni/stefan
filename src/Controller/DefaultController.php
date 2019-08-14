<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController {

    /**
     * @Route("/")
     */
    public function index() {

        $name = "Kolon";
        
        return $this->render("default/homepage.html.twig", 
                             ["name" => $name]);
    }
}