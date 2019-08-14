<?php

namespace App\Service\Namer\DirectoryNamer;

use Vich\UploaderBundle\Naming\DirectoryNamerInterface;
use Symfony\Component\Security\Core\Security;

class AvatarNamer implements DirectoryNamerInterface {

   private $user;

   public function __construct(Security $security)
   {
       $this->user = $security->getUser();
   }

   public function directoryName($object, \Vich\UploaderBundle\Mapping\PropertyMapping $mapping): string {

       return $this->user->getUserName().$this->user->getId();
   }
}