<?php

namespace App\Repository;

use App\Entity\IsRequestPasswordChangeValide;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method IsRequestPasswordChangeValide|null find($id, $lockMode = null, $lockVersion = null)
 * @method IsRequestPasswordChangeValide|null findOneBy(array $criteria, array $orderBy = null)
 * @method IsRequestPasswordChangeValide[]    findAll()
 * @method IsRequestPasswordChangeValide[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IsRequestPasswordChangeValideRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, IsRequestPasswordChangeValide::class);
    }

    // /**
    //  * @return IsRequestPasswordChangeValide[] Returns an array of IsRequestPasswordChangeValide objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?IsRequestPasswordChangeValide
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
