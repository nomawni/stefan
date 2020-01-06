<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191224170932 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE cart_product (cart_id INT NOT NULL, product_id INT NOT NULL, INDEX IDX_2890CCAA1AD5CDBF (cart_id), INDEX IDX_2890CCAA4584665A (product_id), PRIMARY KEY(cart_id, product_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE whish_lists_product (whish_lists_id INT NOT NULL, product_id INT NOT NULL, INDEX IDX_B26946FC4F0D57CB (whish_lists_id), INDEX IDX_B26946FC4584665A (product_id), PRIMARY KEY(whish_lists_id, product_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cart_product ADD CONSTRAINT FK_2890CCAA1AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE cart_product ADD CONSTRAINT FK_2890CCAA4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE whish_lists_product ADD CONSTRAINT FK_B26946FC4F0D57CB FOREIGN KEY (whish_lists_id) REFERENCES whish_lists (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE whish_lists_product ADD CONSTRAINT FK_B26946FC4584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE product_cart');
        $this->addSql('DROP TABLE product_whish_lists');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE product_cart (product_id INT NOT NULL, cart_id INT NOT NULL, INDEX IDX_864BAA164584665A (product_id), INDEX IDX_864BAA161AD5CDBF (cart_id), PRIMARY KEY(product_id, cart_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE product_whish_lists (product_id INT NOT NULL, whish_lists_id INT NOT NULL, INDEX IDX_8B1B5D934584665A (product_id), INDEX IDX_8B1B5D934F0D57CB (whish_lists_id), PRIMARY KEY(product_id, whish_lists_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE product_cart ADD CONSTRAINT FK_864BAA161AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_cart ADD CONSTRAINT FK_864BAA164584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_whish_lists ADD CONSTRAINT FK_8B1B5D934584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_whish_lists ADD CONSTRAINT FK_8B1B5D934F0D57CB FOREIGN KEY (whish_lists_id) REFERENCES whish_lists (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE cart_product');
        $this->addSql('DROP TABLE whish_lists_product');
    }
}
