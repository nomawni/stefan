<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 */
class Product
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    private $price;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $size;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Cart", inversedBy="products")
     */
    private $carts;

    /**
     * @var Categories[]|ArrayCollection
     * @ORM\ManyToMany(targetEntity="App\Entity\Category", cascade={"persist"})
     */
    //private $categories;

    /**
     * @var Tag[]|ArrayCollection
     * @ORM\ManyToMany(targetEntity="App\Entity\Tag", cascade={"persist"})
     * @ORM\OrderBy({"name": "ASC"})
     */
    private $tags;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\ProductImage", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $productImage;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Category")
     * @ORM\JoinColumn(nullable=false)
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Shop", inversedBy="product")
     */
    private $shop;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\WhishLists", mappedBy="products")
     */
    private $whishLists;

    public function __construct()
    {
        $this->carts = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->whishLists = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function setPrice($price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(?int $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection|Cart[]
     */
    public function getCarts(): Collection
    {
        return $this->carts;
    }

    public function addCart(Cart $cart): self
    {
        if (!$this->carts->contains($cart)) {
            $this->carts[] = $cart;
        }

        return $this;
    }

    public function removeCart(Cart $cart): self
    {
        if ($this->carts->contains($cart)) {
            $this->carts->removeElement($cart);
        }

        return $this;
    }

    /**
     * @return Collection|Category[]
     */
   /* public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
        }

        return $this;
    }

    public function removeCategory(Category $category): self
    {
        if ($this->categories->contains($category)) {
            $this->categories->removeElement($category);
        }

        return $this;
    }

    /**
     * @return Collection|Tag[]
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag ...$tags): self
    {
        foreach($tags as $tag) {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }
    }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        if ($this->tags->contains($tag)) {
            $this->tags->removeElement($tag);
        }

        return $this;
    }

    public function getProductImage(): ?ProductImage
    {
        return $this->productImage;
    }

    public function setProductImage(ProductImage $productImage): self
    {
        $this->productImage = $productImage;

        return $this;
    }
    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getShop(): ?Shop
    {
        return $this->shop;
    }

    public function setShop(?Shop $shop): self
    {
        $this->shop = $shop;

        return $this;
    }

    /**
     * @return Collection|WhishLists[]
     */
    public function getWhishLists(): Collection
    {
        return $this->whishLists;
    }

    public function addWhishList(WhishLists $whishList): self
    {
        if (!$this->whishLists->contains($whishList)) {
            $this->whishLists[] = $whishList;
            $whishList->addProduct($this);
        }

        return $this;
    }

    public function removeWhishList(WhishLists $whishList): self
    {
        if ($this->whishLists->contains($whishList)) {
            $this->whishLists->removeElement($whishList);
            $whishList->removeProduct($this);
        }

        return $this;
    }

}
