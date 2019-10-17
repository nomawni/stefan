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
        $encoder = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoder]);
        
        //$content = $request->getContent();

        //$content = $request->get("data");
        $content = $request->get("data");

        $contentObject = \json_decode($content);

        $user = $this->getUser();

        $userToUpdate = new User();

        $avatar = new Avatar();

        //$formData = $request->files;

       // $form = $this->createForm(UserType::class, $user);
       // $form->handleRequest($request);

       // if ($form->isSubmitted() && $form->isValid()) { 

            if($request->isMethod("POST")) {

            if($contentObject->username && $contentObject->email) {

            $user->setUsername($contentObject->username);
            $user->setEmail($contentObject->email);

            $this->get("serializer")->deserialize($content, User::class, 'json', 
                                 ['object_to_populate' => $userToUpdate]);
            

            if(isset($_FILES["avatarFile"])) {

            $avatarFilte = $_FILES["avatarFile"];

            //var_dump($avatarFilte);

            $avatarToUpload = new UploadedFile($avatarFilte["tmp_name"], $avatarFilte["name"]);
                         
            $avatar->setAvatarFile($avatarToUpload);
                         
            $user->setAvatar($avatar);
            }

            $this->getDoctrine()->getManager()->flush();

            $data = $serializer->serialize($user, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            $response = new Response($data);
            $response->headers->set("Content-Type", "application/json");

            return $response; //new JsonResponse($user);
            }
        }

       /// }

       // var_dump($user->getAvatar()->getHeadshot());

      //  var_dump($form->get("originalName")->getData());

          //var_dump($request->get("data"));

          //var_dump($_FILES);

          //var_dump($content);

          //var_dump($avatar);

          //var_dump($formData);

          //var_dump($request->get('data'));

          //var_dump($content->email);

          //$entityManager = $this->getDoctrine()->getManager()->getRepository(User::class);

          

           

          /* $encoder = new JsonEncoder();

           $normalizer = new ObjectNormalizer();

           $serializer = new Serializer([$normalizer], [$encoder]);

           $this->get("serializer")->deserialize($content, User::class, 'json', 
                                 ['object_to_populate' => $user]);

            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', 'user.updated_successfully');

            //$data = $this->get("serializer")->serialize($user, 'json');

            $data = $serializer->serialize($user, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {

                    return $object->getId();
                }
            ]); */

            //$response = new Response(json_encode($user));

            //$response->headers->set("Content-Type", "applicatin/json");

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
