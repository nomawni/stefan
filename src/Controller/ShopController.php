<?php

namespace App\Controller;

use App\Entity\Shop;
use App\Form\ShopType;
use App\Repository\ShopRepository;
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
 * @Route("/shop")
 */
class ShopController extends AbstractController
{
    /**
     * @Route("/", name="shop_index", methods={"GET"})
     */
    public function index(ShopRepository $shopRepository): Response
    {
        return $this->render('shop/index.html.twig', [
            'shops' => $shopRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="shop_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request): Response
    {
        $content = $request->getContent();
        $shop = new Shop();
        $form = $this->createForm(ShopType::class, $shop);
        $form->handleRequest($request);

        //if ($form->isSubmitted() && $form->isValid()) {

            $shop->setManager($this->getUser());
            $shop->setOwner($this->getUser());

            $this->get("serializer")->deserialize($content, Shop::class, 'json', 
                                      ['object_to_populate' => $shop]);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($shop);
            $entityManager->flush();

            $encoder = new JsonEncoder();
            $normalizer = new ObjectNormalizer();
            $serializer = new Serializer([$normalizer], [$encoder]);

            $data = $serializer->serialize($shop, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            $response = new Response($data);
            $response->headers->set("Content-Type", "application/json");

           // return $this->redirectToRoute('shop_index');
        //}

        /*return $this->render('shop/new.html.twig', [
            'shop' => $shop,
            'form' => $form->createView(),
        ]);  */

        return $response ;
    }

    /**
     * @Route("/{id}", name="shop_show", methods={"GET"}, options={"expose"=true})
     */
    public function show(Shop $shop): Response
    {
       /* return $this->render('shop/show.html.twig', [
            'shop' => $shop,
        ]); */

        $encoder = new JsonEncoder();

        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoder]);

        $data = $serializer->serialize($shop, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;
    }
    /**
     * @Route("/user/shops", name="user_shops", methods="GET", options={"expose"=true})
     */

    public function userShops(): Response {

        $user = $this->getUser();
        $response = new Response();
        if(!$user) {
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->setContent("You are not connected !");
            return $response;
        }

        $repository = $this->getDoctrine()->getRepository(Shop::class);
        $listShops = $repository->findBy(["owner" => $user]);
        //$encoded = json_encode($listShops); //$this->get("serializer")->serialize($listShops, 'json');
        $encoder = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoder]);
        $data = $serializer->serialize($listShops, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);    
    

        $response->setStatusCode(Response::HTTP_OK);
        $response->setContent($data);
        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/{id}/edit", name="shop_edit", methods={"GET","POST"}, options={"expose"=true})
     */
    public function edit(Request $request, Shop $shop): Response
    {
       /* $form = $this->createForm(ShopType::class, $shop);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('shop_index');
        }

        return $this->render('shop/edit.html.twig', [
            'shop' => $shop,
            'form' => $form->createView(),
        ]); */

        if($request->isMethod("POST")) {
            $content = $request->getContent();
            var_dump($content);

            $this->get('serializer')->deserialize($content, Shop::class, 'json',
                                   ['object_to_populate' => $shop]);

            $this->getDoctrine()->getManager()->flush();

            return new JsonResponse($shop);
        }

        $encoder = new JsonEncoder();
        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoder]);

        $data = $serializer->serialize($shop, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);

        $response = new Response($data);
        $response->headers->set("Content-Type", "application/json");

        return $response;
    }

    /**
     * @Route("/{id}", name="shop_delete", methods={"DELETE", "POST"}, options={"expose"=true})
     */
    public function delete(Request $request, Shop $shop): Response
    {
        //if ($this->isCsrfTokenValid('delete'.$shop->getId(), $request->request->get('_token'))) {
            $response = new Response();
            if(!$this->getUser()) {
                $response->setStatusCode(Response::HTTP_FORBIDDEN);
                $response->setContent("You are not connected");
                return $response;

            }
            if($shop->getManager() == $this->getUser() || $shop->getOwner() == $this->getUser()){
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($shop);
            $entityManager->flush();
            $response->setStatusCode(Response::HTTP_OK);

            $response->setContent(json_encode($shop));

            return $response;
            }
       // }

        //return new Response(""); //$this->redirectToRoute('shop_index');
    }
}
