<?php

namespace App\Repository;

use App\Entity\ShopCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ShopCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShopCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShopCategory[]    findAll()
 * @method ShopCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShopCategoryRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ShopCategory::class);
    }

    // /**
    //  * @return ShopCategory[] Returns an array of ShopCategory objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ShopCategory
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
