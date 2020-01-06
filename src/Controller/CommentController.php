<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentsReply;
use App\Entity\Product;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use DateTimeImmutable;
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
     * @Route("/new", name="comment_new", methods={"GET","POST"}, options={"expose"=true})
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
            
            $entityManager->persist($comment);
            $entityManager->flush();
            $commentId = $comment->getId();
            $newComment = $entityManager->getRepository(Comment::class)->find($commentId);

            $encoders = new JsonEncoder();
            $normalizer = new ObjectNormalizer();
            $serializer = new Serializer([$normalizer], [$encoders]);

            $jsonObject = $serializer->serialize($newComment, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                    return $object->getId();
                }
            ]); 

            $response = new Response($jsonObject);
            $response->headers->set("Content-Type", "application/json");
            return $response;

    }

    /**
     * @Route("/list/replies/{id}", name="comment_list_replies", methods={"GET"}, options={"expose"=true})
     */
    public function getListReplies(Request $request, Comment $comment): Response {

        $commentId = $request->get("id");
        if(!$commentId) {
            return $this->json([

            ], 403);
        }
        $commentRepository = $this->getDoctrine()->getRepository(Comment::class);
        $replyRepository = $this->getDoctrine()->getRepository(CommentsReply::class);

        //$listReplies = $replyRepository->findBy(["comment" => $comment]);
        //$commentRepository->listReplies($commentId); // $comment->getCommentsReplies();

        $encoders = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoders]);

        $response = $serializer->serialize($comment, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);

        return JsonResponse::fromJsonString($response);

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
     * @Route("/{id}/edit", name="comment_edit", methods={"GET","POST"}, options={"expose"=true})
     */
    public function edit(Request $request, Comment $comment): Response
    {
        $user = $this->getUser();
        if(!$user) {
            return $this->json([
                "message" => "You are not connected !",
                "code" => 403
            ], 403);
        }

        if($user !== $comment->getAuthor()) {
            return $this->json([
                "message" => "You are not the author of the comment !",
                "code" => 403
            ], 403);
        }

        $data = json_decode($request->getContent());
        $content = $data->content;
        if(!$content) {
            return $this->json([
                "message" => "The content can not be null !",
                "code" => 403
            ], 403);
        }

        $comment->setContent($content);
        $comment->setEditedAt(new DateTimeImmutable());
        //$form = $this->createForm(CommentType::class, $comment);
        //$form->handleRequest($request);

        //if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();
        
            $normalizer = new ObjectNormalizer();
            $encoder  = new JsonEncoder();
            $serializer = new Serializer([$normalizer], [$encoder]);
            
            $response = $serializer->serialize($comment, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            return JsonResponse::fromJsonString($response);

           // return $this->redirectToRoute('comment_index');
        //}

       /* return $this->render('comment/edit.html.twig', [
            'comment' => $comment,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/{id}/delete", name="comment_delete", methods={"DELETE", "POST"}, options={"expose"=true})
     */
    public function delete(Request $request, Comment $comment): Response
    {
        //if ($this->isCsrfTokenValid('delete'.$comment->getId(), $request->request->get('_token'))) {
            $user = $this->getUser();
            if(!$user) {
                return $this->json([
                    "message" => "You are not connected !",
                    "code" => 403
                ], 403);
            }

            if($user !== $comment->getAuthor()) {
                return $this->json([
                    "message" => "You are not the author of the comment !",
                    "code" => 403
                ], 403);
            }
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($comment);
            $entityManager->flush();

            $responseContent = array("message" => "The comment has been deleted completely",
            "code" => "deleted");

            return new JsonResponse($responseContent);
       // }

       // return $this->redirectToRoute('comment_index');
    }
}
