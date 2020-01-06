<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AvatarRepository")
 * @Vich\Uploadable
 */
class Avatar
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * 
     * @Vich\UploadableField(mapping="user_avatar", fileNameProperty="avatarName", size="avatarSize",
     * mimeType="mimeType", originalName="originalName")
     * @var File
     */
    private $avatarFile;

    /**
     * @ORM\Column(type="integer")
     */
    private $avatarSize;

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
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $dateUpdated;

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
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $destination;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $avatarName;

    public function getAvatarSize(): ?int
    {
        return $this->avatarSize;
    }

    public function setAvatarSize(?int $avatarSize): self
    {
        $this->avatarSize = $avatarSize;

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

    public function setExtension(string $extension): self
    {
        $this->extension = $extension;

        return $this;
    }

    public function getAvatarFile(): ?File
    {
        return $this->avatarFile;
    }

    public function setAvatarFile(File $avatarFile): self
    {
        $this->avatarFile = $avatarFile;

        if(null !== $avatarFile) {
            $this->dateUploaded = new \DateTimeImmutable();
           // $this->setFinalName($this->avatarFile->getFilename());
        }

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

    public function getDateUpdated(): ?\DateTimeInterface
    {
        return $this->dateUpdated;
    }

    public function setDateUpdated(?\DateTimeInterface $dateUpdated): self
    {
        $this->dateUpdated = $dateUpdated;

        return $this;
    }

    public function getFinalPath(): ?string
    {
        return $this->finalPath;
    }

    public function setFinalPath(string $finalPath): self
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

    public function getDestination(): ?string
    {
        return $this->destination;
    }

    public function setDestination(?string $destination): self
    {
        $this->destination = $destination;

        return $this;
    }

    public function getAvatarName(): ?string
    {
        return $this->avatarName;
    }

    public function setAvatarName(?string $avatarName): self
    {
        $this->avatarName = $avatarName;

        return $this;
    }

}
