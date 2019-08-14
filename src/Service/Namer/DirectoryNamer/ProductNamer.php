<?php

namespace App\Service\Namer\DirectoryNamer;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class ProductNamer implements DirectoryNamerInterface {

    public function directoryName($object, \Vich\UploaderBundle\Mapping\PropertyMapping $mapping): string {

        return "product";
    }
}