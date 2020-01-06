<?php

namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    // /**
    //  * @return Comment[] Returns an array of Comment objects
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
    public function findCom($id) {
        return $this->createQueryBuilder("c")
               ->innerJoin("c.commentRatings", "comRating")
               ->select("c.id, comRating.action as ratingAction")
               ->andWhere("c.id = :comId")
               ->setParameter("comId", $id)
               ->getQuery()
               ->getResult();
    }
    public function findByRating($commentId, $rating) {
        
        return $this->createQueryBuilder("c")
               ->innerJoin("c.commentRatings", "comRating")
               ->select("COUNT(comRating) as amountRating")
               ->where("c.id = :id")
               ->andWhere("comRating.action = :val")
               ->setParameters(array('id' => $commentId,'val' => $rating))
               ->getQuery()
               ->getResult();
    }

    public function listReplies($commentId) {
        return $this->createQueryBuilder("c")
               ->innerJoin("c.commentsReplies","replies")
               ->innerJoin("replies.client", "client")
               ->select("replies")
               //->select("replies.id, replies.content, replies.repliedAt")
               ->where("c.id = :id")
               ->setParameter("id", $commentId)
               ->getQuery()
               ->getResult();
    }

    /*
    public function findOneBySomeField($value): ?Comment
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
