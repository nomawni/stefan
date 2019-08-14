<?php

namespace App\EventSubscriber;

use App\Form\AvatarType;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

class AddAvatarFieldSubscriber implements EventSubscriberInterface{

    public static function getSubscribedEvents()
    {
        return [FormEvents::PRE_SET_DATA => "presetData"];
    }

    public function presetData(FormEvent $event) {

        $form = $event->getForm();
        $user = $event->getData();

        $form->add("avatar", AvatarType::class);
    }
}