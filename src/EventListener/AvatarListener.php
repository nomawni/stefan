<?php

namespace App\EventListener;
use Vich\UploaderBundle\Event\Event;
use App\Entity\Avatar;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use Doctrine\ORM\Event\PreUpdateEventArgs;

class AvatarListener {

    private $helper;

    public function __construct(UploaderHelper $uploaderHelper)
    {
        $this->helper = $uploaderHelper; 
    }

    /**
     * @ORM\PrePersist()
     * 
     */
    public function prePersist(LifecycleEventArgs $args) {

         $entity = $args->getEntity();

         if($entity instanceof Avatar) {
             $entity->setFinalName($entity->getAvatarFile()->getFilename());
             $entity->setAvatarSize($entity->getAvatarFile()->getSize());
             $entity->setExtension($entity->getAvatarFile()->getExtension());
             $entity->setDestination($entity->getAvatarFile()->getPath());
             $entity->setFinalPath($this->helper->asset($entity, 'avatarFile'));
             $entity->setMimeType($entity->getAvatarFile()->getMimeType());
         }
    }

    /**
     * @ORM\PreUpdate()
     */

    public function preUpdate(PreUpdateEventArgs $args) {

        $entity = $args->getEntity();

        if($entity instanceof Avatar) {
            $entity->setFinalName($entity->getAvatarFile()->getFilename());
            
            $entity->setAvatarSize($entity->getAvatarFile()->getSize());
            $entity->setExtension($entity->getAvatarFile()->getExtension());
           // $entity->setBasename($entity->getAvatarFile()->getBasename());
           $entity->setDestination($entity->getAvatarFile()->getPathname());
            $entity->setFinalPath($this->helper->asset($entity, 'avatarFile'));
            $entity->setMimeType($entity->getAvatarFile()->getMimeType());
        }

    }

    public function onVichUploaderPreUpload(Event $event) {

        $object = $event->getObject();

        if($object instanceof Avatar) {
            
           // $object->setAvatarName($object->getAvatarFile()->getFilename());

            // var_dump($object->getAvatarName());
        }
    }
}