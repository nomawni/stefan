<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrdersRepository")
 */
class Orders
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateOrdered;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $dateOrderUpdated;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $product;

    /**
     * @ORM\Column(type="datetime")
     */
    private $orderedAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Cart", mappedBy="orders")
     */
    private $cart;

    public function __construct()
    {
        $this->cart = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateOrdered(): ?\DateTimeInterface
    {
        return $this->dateOrdered;
    }

    public function setDateOrdered(\DateTimeInterface $dateOrdered): self
    {
        $this->dateOrdered = $dateOrdered;

        return $this;
    }

    public function getDateOrderUpdated(): ?\DateTimeInterface
    {
        return $this->dateOrderUpdated;
    }

    public function setDateOrderUpdated(?\DateTimeInterface $dateOrderUpdated): self
    {
        $this->dateOrderUpdated = $dateOrderUpdated;

        return $this;
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

    public function getOrderedAt(): ?\DateTimeInterface
    {
        return $this->orderedAt;
    }

    public function setOrderedAt(\DateTimeInterface $orderedAt): self
    {
        $this->orderedAt = $orderedAt;

        return $this;
    }

    /**
     * @return Collection|Cart[]
     */
    public function getCart(): Collection
    {
        return $this->cart;
    }

    public function addCart(Cart $cart): self
    {
        if (!$this->cart->contains($cart)) {
            $this->cart[] = $cart;
            $cart->setOrders($this);
        }

        return $this;
    }

    public function removeCart(Cart $cart): self
    {
        if ($this->cart->contains($cart)) {
            $this->cart->removeElement($cart);
            // set the owning side to null (unless already changed)
            if ($cart->getOrders() === $this) {
                $cart->setOrders(null);
            }
        }

        return $this;
    }
}
