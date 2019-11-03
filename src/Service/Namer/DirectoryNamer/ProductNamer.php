<?php

namespace App\Service\Namer\DirectoryNamer;

use App\Entity\ProductImage;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class ProductNamer implements DirectoryNamerInterface {

    public function directoryName($object, \Vich\UploaderBundle\Mapping\PropertyMapping $mapping): string {

        if($object instanceof ProductImage) {
           // $dirName = $object->getProduct()->
        }
        
        return "product";
    }
}