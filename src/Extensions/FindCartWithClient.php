<?php

namespace App\Extensions;

use Proxies\__CG__\App\Entity\Cart;
use Twig_Extension;

use Symfony\Bridge\Doctrine\RegistryInterface;

class FindCartWithClient extends \Twig_Extension {

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('find', array($this, 'find')),
        );
    }

    protected $doctrine;

    public function __construct(RegistryInterface $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function find($product, $client) {
        $em = $this->doctrine->getManager();

        $repo = $em->getRepository(Cart::class);

        return $repo->findBy(["product" => $product, "client" => $client]);
    }

    public function getName() {
        return 'FindCartWithClient';
    }

}