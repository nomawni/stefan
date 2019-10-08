<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\WhishLists;
use App\Form\WhishListsType;
use App\Repository\WhishListsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\JsonSerializableNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/whishlists")
 */
class WhishListsController extends AbstractController
{
    /**
     * @Route("/", name="whish_lists_index", methods={"GET"})
     */
    public function index(WhishListsRepository $whishListsRepository): Response
    {
        return $this->render('whish_lists/index.html.twig', [
            'whish_lists' => $whishListsRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="whish_lists_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {

        $type = null;

        $responseId = null;
        
        $data = $request->getContent();

        //var_dump($data);

        $data = json_decode($data);

        $Id = $data->Id;

        $WhishlistId = $data->WhishlistId;

        $entityManager = $this->getDoctrine()->getManager();

        //var_dump($data);

       // $product = $this->get("serializer")->deserialize($data, Product::class, 'json');

        $prodRep = $entityManager->getRepository(Product::class);

        $whishListRep = $entityManager->getRepository(WhishLists::class);

        $product = $prodRep->find($Id);

        if($WhishlistId) {

            $whishListElem = $whishListRep->find($WhishlistId);

            if($whishListElem) {

                $whishListElem->removeProduct($product);

                $entityManager->remove($whishListElem);

                $entityManager->flush();

                $type = "removed";
                 }
            }
            else {

                $whishList = new WhishLists();

                $whishList->setCustomer($this->getUser());

                $whishList->addProduct($product);

                $entityManager->persist($whishList);

                $entityManager->flush();

                $type = "added";

                $responseId = $whishList->getId();

        }

      /*  $whishList = new WhishLists();

        $whishList->setCustomer($this->getUser());
        $whishList->setDateAdded(new \DateTimeImmutable());
        $whishList->addProduct($prodRep->find($Id));

            $entityManager->persist($whishList);
            $entityManager->flush(); */

         $nWhishlist = $entityManager->getRepository(WhishLists::class)
                            ->countUserWishlist($this->getUser());
         
            $encoded = json_encode(array("numberWhishlists" => $nWhishlist, "Id" => $responseId, "type" => $type));

            $response = new Response($encoded);

            $request->headers->set("Content-Type", "application/json");

            return $response;

    }

    /**
     * @Route("/all", name="whishlists_show_all", methods={"GET"})
     */

    public function showAll() : Response {

        $whishListsRepository = $this->getDoctrine()->getManager()->getRepository(WhishLists::class);

       // $allWhishlists = $whishListsRepository->allWhishlists($this->getUser());

        $allWhishlists = $whishListsRepository->findBy(array('customer' => $this->getUser()));

       //$allWhishlists = $whishListsRepository->findBy(array("client",$this->getUser()));

        //$data = json_encode($allWhishlists);

        //$data = $this->get("serializer")->serialize($allWhishlists, "json");

        $encoder = new JsonEncoder();

       $normalizer = new ObjectNormalizer();

       $serializer = new Serializer([$normalizer], [$encoder]);

       $data = $serializer->serialize($allWhishlists, 'json', [
           AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {

            return $object->getId();
           }
       ]); 

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/{id}", name="whish_lists_show", methods={"GET"})
     */
    public function show(WhishLists $whishList): Response
    {
        return $this->render('whish_lists/show.html.twig', [
            'whish_list' => $whishList,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="whish_lists_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, WhishLists $whishList): Response
    {
        $form = $this->createForm(WhishListsType::class, $whishList);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('whish_lists_index');
        }

        return $this->render('whish_lists/edit.html.twig', [
            'whish_list' => $whishList,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/remove/{id}", name="whish_lists_delete", methods={"DELETE", "POST"})
     */
    public function delete(Request $request, WhishLists $whishList): Response
    {

        $entityManager = $this->getDoctrine()->getManager();
            $type = "error";
       // if ($this->isCsrfTokenValid('delete'.$whishList->getId(), $request->request->get('_token'))) {
           
            if($whishList->getCustomer() == $this->getUser()) {
            
            $entityManager->remove($whishList);
            $entityManager->flush();
            $type = "removed";
            }
         $numberWhishList = $entityManager->getRepository(WhishLists::class)->countUserWishlist($this->getUser());

         $data = array("numberWhishList" => $numberWhishList ,"type" => $type);

         $data = json_encode($data);

         $response = new Response($data);

         $response->headers->set("Content-Type", "application/json");

         return $response;
      //  }

       // return $this->redirectToRoute('whish_lists_index');
    }
}
