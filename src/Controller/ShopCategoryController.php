<?php

namespace App\Controller;

use App\Entity\ShopCategory;
use App\Form\ShopCategory1Type;
use App\Repository\ShopCategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/shop/category")
 */
class ShopCategoryController extends AbstractController
{
    /**
     * @Route("/", name="shop_category_index", methods={"GET"})
     */
    public function index(ShopCategoryRepository $shopCategoryRepository): Response
    {
        return $this->render('shop_category/index.html.twig', [
            'shop_categories' => $shopCategoryRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="shop_category_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $shopCategory = new ShopCategory();
        $form = $this->createForm(ShopCategory1Type::class, $shopCategory);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($shopCategory);
            $entityManager->flush();

            return $this->redirectToRoute('shop_category_index');
        }

        return $this->render('shop_category/new.html.twig', [
            'shop_category' => $shopCategory,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="shop_category_show", methods={"GET"})
     */
    public function show(ShopCategory $shopCategory): Response
    {
        return $this->render('shop_category/show.html.twig', [
            'shop_category' => $shopCategory,
        ]);
    }

     /**
     * @Route("/show/all", name="shop_category_show_all", methods={"GET"}, options={"expose"=true})
     */
     public function all() {

        $listCategories = $this->getDoctrine()->getRepository(ShopCategory::class)->findAll();
        $response = new Response();

        if($listCategories){

            $response->setStatusCode(Response::HTTP_OK);
            
            $normalizer = new ObjectNormalizer(); 
            $encoder = new JsonEncoder(); 
            $serializer = new Serializer([$normalizer], [$encoder]); 

            $data = $serializer->serialize($listCategories, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);
            //$this->get("serializer")->serialize($listCategories, 'json');
            $response->setContent($data);
            $response->headers->set("Content-Type", "application/json");
            return $response;
        } else {
            
            return $this->json([
                "message" => "The list of categories are empty or an error occured !",
                "code" => 403
            ], 403);
           /* $response->setContent("Hello world");
            $response->headers->set("Content-Type", "application/json");
            return $response; */
        }
        
    }

    /**
     * @Route("/{id}/edit", name="shop_category_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, ShopCategory $shopCategory): Response
    {
        $form = $this->createForm(ShopCategory1Type::class, $shopCategory);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('shop_category_index');
        }

        return $this->render('shop_category/edit.html.twig', [
            'shop_category' => $shopCategory,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="shop_category_delete", methods={"DELETE"})
     */
    public function delete(Request $request, ShopCategory $shopCategory): Response
    {
        if ($this->isCsrfTokenValid('delete'.$shopCategory->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($shopCategory);
            $entityManager->flush();
        }

        return $this->redirectToRoute('shop_category_index');
    }
}
