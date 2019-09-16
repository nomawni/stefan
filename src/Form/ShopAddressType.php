<?php

namespace App\Form;

use App\Entity\ShopAddress;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ShopAddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('street')
            ->add('city')
            ->add('postalCode')
            ->add('country')
            ->add('website')
            ->add('email')
            ->add('phoneNumer')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ShopAddress::class,
        ]);
    }
}
