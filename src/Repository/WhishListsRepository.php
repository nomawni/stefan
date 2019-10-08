<?php

namespace App\Repository;

use App\Entity\WhishLists;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method WhishLists|null find($id, $lockMode = null, $lockVersion = null)
 * @method WhishLists|null findOneBy(array $criteria, array $orderBy = null)
 * @method WhishLists[]    findAll()
 * @method WhishLists[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WhishListsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, WhishLists::class);
    }

    public function countUserWishlist($user) {

        $db = $this->createQueryBuilder("w")
                   ->select("count(w.id)")
                   ->where("w.customer =:user")
                   ->setParameter("user", $user);

                   return $db->getQuery()->getSingleScalarResult();
    }

    public function allWhishlists($user) {
        $db = $this->createQueryBuilder('w')
                   ->join('w.products', 'p')
                   ->addSelect('p')
                   ->join('p.productImage', 'prodImage')
                   ->addSelect('prodImage')
                   ->join('p.category', 'cat')
                   ->addSelect('cat')
                   ->join('p.shop', 's')
                   ->addSelect('s')
                   ->join('w.customer', 'c')
                   ->addSelect('c')
                   ->join("c.avatar", "a")
                   ->addSelect("a")
                   ->select('w.dateAdded, p.name as prodName, 
                   cat.name as catName, s.name as shopName,
                   p.price as prodPrice, p.quantity as prodQ,
                   p.size as prodSize, p.description as prodDesc,
                   a.finalPath, prodImage.finalPath as prodFinalPath')
                   ->where('w.customer = :user')
                   ->orderBy('w.dateAdded', 'ASC')
                   ->setParameter('user', $user);

            return $db->getQuery()->execute();
    }

    // /**
    //  * @return WhishLists[] Returns an array of WhishLists objects
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
    public function findOneBySomeField($value): ?WhishLists
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
