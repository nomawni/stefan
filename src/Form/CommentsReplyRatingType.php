<?php

namespace App\Form;

use App\Entity\CommentsReplyRating;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CommentsReplyRatingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('action')
            ->add('createdAt')
            ->add('editedAt')
            ->add('client')
            ->add('commentsReply')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => CommentsReplyRating::class,
        ]);
    }
}
