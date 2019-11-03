<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="app_login", options={"expose"=true})
     */
    public function login(Request $request, Security $security, AuthenticationUtils $authenticationUtils): Response
    {
         if ($this->getUser() || $security->isGranted("ROLE_USER")) {
            
            return $this->redirectToRoute('app_homepage');
            $data = $this->get("serializer")->serialize($this->getUser(), 'json');
            $response = new Response(
                $data,
                Response::HTTP_OK,
                ["Content-Type" => "application/json"]
            );

            return $response; 
         }

       $this->saveTargetPath($request->getSession(), 'main', $this->generateUrl("app_homepage"));

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $dataArr = ['last_username' => $lastUsername, 'error' => $error];
        $data = $this->get("serializer")->serialize($dataArr, 'json');
        $response = new Response(
            $data,
            Response::HTTP_BAD_REQUEST, 
            ["Content-Type" => "application/json"]
        );

        return $response;

        //return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout()
    {
        throw new \Exception('This method can be blank - it will be intercepted by the logout key on your firewall');
    }
}
