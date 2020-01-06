<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommentRepository")
 */
class Comment
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="comments")
     * @ORM\JoinColumn(nullable=false)
     */
    private $product;

    /**
     * @ORM\Column(type="text")
     */
    private $content;

    /**
     * @ORM\Column(type="datetime")
     */
    private $publishedAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     */
    private $author;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CommentRating", mappedBy="comment", orphanRemoval=true)
     */
    private $commentRatings;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CommentsReply", mappedBy="comment", orphanRemoval=true)
     */
    private $commentsReplies;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $editedAt;

    public function __construct()
    {
        $this->publishedAt = new \DateTimeImmutable();
        $this->commentRatings = new ArrayCollection();
        $this->commentsReplies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeInterface
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeInterface $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection|CommentRating[]
     */
    public function getCommentRatings(): Collection
    {
        return $this->commentRatings;
    }

    public function addCommentRating(CommentRating $commentRating): self
    {
        if (!$this->commentRatings->contains($commentRating)) {
            $this->commentRatings[] = $commentRating;
            $commentRating->setComment($this);
        }

        return $this;
    }

    public function removeCommentRating(CommentRating $commentRating): self
    {
        if ($this->commentRatings->contains($commentRating)) {
            $this->commentRatings->removeElement($commentRating);
            // set the owning side to null (unless already changed)
            if ($commentRating->getComment() === $this) {
                $commentRating->setComment(null);
            }
        }

        return $this;
    }

    public function hasUserRating(User $user) {

        foreach($this->commentRatings as $rating) {
            if($rating->getClient() === $user) return $rating;

        }
        return false;
    }

    public function countRating() {
        
        $i =0; $j = 0;
        foreach($this->commentRatings as $comRating) {
            if($comRating->getAction() == "like") {
                $i++;
            }
            if($comRating->getAction() == "dislike") {
                $j++;
            }
        }
        $response = array("amountLike" => $i, "amountDislike" => $j);
        return $response;
    }

    /**
     * @return Collection|CommentsReply[]
     */
    public function getCommentsReplies(): Collection
    {
        return $this->commentsReplies;
    }

    public function addCommentsReply(CommentsReply $commentsReply): self
    {
        if (!$this->commentsReplies->contains($commentsReply)) {
            $this->commentsReplies[] = $commentsReply;
            $commentsReply->setComment($this);
        }

        return $this;
    }

    public function removeCommentsReply(CommentsReply $commentsReply): self
    {
        if ($this->commentsReplies->contains($commentsReply)) {
            $this->commentsReplies->removeElement($commentsReply);
            // set the owning side to null (unless already changed)
            if ($commentsReply->getComment() === $this) {
                $commentsReply->setComment(null);
            }
        }

        return $this;
    }

    public function getEditedAt(): ?\DateTimeInterface
    {
        return $this->editedAt;
    }

    public function setEditedAt(?\DateTimeInterface $editedAt): self
    {
        $this->editedAt = $editedAt;

        return $this;
    }
}
