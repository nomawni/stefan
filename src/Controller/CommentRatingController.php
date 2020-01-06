<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\CommentRating;
use App\Form\CommentRatingType;
use App\Repository\CommentRatingRepository;
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
 * 
 * @Route("/comment/rating")
 */
class CommentRatingController extends AbstractController
{
    /**
     * @Route("/", name="comment_rating_index", methods={"GET"})
     */
    public function index(CommentRatingRepository $commentRatingRepository): Response
    {
        return $this->render('comment_rating/index.html.twig', [
            'comment_ratings' => $commentRatingRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new/{id}", name="comment_rating_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request, Comment $comment): Response
    {
        $user = $this->getUser();
        $entityManager = $this->getDoctrine()->getManager();
        // The action variable specify wether we we've removed or added a rating
        $action = null;
        
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

        $hasUserRating = $comment->hasUserRating($user);

        if($hasUserRating) {

            if($hasUserRating->getAction() == $data) {
                $entityManager->remove($hasUserRating);
                $entityManager->flush();
                $action = "removed";
            }else {
                $hasUserRating->setAction($data);
                $hasUserRating->setModifiedAt(new \DateTimeImmutable());
                $entityManager->flush();
                $action = "updated";
            }
        }else {
            $commentRating = new CommentRating();
            $commentRating->setClient($user);
            $commentRating->setComment($comment);
            $commentRating->setCreatedAt(new \DateTimeImmutable());
            $commentRating->setAction($data);

            $entityManager->persist($commentRating);
            $entityManager->flush();
            $action = "created";
        }

        $id = $request->get("id");
        $newComment = $this->getDoctrine()->getRepository(Comment::class);

        $normalizer = new ObjectNormalizer();
        $encoder = new JsonEncoder();
        $serializer = new Serializer([$normalizer], [$encoder]);
        
        $comRating = $newComment->findCom($id);
        //$countRating = $newComment->countRating();
        $amountLikes = $newComment->findByRating($id, "like")[0];  //$countRating["amountLike"];
        //->getCommentRatings()->count(["action" => "like"]);
        $amountDislikes =  $newComment->findByRating($id, "dislike")[0]; //$countRating["amountDislike"]; 
         //$comment->getCommentRatings()->count(["action" => "dislike"]);
        $responseContent = array("action" => $action, "rating" => $data, 
                                 "amountLikes" => $amountLikes,
                                 "amountDislikes" => $amountDislikes,
                                 "id" => $id,
                                 "comRating" => $comRating
                                // "commentRating" => $newCommentRating
                          );
        //$response->s

        return new JsonResponse($responseContent);
       
       // $form = $this->createForm(CommentRatingType::class, $commentRating);
       // $form->handleRequest($request);

       // if ($form->isSubmitted() && $form->isValid()) {
            
            

           // return $this->redirectToRoute('comment_rating_index');
       // }

        //return $this->render('comment_rating/new.html.twig', [
         //   'comment_rating' => $commentRating,
        //    'form' => $form->createView(),
       // ]);
    }

    /**
     * @Route("/{id}", name="comment_rating_show", methods={"GET"})
     */
    public function show(CommentRating $commentRating): Response
    {
        return $this->render('comment_rating/show.html.twig', [
            'comment_rating' => $commentRating,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="comment_rating_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, CommentRating $commentRating): Response
    {
        $form = $this->createForm(CommentRatingType::class, $commentRating);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('comment_rating_index');
        }

        return $this->render('comment_rating/edit.html.twig', [
            'comment_rating' => $commentRating,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="comment_rating_delete", methods={"DELETE"})
     */
    public function delete(Request $request, CommentRating $commentRating): Response
    {
        if ($this->isCsrfTokenValid('delete'.$commentRating->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($commentRating);
            $entityManager->flush();
        }

        return $this->redirectToRoute('comment_rating_index');
    }
}
