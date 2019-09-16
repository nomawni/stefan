<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Star;
use App\Form\StarType;
use App\Repository\StarRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/star")
 */
class StarController extends AbstractController
{
    /**
     * @Route("/", name="star_index", methods={"GET"})
     */
    public function index(StarRepository $starRepository): Response
    {
        return $this->render('star/index.html.twig', [
            'stars' => $starRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="star_new", methods={"POST"})
     */
    public function new(Request $request): Response
    {
        $star = new Star();

        $content = $request->getContent();

        $data = json_decode($content);

        $starValue = intval($data->star);
        $productId = $data->productId;

        $prodRep = $this->getDoctrine()->getManager()->getRepository(Product::class);

        $star->setClient($this->getUser());

        $star->setProduct($prodRep->find($productId));

        $star->setValue($starValue);

        $star->setAddedAt(new \DateTimeImmutable());

       // $form = $this->createForm(StarType::class, $star);
      //  $form->handleRequest($request);

       // if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($star);
            $entityManager->flush();

            $all = $this->getDoctrine()->getManager()->findAll();

            $response = new Response($all);

            $response->headers->set("Content-Type", "application/json");

            return $response;

         //   return $this->redirectToRoute('star_index');
      //  }

      //  return $this->render('star/new.html.twig', [
      //      'star' => $star,
      //      'form' => $form->createView(),
     //   ]);
    }

    /**
     * @Route("/{id}", name="star_show", methods={"GET"})
     */
    public function show(Star $star): Response
    {
        return $this->render('star/show.html.twig', [
            'star' => $star,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="star_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Star $star): Response
    {
        $form = $this->createForm(StarType::class, $star);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('star_index');
        }

        return $this->render('star/edit.html.twig', [
            'star' => $star,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="star_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Star $star): Response
    {
        if ($this->isCsrfTokenValid('delete'.$star->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($star);
            $entityManager->flush();
        }

        return $this->redirectToRoute('star_index');
    }
}
