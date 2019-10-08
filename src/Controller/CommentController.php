<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Product;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use phpDocumentor\Reflection\DocBlock\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @Route("/comment")
 */
class CommentController extends AbstractController
{
    /**
     * @Route("/", name="comment_index", methods={"GET"})
     */
    public function index(CommentRepository $commentRepository): Response
    {
        return $this->render('comment/index.html.twig', [
            'comments' => $commentRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="comment_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
       
        $data =  json_decode($request->getContent());

        $entityManager = $this->getDoctrine()->getManager();

        $productId = intval($data->productId);
        $commentValue = $data->comment;

        $product = $entityManager->getRepository(Product::class);

        $comment = new Comment();

        $comment->setAuthor($this->getUser());

        $comment->setProduct($product->find($productId));

        $comment->setContent($commentValue);

       // $form = $this->createForm(CommentType::class, $comment);
       // $form->handleRequest($request);

       // if ($form->isSubmitted() && $form->isValid() ) {
            
            $entityManager->persist($comment);
            $entityManager->flush();

            $commentId = $comment->getId();

            $newComment = $entityManager->getRepository(Comment::class)->find($commentId);

            //var_dump($newComment);

            $encoders = [new JsonEncoder()];
            $normalizer = [new ObjectNormalizer()];

            $serializer = new Serializer($normalizer, $encoders);

           /* $jsonObject = $serializer->serialize($newComment, 'json', [
                'circular_reference_handler' => function ($object) {
                    return $object;
                }
            ]); */

            $jsonObject = $serializer->serialize($newComment, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                    return $object->getId();
                }
            ]); 

            //$serialized = $this->get("serializer")->serialize($newComment, "json");

            $response = new Response($jsonObject);

            $response->headers->set("Content-Type", "application/json");

            return $response;

        //    return $this->redirectToRoute('comment_index');
       // }

       /* return $this->render('comment/new.html.twig', [
            'comment' => $comment,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/{id}", name="comment_show", methods={"GET"})
     */
    public function show(Comment $comment): Response
    {
        return $this->render('comment/show.html.twig', [
            'comment' => $comment,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="comment_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Comment $comment): Response
    {
        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('comment_index');
        }

        return $this->render('comment/edit.html.twig', [
            'comment' => $comment,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="comment_delete", methods={"DELETE"})
     */
    public function delete(Request $request, Comment $comment): Response
    {
        if ($this->isCsrfTokenValid('delete'.$comment->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($comment);
            $entityManager->flush();
        }

        return $this->redirectToRoute('comment_index');
    }
}
