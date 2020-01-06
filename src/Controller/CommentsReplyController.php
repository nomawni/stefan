<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentsReply;
use App\Form\CommentsReplyType;
use App\Repository\CommentsReplyRepository;
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
 * @Route("/comments/reply")
 */
class CommentsReplyController extends AbstractController
{
    /**
     * @Route("/", name="comments_reply_index", methods={"GET"})
     */
    public function index(CommentsReplyRepository $commentsReplyRepository): Response
    {
        return $this->render('comments_reply/index.html.twig', [
            'comments_replies' => $commentsReplyRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="comments_reply_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request): Response
    {
        $user = $this->getUser();
        if(!$user) {
            return $this->json([

            ], 403);
        }
        $commentsReply = new CommentsReply();
        $data = json_decode($request->getContent());
        $entityManager = $this->getDoctrine()->getManager();
        $commentId = intval($data->commentId);
        $replyContent = $data->content;
        $commentManager = $this->getDoctrine()->getRepository(Comment::class);

        $commentsReply->setClient($user);
        $commentsReply->setComment($commentManager->find($commentId));
        $commentsReply->setContent($replyContent);
        $commentsReply->setRepliedAt(new \DateTimeImmutable());

        $entityManager->persist($commentsReply);
        $entityManager->flush();

        $replyId = $commentsReply->getId();
        $newReply = $entityManager->getRepository(CommentsReply::class)->find($replyId);

        $encoders = [new JsonEncoder()];
        $normalizer = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizer, $encoders);

        $serializedReply = $serializer->serialize($newReply, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);
        $response = new Response($serializedReply);
        $response->headers->set("Content-Type", "application/json");
        return $response;
    }

    /**
     * @Route("/{id}", name="comments_reply_show", methods={"GET"})
     */
    public function show(CommentsReply $commentsReply): Response
    {
        return $this->render('comments_reply/show.html.twig', [
            'comments_reply' => $commentsReply,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="comments_reply_edit", methods={"GET","POST"}, options={"expose"=true})
     */
    public function edit(Request $request, CommentsReply $commentsReply): Response
    {
        //$form = $this->createForm(CommentsReplyType::class, $commentsReply);
        //$form->handleRequest($request);

        //if ($form->isSubmitted() && $form->isValid()) {
            $user = $this->getUser();
            if(!$user) {
                return $this->json([
                    "message" => "You are not connected",
                    "code" => 403
                ], 403);
            }
            if($user !== $commentsReply->getClient()) {
                return $this->json([
                    "message" => "You are not the author of the comment",
                    "code" => 403
                ], 403);
            }
            $data = json_decode($request->getContent());

            $content = $data->content;
            $commentsReply->setContent($content);
            $commentsReply->setEditedAt(new \DateTimeImmutable());
            $this->getDoctrine()->getManager()->flush();

            $normalizer = new ObjectNormalizer();
            $encoders = new JsonEncoder();
            $serializer = new Serializer([$normalizer], [$encoders]);

            $response = $serializer->serialize($commentsReply, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            return  JsonResponse::fromJsonString($response);

           // return $this->redirectToRoute('comments_reply_index');
       // }

       /* return $this->render('comments_reply/edit.html.twig', [
            'comments_reply' => $commentsReply,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/{id}/delete", name="comments_reply_delete", methods={"DELETE", "POST"}, options={"expose"=true})
     */
    public function delete(Request $request, CommentsReply $commentsReply): Response
    {
       // if ($this->isCsrfTokenValid('delete'.$commentsReply->getId(), $request->request->get('_token'))) {
            $user = $this->getUser();
            if(!$user) {
                return $this->json([
                    "message" => "You are not connected",
                    "code" => 403
                ], 403);
            }
            if($commentsReply->getClient() !== $user) {
                return $this->json([
                    "message" => "You are not the author of the comment",
                    "code" => 403
                ], 403);
            }

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($commentsReply);
            $entityManager->flush();
            
            $responseContent = array("message" => "The comment has been deleted completely",
                                     "code" => "deleted");
            
            return new JsonResponse($responseContent);
       // }

        //return $this->redirectToRoute('comments_reply_index');
    }
}
