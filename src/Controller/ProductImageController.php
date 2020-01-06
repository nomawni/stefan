<?php

namespace App\Controller;

use App\Entity\ProductImage;
use App\Form\ProductImage1Type;
use App\Repository\ProductImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/product/image")
 */
class ProductImageController extends AbstractController
{
    /**
     * @Route("/", name="product_image_index", methods={"GET"})
     */
    public function index(ProductImageRepository $productImageRepository): Response
    {
        return $this->render('product_image/index.html.twig', [
            'product_images' => $productImageRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="product_image_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $productImage = new ProductImage();
        $form = $this->createForm(ProductImage1Type::class, $productImage);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($productImage);
            $entityManager->flush();

            return $this->redirectToRoute('product_image_index');
        }

        return $this->render('product_image/new.html.twig', [
            'product_image' => $productImage,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="product_image_show", methods={"GET"})
     */
    public function show(ProductImage $productImage): Response
    {
        return $this->render('product_image/show.html.twig', [
            'product_image' => $productImage,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="product_image_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, ProductImage $productImage): Response
    {
        $form = $this->createForm(ProductImage1Type::class, $productImage);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('product_image_index');
        }

        return $this->render('product_image/edit.html.twig', [
            'product_image' => $productImage,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="product_image_delete", methods={"DELETE", "POST"}, options={"expose"=true})
     */
    public function delete(Request $request, ProductImage $productImage): Response
    {
           $user = $this->getUser();
           if(!$user) {
               return new Response();
           }

           if($productImage->isUserProduct($user)) {
       // if ($this->isCsrfTokenValid('delete'.$productImage->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($productImage);
            $entityManager->flush();
       // }
           return $this->json([
               "type" => "Deleted",
               "status" => 200
           ], 200);
           }

           return $this->json([
            "Image" => "There was a problem",
            "status" => 403
           ], 403);

       // return $this->redirectToRoute('product_image_index');
    }
}
