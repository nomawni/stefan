<?php

namespace App\Repository;

use App\Entity\WhishList;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method WhishList|null find($id, $lockMode = null, $lockVersion = null)
 * @method WhishList|null findOneBy(array $criteria, array $orderBy = null)
 * @method WhishList[]    findAll()
 * @method WhishList[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WhishListRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, WhishList::class);
    }

    // /**
    //  * @return WhishList[] Returns an array of WhishList objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('w.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?WhishList
    {
        return $this->createQueryBuilder('w')
            ->andWhere('w.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
