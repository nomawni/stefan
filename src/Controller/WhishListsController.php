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

/**
 * @Route("/whish/lists")
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
        
        $data = $request->getContent();

        var_dump($data);

        $requestId = json_decode($data);

        $Id = $requestId->Id;

        //var_dump($data);

        $product = $this->get("serializer")->deserialize($data, Product::class, 'json');

        $prodRep = $this->getDoctrine()->getManager()->getRepository(Product::class);

        $whishList = new WhishLists();

        $whishList->setCustomer($this->getUser());
        $whishList->setDateAdded(new \DateTimeImmutable());
        $whishList->addProduct($prodRep->find($Id));

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($whishList);
            $entityManager->flush();

         $nWhishlist = $this->getDoctrine()->getManager()->getRepository(WhishLists::class)
                            ->countUserWishlist($this->getUser());
         
            $encoded = json_encode(array("numberWhishlists" => $nWhishlist));

            $response = new Response($encoded);

            $request->headers->set("Content-Type", "application/json");

            return $response;

    }

    /**
     * @Route("/all", name="whishlists_show_all", methods={"GET"})
     */

    public function showAll() : Response {

        $whishListsRepository = $this->getDoctrine()->getManager()->getRepository(WhishLists::class);

        $allWhishlists = $whishListsRepository->allWhishlists($this->getUser());

        $data = json_encode($allWhishlists);

        $response = new Response($data);

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
     * @Route("/{id}", name="whish_lists_delete", methods={"DELETE"})
     */
    public function delete(Request $request, WhishLists $whishList): Response
    {
        if ($this->isCsrfTokenValid('delete'.$whishList->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($whishList);
            $entityManager->flush();
        }

        return $this->redirectToRoute('whish_lists_index');
    }
}
