<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\Product1Type;
use App\Repository\ProductRepository;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\JsonSerializableNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;

/**
 * @Route("/product")
 */
class ProductController extends AbstractController
{

   /* public static function getSubscribedServices()
    {
        return [
            'jms_serializer' => SerializerInterface::class,
        ];
    } */

    /**
     * @Route("/", name="product_index", methods={"GET"})
     */
    public function index(ProductRepository $productRepository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="product_new", methods={"GET","POST"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function new(Request $request): Response
    {
        $data = $request->getContent();

        var_dump($data);
        $product = new Product();
        $form = $this->createForm(Product1Type::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($product);
            $entityManager->flush();

            return $this->redirectToRoute('app_homepage');
        }

        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/show/{id}", name="product_show", methods={"GET"})
     */
    public function show(Product $product): Response
    { 
        $rep = $this->getDoctrine()->getManager()->getRepository(Product::class);

       // $product = new Product();
        
       // $id = $request->get("id");

       // $id = intval($id);

       // $product = $rep->find($id);
        
       // var_dump($prod);

       //var_dump($product);
        
        $encoders = new JsonEncoder();

        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoders]);

        $data = $serializer->serialize($product, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  

       // $data = $this->get("serializer")->serialize($product, 'json');

       //$serializer = SerializerBuilder::create()->build();

       //$data = $this->container->get("jms_serializer")->serialize($product, 'json', SerializationContext::create());

      //$data = $serializer->serialize($product, 'json');
       //$data = $this->jMSSerializer->serialize($product, 'json');
       //var_dump($data);

       // $data = json_encode($prod);

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/{id}/edit", name="product_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Product $product): Response
    {
        $form = $this->createForm(Product1Type::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('product_index');
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/delete/{id}", name="product_delete", methods={"DELETE", "POST"})
     */
    public function delete(Request $request, Product $product): Response
    {
        //if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $action = "error";

            if($product->getClient() == $this->getUser()) {

            $entityManager->remove($product);
            $entityManager->flush();

            $action ="deleted";
            }

            $data = array("action" => $action);

            $data = json_encode($data);

            $response = new Response($data);

            $response->headers->set("Content-Type", "application/json");

            return $response;
       // }

       // return $this->redirectToRoute('product_index');
    }
}
