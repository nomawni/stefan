<?php

namespace App\EventListener;

use App\Entity\ProductImage;
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
            $entity->setFinalName($entity->getProductImage()->getFilename());
            $entity->setExtension($entity->getProductImage()->getExtension());
            $entity->setFinalPath($this->helper->asset($entity, 'productImage'));
            $entity->setMimeType($entity->getProductImage()->getMimeType());
        }
     }

}