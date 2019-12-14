<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductImage;
use App\Entity\Shop;
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
        $product->setClient($this->getUser());

        $content = json_decode($content);
        $tagsContainer = explode(',',$content->tags->name);

        $product->setName($content->name);
        $product->setPrice($content->price);
        $product->setQuantity($content->quantity);
        $product->setSize($content->size);
        $product->setDescription($content->description);

        $shopId = intval($content->shop->name);
        $shop = $entityManager->getRepository(Shop::class)->find($shopId);
        if($shop) {
            $product->setShop($shop);
        }

        $categoryId = intval($content->category->name);
        $category =  $entityManager->getRepository(Category::class)->find($categoryId);

        if($category){
          $product->setCategory($category);
        }
        
        foreach($tagsContainer as $tag) {
            $tags = new Tag();
            $tags->setName($tag);
            $product->addTag($tags);
                                        
            }
        
        if($_FILES["productImages"]) {
        $productFiles = $_FILES["productImages"];
        if(count($productFiles) > 1) {

                for($i = 0; $i < count($_FILES["productImages"]["name"]); $i++){
                $productImage = new ProductImage();

                $imgTmp = $_FILES["productImages"]["tmp_name"][$i];
                $imgName = $_FILES["productImages"]["name"][$i];
                $imgType = $_FILES["productImages"]["type"][$i];

                $imageToUpload = new UploadedFile($imgTmp, $imgName, $imgType);    
                $productImage->setProductImage($imageToUpload);
                $product->addProductImage($productImage);
                
                }
            }else {
            $productFile = $_FILES["productImages"];

        $imageToUpload = new UploadedFile($productFile["tmp_name"], $productFile["name"], $productFile["type"]);    
        $productImage->setProductImage($imageToUpload);
        
          $product->addProductImage($productImage);
             }
        }
            //$entityManager->detach($category);
            $entityManager->persist($product);
            //$entityManager->merge($product);
            $entityManager->flush();

        $encoders  = new JsonEncoder();
        $normalizer = new ObjectNormalizer();
        $serializer = new Serializer([$normalizer], [$encoders]);

        $productId = $product->getId();

        //return  JsonResponse::fromJsonString($data); //$response;
        return new JsonResponse($productId);
      
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

        $prodContent->tags = explode(',',serialize($prodContent->tags));
    
       $product->setName($prodContent->name);
        $product->setPrice($prodContent->price);
        $product->setQuantity($prodContent->quantity);
        $product->setSize($prodContent->size); 
        $product->setDescription($prodContent->description);

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
            
            //$product->setProductImage($productImage);
            $product->addProductImage($productImage);
                                        
        }
        
         $this->getDoctrine()->getManager()->flush();

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

        $data = $serializer->serialize($product, 'json', [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function($object){
                return $object->getId();
            }
        ]);  
        $response = new Response($data);

        $response->headers->set("Content-Type", "application/json");

        return $response; 
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
