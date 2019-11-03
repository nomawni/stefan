<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Form\UserType;
use App\Form\Type\ChangePasswordType;
use Proxies\__CG__\App\Entity\Avatar;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\Constraints\Json;
use Symfony\Component\VarDumper\Cloner\Data;

/**
     * Controller used to manage current user.
     *
     * @Route("/profile")
     * @IsGranted("ROLE_USER")
     *
     */

class UserController extends AbstractController
{
    /**
     * @Route("/", methods="GET", name="user_profile")
     */
    public function index()
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /** 
     * @Route("/show", name="user_show", methods={"GET", "POST"}, options={"expose"=true})
     */ 

     public function show(Request $request):Response {

        $manager = $this->getDoctrine()->getManager();
        $user = $manager->getRepository(User::class)->findOneByUsername($this->getUser()->getUsername());

        $encoders = new JsonEncoder();

        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoders]);

        //$data = $this->get("serializer")->serialize($user, 'json');

        $data = $serializer->serialize($user, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;
     }

    /**
     * @Route("/edit", methods={"GET", "POST"}, name="user_edit", options={"expose"=true})
     */
    public function edit(Request $request): Response
    {
        $user = $this->getUser();
        $avatar = new Avatar();
        $encoder = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoder]);
        //$avatarName = $_FILES["avatarFile"] ?? "";
        //$content = $request->getContent();
        //$content = $request->get("data");
        $content = $request->get("data");
        $contentObject = \json_decode($content);
        //var_dump($contentObject);
        //var_dump($content);
        //var_dump($avatarName);
       // $form = $this->createForm(UserType::class, $user);
       // $form->handleRequest($request);

       // if ($form->isSubmitted() && $form->isValid()) { 

            //if($request->isMethod("POST")) {

            if($contentObject->username && $contentObject->email) {
            $user->setUsername($contentObject->username);
            $user->setEmail($contentObject->email);
            /* $this->get("serializer")->deserialize($content, User::class, 'json', 
                                 ['object_to_populate' => $user]); */
            
            //if($avatarName) {
            if(isset($_FILES["avatarFile"])) {

            $avatarFile = $_FILES["avatarFile"];
            //$imgTmp = $_FILES["avatarFile"]["tmp_name"]; //$avatarFile["tmp_name"];
            //var_dump($imgTmp);
            //$imgName = $_FILES["avatarFile"]["name"]; //$avatarFile["name"];
            //var_dump($imgName);
            //$imgType = $_FILES["avatarFile"]["type"]; //$avatarFile["type"];
            //var_dump($avatarFile["type"]);

            //$avatarToUpload = new UploadedFile($imgTmp, $imgName, $imgType); 
            $avatarToUpload = new UploadedFile($avatarFile["tmp_name"], $avatarFile["name"], $avatarFile["type"]);       
            //var_dump($avatarToUpload);              
            $avatar->setAvatarFile($avatarToUpload);             
            $user->setAvatar($avatar);
            var_dump($avatar); 
            //var_dump($user);
            
            }

            $this->getDoctrine()->getManager()->flush();

           /* $this->get("serializer")->deserialize($content, User::class, 'json', 
            ['object_to_populate' => $user]); */

           // $this->getDoctrine()->getManager()->flush();

            $data = $serializer->serialize($user, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            //var_dump($data);

            $response = new Response($data);
            $response->headers->set("Content-Type", "application/json");
            return $response; //new JsonResponse($user);
            }
        //}
            return  new JsonResponse($user); //$response;

            //return $this->redirectToRoute('user_edit');
      /*  }

        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/change-password", methods={"GET", "POST"}, name="user_change_password")
     */
    public function changePassword(Request $request, UserPasswordEncoderInterface $encoder): Response
    {
        $user = $this->getUser();

        $form = $this->createForm(ChangePasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword($encoder->encodePassword($user, $form->get('newPassword')->getData()));

            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('security_logout');
        }

        return $this->render('user/change_password.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
