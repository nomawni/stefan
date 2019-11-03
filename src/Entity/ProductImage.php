<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProductImageRepository")
 * @Vich\Uploadable
 */
class ProductImage
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Vich\UploadableField(mapping="products_image", fileNameProperty="imageName",
     * size="imageSize", mimeType="mimeType", originalName="originalName")
     * @var File 
     */
    private $productImage;

    /**
     * @ORM\Column(type="integer")
     */
    private $imageSize;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $imageName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $finalName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $extension;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateUploaded;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $finalPath;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $mimeType;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $originalName;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $dateUpdated;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="productImages")
     */
    private $product;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProductImage()
    {
        return $this->productImage;
    }

    public function setProductImage(?File $productImage): self
    {
        $this->productImage = $productImage;

        if(null !== $productImage) {
            $this->dateUploaded = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function setImageSize(?int $imageSize): self
    {
        $this->imageSize = $imageSize;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): self
    {
        $this->imageName = $imageName;

        return $this;
    }

    public function getFinalName(): ?string
    {
        return $this->finalName;
    }

    public function setFinalName(?string $finalName): self
    {
        $this->finalName = $finalName;

        return $this;
    }

    public function getExtension(): ?string
    {
        return $this->extension;
    }

    public function setExtension(?string $extension): self
    {
        $this->extension = $extension;

        return $this;
    }

    public function getDateUploaded(): ?\DateTimeInterface
    {
        return $this->dateUploaded;
    }

    public function setDateUploaded(\DateTimeInterface $dateUploaded): self
    {
        $this->dateUploaded = $dateUploaded;

        return $this;
    }

    public function getFinalPath(): ?string
    {
        return $this->finalPath;
    }

    public function setFinalPath(?string $finalPath): self
    {
        $this->finalPath = $finalPath;

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(?string $mimeType): self
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }

    public function setOriginalName(?string $originalName): self
    {
        $this->originalName = $originalName;

        return $this;
    }

    public function getDateUpdated(): ?\DateTimeInterface
    {
        return $this->dateUpdated;
    }

    public function setDateUpdated(?\DateTimeInterface $dateUpdated): self
    {
        $this->dateUpdated = $dateUpdated;

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

}
