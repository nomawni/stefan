<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190813160645 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cart ADD orders_id INT NOT NULL, ADD created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE cart ADD CONSTRAINT FK_BA388B7CFFE9AD6 FOREIGN KEY (orders_id) REFERENCES orders (id)');
        $this->addSql('CREATE INDEX IDX_BA388B7CFFE9AD6 ON cart (orders_id)');
        $this->addSql('ALTER TABLE orders DROP FOREIGN KEY FK_E52FFDEE1AD5CDBF');
        $this->addSql('DROP INDEX UNIQ_E52FFDEE1AD5CDBF ON orders');
        $this->addSql('ALTER TABLE orders ADD product_id INT NOT NULL, ADD ordered_at DATETIME NOT NULL, DROP cart_id');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEE4584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('CREATE INDEX IDX_E52FFDEE4584665A ON orders (product_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cart DROP FOREIGN KEY FK_BA388B7CFFE9AD6');
        $this->addSql('DROP INDEX IDX_BA388B7CFFE9AD6 ON cart');
        $this->addSql('ALTER TABLE cart DROP orders_id, DROP created_at');
        $this->addSql('ALTER TABLE orders DROP FOREIGN KEY FK_E52FFDEE4584665A');
        $this->addSql('DROP INDEX IDX_E52FFDEE4584665A ON orders');
        $this->addSql('ALTER TABLE orders ADD cart_id INT DEFAULT NULL, DROP product_id, DROP ordered_at');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEE1AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_E52FFDEE1AD5CDBF ON orders (cart_id)');
    }
}
