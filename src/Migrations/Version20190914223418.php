<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190914223418 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE whish_lists_product');
        $this->addSql('ALTER TABLE product ADD whishlist_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD86007B38 FOREIGN KEY (whishlist_id) REFERENCES whish_lists (id)');
        $this->addSql('CREATE INDEX IDX_D34A04AD86007B38 ON product (whishlist_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE whish_lists_product (whish_lists_id INT NOT NULL, product_id INT NOT NULL, INDEX IDX_B26946FC4F0D57CB (whish_lists_id), INDEX IDX_B26946FC4584665A (product_id), PRIMARY KEY(whish_lists_id, product_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE whish_lists_product ADD CONSTRAINT FK_B26946FC4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE whish_lists_product ADD CONSTRAINT FK_B26946FC4F0D57CB FOREIGN KEY (whish_lists_id) REFERENCES whish_lists (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD86007B38');
        $this->addSql('DROP INDEX IDX_D34A04AD86007B38 ON product');
        $this->addSql('ALTER TABLE product DROP whishlist_id');
    }
}
