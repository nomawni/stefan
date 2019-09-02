<?php

namespace App\Form;

use App\Entity\Product;
use App\Entity\Category;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class Product1Type extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('price')
            ->add('quantity')
            ->add('size')
            ->add('description')
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'query_builder' => function(EntityRepository $er) {
                    return $er->createQueryBuilder('c')
                       ->orderBy('c.name', 'ASC');
                },
                'choice_label' => "name",
            
            ])
            ->add('tags', TagsInputType::class, [
                'label' => 'The Tags',
                'required' => false,
            ])
            ->add('productImage', ProductImageType::class,
            )
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
