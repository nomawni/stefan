<?php

namespace App\Controller;

use App\Entity\CommentsReply;
use App\Entity\CommentsReplyRating;
use App\Form\CommentsReplyRatingType;
use App\Repository\CommentsReplyRatingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/comments/reply/rating")
 */
class CommentsReplyRatingController extends AbstractController
{
    /**
     * @Route("/", name="comments_reply_rating_index", methods={"GET"})
     */
    public function index(CommentsReplyRatingRepository $commentsReplyRatingRepository): Response
    {
        return $this->render('comments_reply_rating/index.html.twig', [
            'comments_reply_ratings' => $commentsReplyRatingRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new/{id}", name="comments_reply_rating_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request, CommentsReply $commentsReply): Response
    {
        $user = $this->getUser();

        if(!$user) {
            return $this->json([
                "Message" => "You are not connected",
                "code" => 403
            ], 403);
        }

        $data = $request->getContent();//$request->get("data");
      
        if($data != "like" && $data != "dislike") {
            return $this->json([
                "Message" => "The rating value is not valid", 
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();

        $hasUserReplyRating = $commentsReply->hasUserReplyRating($user);

        if($hasUserReplyRating) {

            if($hasUserReplyRating->getAction() == $data) {
                $entityManager->remove($hasUserReplyRating);
                $entityManager->flush();
                $action = "removed";
            }else {
                $hasUserReplyRating->setAction($data);
                $hasUserReplyRating->setEditedAt(new \DateTimeImmutable());
                $entityManager->flush();
                $action = "updated";
            }
        }else {
            $commentsReplyRating = new CommentsReplyRating();
            $commentsReplyRating->setClient($user);
            $commentsReplyRating->setCommentsReply($commentsReply);
            $commentsReplyRating->setCreatedAt(new \DateTimeImmutable());
            $commentsReplyRating->setAction($data);

            $entityManager->persist($commentsReplyRating);
            $entityManager->flush();
            $action = "created";
        }

        $id = $request->get("id");
        $newReplyComment = $this->getDoctrine()->getRepository(CommentsReply::class);
        
        $replyRating = $newReplyComment->findComReply($id);

        $amountLikes = $newReplyComment->findByReplyRating($id, "like")[0];  //$countRating["amountLike"];
        //->getCommentRatings()->count(["action" => "like"]);
        $amountDislikes =  $newReplyComment->findByReplyRating($id, "dislike")[0]; //$countRating["amountDislike"]; 
         //$comment->getCommentRatings()->count(["action" => "dislike"]);
        $responseContent = array("action" => $action, "rating" => $data, 
                                 "amountLikes" => $amountLikes,
                                 "amountDislikes" => $amountDislikes,
                                 "id" => $id,
                                 "comRating" => $replyRating
                                // "commentRating" => $newCommentRating
                          );
        //$response->s

        return new JsonResponse($responseContent);
        

       /* $commentsReplyRating = new CommentsReplyRating();
        $form = $this->createForm(CommentsReplyRatingType::class, $commentsReplyRating);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($commentsReplyRating);
            $entityManager->flush();

            return $this->redirectToRoute('comments_reply_rating_index');
        }

        return $this->render('comments_reply_rating/new.html.twig', [
            'comments_reply_rating' => $commentsReplyRating,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/{id}", name="comments_reply_rating_show", methods={"GET"})
     */
    public function show(CommentsReplyRating $commentsReplyRating): Response
    {
        return $this->render('comments_reply_rating/show.html.twig', [
            'comments_reply_rating' => $commentsReplyRating,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="comments_reply_rating_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, CommentsReplyRating $commentsReplyRating): Response
    {
        $form = $this->createForm(CommentsReplyRatingType::class, $commentsReplyRating);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('comments_reply_rating_index');
        }

        return $this->render('comments_reply_rating/edit.html.twig', [
            'comments_reply_rating' => $commentsReplyRating,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="comments_reply_rating_delete", methods={"DELETE"})
     */
    public function delete(Request $request, CommentsReplyRating $commentsReplyRating): Response
    {
        if ($this->isCsrfTokenValid('delete'.$commentsReplyRating->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($commentsReplyRating);
            $entityManager->flush();
        }

        return $this->redirectToRoute('comments_reply_rating_index');
    }
}
