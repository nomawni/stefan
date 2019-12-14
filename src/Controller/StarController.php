<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use App\Entity\Star;
use App\Form\StarType;
use App\Repository\StarRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

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
     * @Route("/new/{id}", name="star_new", methods={"POST", "GET"}, options={"expose"=true})
     */
    public function new(Product $product ,Request $request): Response
    {
       
        $response = new Response();
        $user = $this->getUser();

        if(!$user) {
            $response->setStatusCode(Response::HTTP_FORBIDDEN);
            $response->setContent("You are not connected");

            return $response;
        }

        $content = $request->getContent();

        $entityManager = $this->getDoctrine()->getManager();

       // $repository = $this->getDoctrine()->getManager();

        $data = json_decode($content);

        $starValue = intval($data->star);
        //$productId = intval($data->productId);

        $starId = intval($data->starId);

       $dbStar = $product->hasUserStar($user);
       if($dbStar) {
           $dbStar->setValue($starValue);

         $entityManager->flush();
         $response->setStatusCode(Response::HTTP_OK);
         $starContent = $dbStar->getValue();
         $type = "Updated";

       }else {

        $star = new Star();

        $star->setClient($user);
        $star->setProduct($product);
        $star->setValue($starValue);
        $star->setAddedAt(new \DateTimeImmutable());

        $entityManager->persist($star);
        $entityManager->flush(); 
        $response->setStatusCode(Response::HTTP_CREATED);
        $starContent = $star->getValue();
        $type = "Added";

       }

           $normalizer = new ObjectNormalizer();
           $encoder = new JsonEncoder();
           $serializer = new Serializer([$normalizer], [$encoder]);

           $starValue = array("value" =>$starContent);

           $responseContainer = $serializer->serialize($starValue, 'json', [
               AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                   return $object->getId();
               }
           ]);

            //$response = new Response($responseContainer);
            $response->setContent($responseContainer);

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
