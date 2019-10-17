<?php

namespace App\EventListener;

use App\Entity\ProductImage;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class ProductImageListener {
    private $helper;

    public function __construct(UploaderHelper $helper) 
    {
        $this->helper = $helper;
    }

    /**
     * ORM\PrePersist()
     */

     public function prePersist(LifecycleEventArgs $args) {
         
        $entity = $args->getEntity();

        if($entity instanceof ProductImage) {
            if($entity->getProductImage()){
            $entity->setFinalName($entity->getProductImage()->getFilename());
            $entity->setExtension($entity->getProductImage()->getExtension());
            $entity->setFinalPath($this->helper->asset($entity, 'productImage'));
            $entity->setMimeType($entity->getProductImage()->getMimeType());
            }
        }
     }

     /**
     * ORM\PreRemove()
     */

    public function preRemove(LifecycleEventArgs $args) {
         
        $entity = $args->getEntity();

        if($entity instanceof ProductImage) {

          //  $this->em->remove($entity);
           // $this->em->flush();
        }
     }

     public function onPostRemove(Event $event)
    {
        // get the file object
        $removedFile = $event->getObject();
        // remove the file object from the database
       // $this->em->remove($removedFile);
       // $this->em->flush();
    }

}