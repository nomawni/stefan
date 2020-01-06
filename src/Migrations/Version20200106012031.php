<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200106012031 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE shop DROP FOREIGN KEY FK_AC6A4CA28FC44253');
        $this->addSql('ALTER TABLE shop DROP FOREIGN KEY FK_AC6A4CA2C0316BF2');
        $this->addSql('DROP INDEX IDX_AC6A4CA2C0316BF2 ON shop');
        $this->addSql('ALTER TABLE shop DROP shop_category_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE shop ADD shop_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE shop ADD CONSTRAINT FK_AC6A4CA28FC44253 FOREIGN KEY (shop_address_id) REFERENCES shop_address (id)');
        $this->addSql('ALTER TABLE shop ADD CONSTRAINT FK_AC6A4CA2C0316BF2 FOREIGN KEY (shop_category_id) REFERENCES shop_category (id)');
        $this->addSql('CREATE INDEX IDX_AC6A4CA2C0316BF2 ON shop (shop_category_id)');
    }
}
