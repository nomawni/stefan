<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductImage;
use App\Entity\Tag;
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
use App\Form\DataTransformer\TagArrayToStringTransformer;
use Exception;
use Proxies\__CG__\App\Entity\Category;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;

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
     * @Route("/new", name="product_new", methods={"GET","POST"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function new(Request $request): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        //$data = $request->getContent();

        $content = $request->get("data");

        $product = new Product();
        $tags = new Tag();
        $product->setClient($this->getUser());
        $productImage = new ProductImage();

        /*$this->get('serializer')->deserialize($content, Product::class, 'json', 
                                               ['object_to_populate' => $product]); */

        $content = json_decode($content);
        $tagsContainer = explode(',',serialize($content->tags));
        $content->tags = explode(',',serialize($content->tags));
        unset($content->tags);
        //var_dump($content);
       
        //$productToUpdate = new Product();
        //$productToUpdate->setClient($this->getUser());

        $content = json_encode($content);

        //$myProduct = $this->get('serializer')->deserialize($content, Product::class, 'json'); 
        $this->get('serializer')->deserialize($content, Product::class, 'json', 
                               ['object_to_populate' => $product]); 
        //$myProduct->setClient($this->getUser());
        
        //$content = json_decode($content);
        
        foreach($tagsContainer as $tag) {

            $tags->setName($tag);
            //$tagsContainer[] = $tags;
            $product->addTag($tags);
            //$myProduct->addTag($tags);
                                        
            }

        if( $_FILES["productImage"]) {

        $productFile = $_FILES["productImage"];

        $imageToUpload = new UploadedFile($productFile["tmp_name"], $productFile["name"], $productFile["type"]);    
        $productImage->setProductImage($imageToUpload);
        
        $product->setProductImage($productImage);
        //$myProduct->setProductImage($productImage);
        }
            $entityManager->persist($product);
            //$entityManager->merge($product);
            $entityManager->flush();

        $encoders  = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoders]);

        $newProduct = $product;

        /*$data = $serializer->serialize($newProduct, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object) {
                return $object->getId();
            }
        ]);  */
        $productId = $product->getId();

        //$data = $this->get("serializer")->serialize($product, 'json');

        //return  JsonResponse::fromJsonString($data); //$response;
        return new JsonResponse($productId);
        /*$form = $this->createForm(Product1Type::class, $product);
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
        ]); */
    }

    /**
     * @Route("/show/{id}", name="product_show", methods={"GET"}, options={"expose"=true})
     */
    public function show(Product $product): Response
    { 
        $rep = $this->getDoctrine()->getManager()->getRepository(Product::class);
        
        $encoders = new JsonEncoder();

        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoders]);

        $data = $serializer->serialize($product, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  

       // $data = $this->get("serializer")->serialize($product, 'json');

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response;

    }

    /**
     * @Route("/edit/{id}", name="product_edit", methods={"GET", "POST"}, options={"expose"=true})
     */
    public function edit(Request $request,Product $product): Response
    {

        $encoders = new JsonEncoder();

        $normalizer = new ObjectNormalizer();

        $serializer = new Serializer([$normalizer], [$encoders]);

        if($request->isMethod("POST")) {

        //$content = $request->getContent();
        $content = $request->get('data');
        //$container = json_decode($request->getContent());
        $container = \json_decode($content);

        $tags = new Tag();
        $category = new Category();
        $productImage = new ProductImage();

        $productUpdate = new Product();

        $productUpdate->setClient($this->getUser());
        //$tagsContainer = [];

        $prodContent = $container->content;

        //$deserializedContent->tags = explode(',',$deserializedContent->tags);

        $prodContent->tags = explode(',',serialize($prodContent->tags));
        
        //$prodContent = json_encode($prodContent);

        //$prodContent = $deserializedContent;
    
       $product->setName($prodContent->name);
        $product->setPrice($prodContent->price);
        $product->setQuantity($prodContent->quantity);
        $product->setSize($prodContent->size); 
        $product->setDescription($prodContent->description);

        /*foreach($prodContent->tags as $tag) {

        $tags->setName($tag);
        //$tagsContainer[] = $tags;
        $product->addTag($tags);

        } */

        //$category->setName($prodContent->category);
        //$product->addTag($tagsContainer);
        //$product->setCategory($category);

        //$productImage->setProductImage($prodContent->productImage);

        //$productImage->setProductImage($productImageToUpload);

        //$product->setProductImage($prodContent->productImage);
        //$product->setProductImage($productImage);

        $prodContent = json_encode($prodContent);

        //var_dump($prodContent);

         $this->get('serializer')->deserialize($prodContent, Product::class, 'json', 
                                               ['object_to_populate' => $productUpdate]);
        $prodContent = json_decode($prodContent);

        foreach($prodContent->tags as $tag) {

            $tags->setName($tag);
            //$tagsContainer[] = $tags;
            $product->addTag($tags);
                                        
        }

        if(isset($_FILES["productImage"])){

            $productFile = $_FILES["productImage"];
                                        
            $productImageToUpload = new UploadedFile($productFile["tmp_name"], $productFile["name"]);
                                        
            $productImage->setProductImage($productImageToUpload);
            $product->setProductImage($productImage);
                                        
        }
        
         //var_dump($prodContent);
        
         $this->getDoctrine()->getManager()->flush();

        //$prodToUpdate->setClient($this->getUser());  

        //$data = $this->get("serializer")->serialize($product, 'json');

        //var_dump($productUpdate);

        $data = $serializer->serialize($product, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  

        //var_dump($product);

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");
         return $response;
        } 
        //var_dump($content);
        //var_dump($product); 
       /* $form = $this->createForm(Product1Type::class, $product);
        $form->handleRequest($request);

        var_dump($form);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('product_index');
        } */

        

        $data = $serializer->serialize($product, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  

        //$data = json_encode($product);

        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response; 

        /*return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form->createView(),
        ]); */
    }

    /**
     * @Route("/delete/{id}", name="product_delete", methods={"DELETE", "POST"}, options={"expose"=true})
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
