<?php

namespace App\Controller;

use App\Entity\IsRequestPasswordChangeValide;
use App\Entity\PasswordReset;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/password/reset")
 */
class PasswordResetController extends AbstractController
{
    /**
     * @IsGranted("ROLE_USER")
     * @Route("/validate", name="validate_password", methods={"POST"}, options={"expose"=true})
     */
     public function validatePassword(Request $request) {

        $entityManager = $this->getDoctrine()->getManager();
        $user = $this->getUser();

        if(!$user) {
            return $this->json([
                "message" => "You have to be connected to change your password !",
                "code" => 403
            ], 403);
        }
        
        $content = json_decode($request->getContent());
        $oldPassword = $content->oldPassword;
        $userPassword = $user->getPassword();

        $isPasswordValid = password_verify($oldPassword, $userPassword);
        if(!$isPasswordValid) {
            return $this->json([
                "message" => "Your password is invalid",
                "code" => 403
            ], 403);
        }

        $isPasswordChangeRequested = $this->getDoctrine()->getRepository(IsRequestPasswordChangeValide::class)->findOneBy(["user" => $user]);
        if($isPasswordChangeRequested) {
            $isPasswordChangeRequested->setIsRequestValide(true);

        }else {
            $isRequested = new IsRequestPasswordChangeValide();
            $isRequested->setUser($user);
            $isRequested->setIsRequestValide(true);

            $entityManager->persist($isRequested);
        }

        $entityManager->flush();
        $data = array("message" => "You can now change your password ");

        return new JsonResponse($data);
     }

     /**
     * @Route("/verify-email", name="verify_user_email", methods={"POST"}, options={"expose"=true})
     */
    public function verifyEmail(Request $request){
        $user = $this->getUser();

        if($user) {
            return $this->json([
                "message" => "You are already connected !",
                "code" => 403
            ], 403);
        }

        $content = json_decode($request->getContent());
        $email = filter_var($content->email, FILTER_SANITIZE_EMAIL);

        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json([
                "message" => "Your email address is not valide",
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();

        $findUser = $entityManager->getRepository(User::class)->findOneBy(["email" => $email]);

        if(!$findUser) {
            return $this->json([
                "message" => "This email does not exist in our database !",
                "code" => 403
            ], 403);
        }

        if($findUser) {
            // We first check if the user has already a token 
            $hasUserToken = $entityManager->getRepository(PasswordReset::class)->findOneBy(["user" => $findUser]);
            $isTokenExpired = date("U");
            if($hasUserToken && $hasUserToken->getToken() > $isTokenExpired) {
                return $this->json([
                    "message" => "Your token is still valide",
                    "code" => 403
                ], 403);
            }

            $token = $this->generateToken(6);
            $expires = date("U") + 600;

            if($hasUserToken && $hasUserToken->getToken() < $isTokenExpired) {
                // if the token has expired we update it and insert a new token 
                $hasUserToken->setToken($token);
                $hasUserToken->setExpires($expires);
            }
            // if the user does not a have token yet we create a new one 
            $passwordReset = new PasswordReset();

            if(!$hasUserToken) {
            $passwordReset->setToken($token);
            $passwordReset->setExpires($expires);
            $passwordReset->setUser($findUser);

            $entityManager->persist($passwordReset);
            }
            $entityManager->flush();

            $data = array("message" => "We have sent you a token in your email account. Please check your email an validate the token");

            return new JsonResponse($data);
        }

    }

    /**
     * @Route("/valide-token", name="password_reset_validate_token", methods={"POST"}, options={"expose"=true})
     */
    public function validateToken(Request $request) {

        $content = json_decode($request->getContent());

        $token = filter_var($content->token, FILTER_SANITIZE_NUMBER_INT);

        if(!$token) {
            return $this->json([
                "message" => "The token can not be null !",
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $passwordReset = $entityManager->getRepository(PasswordReset::class)->findOneBy(["token" => $token]);

        if(!$passwordReset || !$passwordReset->getToken()) {
            return $this->json([
                "message" => " There is no token for you in the database ",
                "code" => 403
            ], 403);
        }
        $dbToken = $passwordReset->getToken();
       
        if($dbToken != $token) {
           return $this->json([
               "message" => "The token you've entered is not valid !",
               "code" => 403
           ], 403);
        }

        $expires = date("U");
        $dbExpires = $passwordReset->getExpires();

        if($dbExpires < $expires) {
            return $this->json([
                "message" => "The token has expired ! Please try again ",
                "code" => 403
            ], 403);
        }

       // $user->setIsAccountConfirmed(true);

        $entityManager->flush();
        $data = array("message" => "The token is valide, you can now change your password ");
        return new JsonResponse($data);
   }

   /**
    * @Route("/reset-password", name="reset_forget_password", methods={"POST"}, options={"expose"=true})
    * we need a separate method , because we assume the user is not connected when he has forgotten his password
    */ 
    public function resetPassword(Request $request, UserPasswordEncoderInterface $encoder) {

        $content = json_decode($request->getContent());

        if(!$content) {
            return $this->json([
                "message" => "The content can not be null",
                "code" => 403
            ], 403);
        }

        $email = $content->email;
        $token = $content->token;
        $newPassword = $content->newPassword;
        $repeatNewPassword = $content->repeatNewPassword;

        if(!$newPassword) {
            return $this->json([
                "message" => "The new password can not be null",
                "code" => 403
            ], 403);
        }
        if(strlen($newPassword) < 8) {
            return $this->json([
                "message" => "The new password must be at least 8 characters long ",
                "code" => 403
            ], 403);
        }

        if($newPassword !== $repeatNewPassword) {
            return $this->json([
                "message" => "The two passwords does not match ",
                "code" => 403
            ], 403);
        }

        if(!$email || !$token) {
            return $this->json([
                "message" => "You have to go through all the steps to rest your password ",
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $user = $entityManager->getRepository(User::class)->findOneBy(["email" => $email]);

        if(!$user) {
            return $this->json([
                "message" => "Your email is not valide",
                "code" => 403
            ], 403);
        }
        $resetPassword = $entityManager->getRepository(PasswordReset::class)->findOneBy(["user" => $user]);

        if(!$resetPassword) {
            return $this->json([
                "message" => "Your request to change your password is invalide",
                "code" => 403
            ], 403);
        }
         
        if($resetPassword->getToken() != $token) {
            return $this->json([
                "message" => "Your token is invalide",
                "code" => 403
            ], 403);
        }

        $expires = date("U");
        if($resetPassword->getExpires() < $expires) {
            return $this->json([
                "message" => "Your token has expired ",
                "code" => 403
            ], 403);
        }

        $user->setPassword($encoder->encodePassword($user, $newPassword));

       // $entityManager->remove($resetPassword);

        $entityManager->flush();

        $data = array("message" => "Your password has been reset successfully ");

        return new JsonResponse($data);

    }

     /**
      * @Route("/change", name="reset_password", methods={"POST"}, options={"expose"=true})
      */
      public function changePassword(Request $request, UserPasswordEncoderInterface $encoder) {
        
        $content = json_decode($request->getContent());
        $user = $this->getUser();

        if(!$user) {
            return $this->json([
                "message" => "You have to be connected to change your password !",
                "code" => 403
            ], 403);
        }

        if(!$content) {
            return $this->json([
                "message" => "The content is invalide !",
                "code" => 403
            ], 403);
        }

        $newPassword = $content->newPassword;
        $repeatNewPassword = $content->repeatNewPassword;

        if($newPassword !== $repeatNewPassword) {
            return $this->json([
                "message" => "The passwords does not match",
                "code" => 403
            ], 403);
        }

        $isRequestedValide = $this->getDoctrine()->getRepository(IsRequestPasswordChangeValide::class)->findOneBy(["user" => $user]);
       
       
        if(!$isRequestedValide || !$isRequestedValide->getIsRequestValide()) {
            return $this->json([
                "message" => "Your request to change your password is invalide !",
                "code" => 403
            ], 403);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $user->setPassword($encoder->encodePassword($user, $newPassword));
        $isRequestedValide->setIsRequestValide(false);
       // $entityManager->remove($isRequestedValide);
        $entityManager->flush();

        $data = array("message" => "Your password has been changed successfully ");

        return new JsonResponse($data);
      }

      private function generateToken($length) {
    
        $min = pow(10, $length -1);
        $max = pow(10, $length) -1;

        return mt_rand($min, $max);
    }
}
