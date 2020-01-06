<?php

namespace App\Repository;

use App\Entity\CommentRating;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CommentRating|null find($id, $lockMode = null, $lockVersion = null)
 * @method CommentRating|null findOneBy(array $criteria, array $orderBy = null)
 * @method CommentRating[]    findAll()
 * @method CommentRating[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRatingRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CommentRating::class);
    }

    // /**
    //  * @return CommentRating[] Returns an array of CommentRating objects
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
    public function findOneBySomeField($value): ?CommentRating
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
