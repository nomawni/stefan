<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190813152452 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE product_image (id INT AUTO_INCREMENT NOT NULL, image_size INT NOT NULL, image_name VARCHAR(255) NOT NULL, final_name VARCHAR(255) NOT NULL, extension VARCHAR(255) NOT NULL, date_uploaded DATETIME NOT NULL, final_path VARCHAR(255) NOT NULL, mime_type VARCHAR(255) NOT NULL, original_name VARCHAR(255) NOT NULL, date_updated DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE avatar DROP avatar_file');
        $this->addSql('ALTER TABLE product ADD product_image_id INT NOT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADF6154FFA FOREIGN KEY (product_image_id) REFERENCES product_image (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04ADF6154FFA ON product (product_image_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04ADF6154FFA');
        $this->addSql('DROP TABLE product_image');
        $this->addSql('ALTER TABLE avatar ADD avatar_file VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('DROP INDEX UNIQ_D34A04ADF6154FFA ON product');
        $this->addSql('ALTER TABLE product DROP product_image_id');
    }
}
