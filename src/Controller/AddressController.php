<?php

namespace App\Controller;

use App\Entity\Address;
use App\Form\AddressType;
use App\Repository\AddressRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/**
 * @Route("/address")
 */
class AddressController extends AbstractController
{
    /**
     * @Route("/", name="address_index", methods={"GET"})
     */
    public function index(AddressRepository $addressRepository): Response
    {
        return $this->render('address/index.html.twig', [
            'addresses' => $addressRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="address_new", methods={"GET","POST"}, options={"expose"=true})
     */
    public function new(Request $request): Response
    {
        $user = $this->getUser();
        if(!$user) {
            return $this->json([
                "message" => "You have be connected to add a new address !",
                "code" => 403
            ], 403);
        }
        $content = json_decode($request->getContent());
        
        $address = new Address();
        $address->setClient($user);
        $address->setCountry("Germany");
        $address->setFullName($content->fullName);
        $address->setPostalCode($content->postalCode);
        $address->setStreet($content->street);
        $address->setPhoneNumber($content->phoneNumber);
        $address->setCareOf($content->careOf);
        $address->setCity($content->city);

        $encoder = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoder]);
       /* $serializer->deserialize($content, Address::class, 'json', [
            AbstractNormalizer::OBJECT_TO_POPULATE => $address
        ] );
         */
        //$form = $this->createForm(AddressType::class, $address);
       
       // $form->handleRequest($request);

       /* if ($form->isSubmitted() && $form->isValid()) { */
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($address);
            $entityManager->flush();

            $data = $serializer->serialize($address, 'json', [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                    return $object->getId();
                }
            ]);

            return JsonResponse::fromJsonString($data);

        /*    return $this->redirectToRoute('address_index');
        }

        

        return $this->render('address/new.html.twig', [
            'address' => $address,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/{id}", name="address_show", methods={"GET"}, options={"expose"=true})
     */
    public function show(Address $address): Response
    {
       // return $this->render('address/show.html.twig', [
        //    'address' => $address,
       // ]);
       $normalizer = new ObjectNormalizer();
       $encoder = new JsonEncoder();
       $serializer = new Serializer([$normalizer], [$encoder]);

       $data = $serializer->serialize($address, 'json', [
           AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
               return $object->getId();
           }
       ]);

       return JsonResponse::fromJsonString($data);
    }

    /**
     * @Route("/list/addresses", name="list_addresses", methods={"GET"}, options={"expose"=true})
     */
    public function getListAddresses(Request $request):Response {
        $user = $this->getUser();

        if(!$user) {
            return $this->json([
                "message" => "You are not connected",
                "code" => 403
            ], 403);
        }

        $listAddresses = $this->getDoctrine()->getRepository(Address::class)->findAllByClient($user);

        return new JsonResponse($listAddresses);


    }

    /**
     * @Route("/{id}/edit", name="address_edit", methods={"GET","POST"}, options={"expose"=true})
     */
    public function edit(Request $request, Address $address): Response
    {
       // $form = $this->createForm(AddressType::class, $address);
       // $form->handleRequest($request);
       $content = $request->getContent();
       $user = $this->getUser();
       if(!$user) {
           return $this->json([
               "message" => "You are not connected !",
               "code" => 403
           ], 403);
       }
       if($user !== $address->getClient()) {
           return $this->json([
               "message" => "You are not the owner of this address !",
               "code" => 403
           ], 403);
       }

       $normalizer = new ObjectNormalizer();
       $encoder = new JsonEncoder();
       $serializer = new Serializer([$normalizer], [$encoder]);
       $serializer->deserialize($content, Address::class, 'json',[
           AbstractNormalizer::OBJECT_TO_POPULATE => $address,
           AbstractNormalizer::ATTRIBUTES =>["phoneNumber", "city", "street", "postalCode", "fullName",
                                            "instructions", "careOf"],
           AbstractObjectNormalizer::DEEP_OBJECT_TO_POPULATE => true,
           AbstractObjectNormalizer::SKIP_NULL_VALUES => true
       ]);

       $content = $request->getContent();


      //  if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

     $data = $serializer->serialize($address, 'json', [
         AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
             return $object->getId();
         }
     ]);

      return JsonResponse::fromJsonString($data);

        //    return $this->redirectToRoute('address_index');
     //   }

       // return $this->render('address/edit.html.twig', [
       //     'address' => $address,
       //     'form' => $form->createView(),
      //  ]);
    }

    /**
     * @Route("/{id}/delete", name="address_delete", methods={"DELETE", "GET"}, options={"expose"=true})
     */
    public function delete(Request $request, Address $address): Response
    {
       // if ($this->isCsrfTokenValid('delete'.$address->getId(), $request->request->get('_token'))) {
           $user = $this->getUser();
           if(!$user) {
               return $this->json([
                   "message" => "You have to be connected to delete this address !",
                   "code" => 403
               ], 403);
           }

           if($address->getClient() !== $user) {
               return $this->json([
                   "message" => "You are not author of this address !",
                   "code" => 403
               ], 403);
           } 
           // $address->removeUser($user);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($address);
            $entityManager->flush();

         $data = array("message" => "The address has been deleted successfully !", "code" => 200);

          return new JsonResponse($data);
       // }

      //  return $this->redirectToRoute('address_index');
    }
}
