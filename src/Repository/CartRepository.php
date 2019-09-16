<?php

namespace App\Repository;

use App\Entity\Cart;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Cart|null find($id, $lockMode = null, $lockVersion = null)
 * @method Cart|null findOneBy(array $criteria, array $orderBy = null)
 * @method Cart[]    findAll()
 * @method Cart[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CartRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Cart::class);
    }

    public function countUserCart($user) {
        $db = $this->createQueryBuilder('c')
                   ->select("count(c.id)")
                   ->where('c.client = :user')
                   ->setParameter('user', $user);

             return $db->getQuery()->getSingleScalarResult();
              
    }

    public function allCarts($user) {
        $db = $this->createQueryBuilder('c')
        //           ->from('Cart','c')
       //            ->select('c.id')
                   ->join('c.client','t')
                   ->addSelect('t')
                   ->join('c.products', 'p')
                   ->addSelect('p')
                   ->join('p.category', 'cat')
                   ->addSelect('cat')
                   ->leftJoin('p.shop', 's')
                   ->addSelect('s')
                   ->join('p.productImage', 'prodImage')
                   ->addSelect('prodImage')
                   ->join('t.avatar', 'a')
                   ->addSelect('a')
                   ->select('c.id, c.createdAt, cat.name as catName,
                    p.name as prodName, p.price as prodPrice, p.quantity as prodQ,
                    p.size as prodSize, p.description as prodDesc,
                    t.username, a.finalPath, s.name as shopName,
                    prodImage.finalPath as prodFinalPath')
                   ->where('c.client = :user')
                   ->orderBy('c.createdAt', 'ASC')
                   ->setParameter('user', $user);

            return $db->getQuery()->execute();

    }

    public function removeCart($cartId, $userId) {

        $db = $this->createQueryBuilder('c')
                   ->delete('c')
                   ->andWhere('c.id = :cartId')
                   ->andWhere("c.client = :userId")
                   ->delete("c")
                   ->setParameters(array("cartId" => $cartId, "userId" => $userId));

                   return $db->getQuery()->execute();
    }

    // /**
    //  * @return Cart[] Returns an array of Cart objects
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
    public function findOneBySomeField($value): ?Cart
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
