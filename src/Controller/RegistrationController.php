<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\LoginFormAuthenticator;
use Stripe\ApiOperations\Retrieve;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="app_register", options={"expose"=true})
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, GuardAuthenticatorHandler $guardHandler, LoginFormAuthenticator $authenticator): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

       // var_dump(filter_input_array(INPUT_POST, $request->getContent()));
        $username = filter_var($request->request->get("username"), FILTER_SANITIZE_STRING);
        $email = filter_var($request->request->get("email"), FILTER_VALIDATE_EMAIL);
        $password = filter_var($request->request->get("plainPassword"), FILTER_SANITIZE_STRING);
        $token = filter_var($request->request->get("_token"), FILTER_SANITIZE_STRING);

        $listErrors = validateRegistration($username, $email, $password);

        $userByEmail = $this->getDoctrine()->getRepository(User::class)->findOneBy(["email" => $email]);
        if($userByEmail) {
            return $this->json([
                "message" => "The email already eixsts in our database !",
                "code" => 403
            ], 403);
        }

        $userByUsername = $this->getDoctrine()->getRepository(User::class)->findOneBy(["username" => $username]);
        if($userByUsername) {
            return $this->json([
                "message" => "the username already exists", 
                "code" => 403
            ], 403);
        }

        if($listErrors) {
            $data = $this->get("serializer")->serialize($listErrors, 'json');
            $response = new Response($data);
            $response->setStatusCode(Response::HTTP_BAD_REQUEST);
            $response->headers->set("Content-Type", "application/json"); 
            return $response;

        }

        /*var_dump($username);
        var_dump($email);
        var_dump($password);
        var_dump($token); */

        //return new Response($email);

        //if ($form->isSubmitted() && $form->isValid()) {
            if($this->isCsrfTokenValid('registration', $token)) {
                $user->setUsername($username);
                $user->setEmail($email);
            
            // encode the plain password
            $user->setPassword(
                $passwordEncoder->encodePassword(
                    $user,
                    //$form->get('plainPassword')->getData()
                    $password
                )
            );

            $user->setRoles(array("ROLE_USER"));
            $user->setSalt('');

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            // do anything else you need here, like send an email

            return $guardHandler->authenticateUserAndHandleSuccess(
                $user,
                $request,
                $authenticator,
                'main' // firewall name in security.yaml
            ); 
        }
            
      //  } 

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);  
    }
}

function validateRegistration($username, $email, $password) {

    $listErrors = [];

   if(!$username) {
       $listErrors["username"] = "Your username can not be empty";
   }

   if(strlen($username) < 5) {
       $listErrors["username"]  = "Your username can not be less than 5 characters long";
   }

   if(!$email) {
       $listErrors["email"]  = "Your email is not valid";
   }

   if(!$password) {
       $listErrors["password"]  = "Your password is not valid";
   }
   
   if(strlen($password) < 8) {
       $listErrors["password"] = "Your password can not be less than 8 characters long";
   }

   return $listErrors;
   
}
