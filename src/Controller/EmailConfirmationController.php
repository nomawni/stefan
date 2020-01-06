<?php

namespace App\Controller;

use App\Entity\EmailConfirmation;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/email/confirmation")
 */
class EmailConfirmationController extends AbstractController
{
    /**
     * @Route("/", name="email_confirmation")
     */
    public function index()
    {
        return $this->render('email_confirmation/index.html.twig', [
            'controller_name' => 'EmailConfirmationController',
        ]);
    }

    /**
     * @IsGranted("ROLE_USER")
     * @Route("/new", name="new_email_confirmaiton", methods={"GET"}, options={"expose"=true})
     */
    public function new(Request $request) {
        
        $user = $this->getUser();
        if(!$user) {
            return $this->json([
                "message" => "You have to be connected !",
                "code" => 403
            ], 403);
        }
        
        if($user->getIsAccountConfirmed()) {

            return $this->json([
                "message" => "Your account has been validated !",
                "code" => 403
            ], 403);
        }
        $entityManager = $this->getDoctrine()->getManager();

        // If there is an expired token already in the database we remove it
        $isUserToken = $entityManager->getRepository(EmailConfirmation::class)->findOneBy(["user" => $user]);

        $regular = date("U");

        if($isUserToken && $isUserToken->getToken() && $isUserToken->getToken() > $regular) {
            
            return $this->json([
                "message" => " The token we've sent is still valide. Please check your email !",
                "code" => 403
            ], 403);
        }

        if($isUserToken && $isUserToken->getToken() && $isUserToken->getToken() < $regular) {
           $entityManager->remove($isUserToken);
           $entityManager->flush();
        }

        $emailConfirmation = new EmailConfirmation();
        $token = $this->generateToken(6);
        $expires = date("U") + 600;
        $emailConfirmation->setToken($token);
        $emailConfirmation->setExpires($expires);
        $emailConfirmation->setUser($user);

        // 946741642800  946741795800  946741879800 1577903133

        $entityManager->persist($emailConfirmation);
        $entityManager->flush();
       /* var_dump($token);
        var_dump($expires);
        var_dump($regular);
        if($expires >= $regular) {
            echo "true";
        }else {
            echo "false";
        }
        echo (1577904177 - 1577904278); */
        $data = array("message" => "We've sent you a code in your an email, please check your email and validate your acoount");
        return new JsonResponse($data);
    }

    /**
     * @IsGranted("ROLE_USER")
     * @Route("/valide", name="validate_email_confirmation", methods={"POST"}, options={"expose"=true})
     */
    public function validate(Request $request) {
       
         $user = $this->getUser();
         
         if(!$user) {
             return $this->json([
                 "message" => "You have to be connected !",
                 "code" => 403
             ], 403);
         }

         $content = json_decode($request->getContent());

         $token = $content->token;

         if(!$token) {
             return $this->json([
                 "message" => "The token can not be null !",
                 "code" => 403
             ], 403);
         }

         $entityManager = $this->getDoctrine()->getManager();
         $emailConfirmation = $entityManager->getRepository(EmailConfirmation::class)->findBy(["user" => $user])[0];

         $dbToken = $emailConfirmation->getToken();

         if(!$dbToken) {
             return $this->json([
                 "message" => " There is no token for you in the database ",
                 "code" => 403
             ], 403);
         }
        
         if($dbToken != $token) {
            return $this->json([
                "message" => "The token you've entered is not valid !",
                "code" => 403
            ], 403);
         }

         $expires = date("U");

         $dbExpires = $emailConfirmation->getExpires();

         if($dbExpires < $expires) {
             return $this->json([
                 "message" => "The token has expired ! Please try again ",
                 "code" => 403
             ], 403);
         }

         $user->setIsAccountConfirmed(true);

         $entityManager->flush();

         $data = array("message" => "Your account has been confirmed successfully !");

         return new JsonResponse($data);
    }

    private function generateToken($length) {
    
        $min = pow(10, $length -1);
        $max = pow(10, $length) -1;

        return mt_rand($min, $max);
    }
} 
