<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommentsReplyRepository")
 */
class CommentsReply
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Comment", inversedBy="commentsReplies")
     * @ORM\JoinColumn(nullable=false)
     */
    private $comment;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     */
    private $client;

    /**
     * @ORM\Column(type="text")
     */
    private $content;

    /**
     * @ORM\Column(type="datetime")
     */
    private $repliedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $editedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CommentsReplyRating", mappedBy="commentsReply",
     * orphanRemoval=true)
     */
    private $commentsReplyRatings;

    public function __construct()
    {
        $this->commentsReplyRatings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getComment(): ?Comment
    {
        return $this->comment;
    }

    public function setComment(?Comment $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getClient(): ?User
    {
        return $this->client;
    }

    public function setClient(?User $client): self
    {
        $this->client = $client;

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

    public function getRepliedAt(): ?\DateTimeInterface
    {
        return $this->repliedAt;
    }

    public function setRepliedAt(\DateTimeInterface $repliedAt): self
    {
        $this->repliedAt = $repliedAt;

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

    /**
     * @return Collection|CommentsReplyRating[]
     */
    public function getCommentsReplyRatings(): Collection
    {
        return $this->commentsReplyRatings;
    }

    public function addCommentsReplyRating(CommentsReplyRating $commentsReplyRating): self
    {
        if (!$this->commentsReplyRatings->contains($commentsReplyRating)) {
            $this->commentsReplyRatings[] = $commentsReplyRating;
            $commentsReplyRating->setCommentsReply($this);
        }

        return $this;
    }

    public function removeCommentsReplyRating(CommentsReplyRating $commentsReplyRating): self
    {
        if ($this->commentsReplyRatings->contains($commentsReplyRating)) {
            $this->commentsReplyRatings->removeElement($commentsReplyRating);
            // set the owning side to null (unless already changed)
            if ($commentsReplyRating->getCommentsReply() === $this) {
                $commentsReplyRating->setCommentsReply(null);
            }
        }

        return $this;
    }

    public function hasUserReplyRating(User $user) {

        foreach($this->commentsReplyRatings as $rating) {
            if($rating->getClient() === $user) return  $rating;
        }

        return false;
    }
}
