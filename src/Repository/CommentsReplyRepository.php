<?php

namespace App\Repository;

use App\Entity\CommentsReply;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CommentsReply|null find($id, $lockMode = null, $lockVersion = null)
 * @method CommentsReply|null findOneBy(array $criteria, array $orderBy = null)
 * @method CommentsReply[]    findAll()
 * @method CommentsReply[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentsReplyRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CommentsReply::class);
    }

    // /**
    //  * @return CommentsReply[] Returns an array of CommentsReply objects
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

    public function findComReply($id) {
        return $this->createQueryBuilder("c")
               ->innerJoin("c.commentsReplyRatings", "replyRating")
               ->select("c.id, replyRating.action as ratingAction")
               ->andWhere("c.id = :replyId")
               ->setParameter("replyId", $id)
               ->getQuery()
               ->getResult();
    }
    public function findByReplyRating($commentId, $rating) {
        
        return $this->createQueryBuilder("c")
               ->innerJoin("c.commentsReplyRatings", "replyRating")
               ->select("COUNT(replyRating) as amountReplyRating")
               ->where("c.id = :id")
               ->andWhere("replyRating.action = :val")
               ->setParameters(array('id' => $commentId,'val' => $rating))
               ->getQuery()
               ->getResult();
    }

    /*
    public function findOneBySomeField($value): ?CommentsReply
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
