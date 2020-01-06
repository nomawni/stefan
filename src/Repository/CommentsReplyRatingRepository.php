<?php

namespace App\Repository;

use App\Entity\CommentsReplyRating;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CommentsReplyRating|null find($id, $lockMode = null, $lockVersion = null)
 * @method CommentsReplyRating|null findOneBy(array $criteria, array $orderBy = null)
 * @method CommentsReplyRating[]    findAll()
 * @method CommentsReplyRating[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentsReplyRatingRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CommentsReplyRating::class);
    }

    // /**
    //  * @return CommentsReplyRating[] Returns an array of CommentsReplyRating objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CommentsReplyRating
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
