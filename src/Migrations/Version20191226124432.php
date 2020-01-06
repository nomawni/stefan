<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191226124432 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE address_user (address_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_F0DF06A2F5B7AF75 (address_id), INDEX IDX_F0DF06A2A76ED395 (user_id), PRIMARY KEY(address_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE address_user ADD CONSTRAINT FK_F0DF06A2F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE address_user ADD CONSTRAINT FK_F0DF06A2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE user_address');
        $this->addSql('ALTER TABLE orders DROP FOREIGN KEY FK_E52FFDEE7BE036FC');
        $this->addSql('DROP INDEX IDX_E52FFDEE7BE036FC ON orders');
        $this->addSql('ALTER TABLE orders DROP shipment_id');
        $this->addSql('ALTER TABLE shipment DROP FOREIGN KEY FK_2CB20DC62F0670F');
        $this->addSql('DROP INDEX UNIQ_2CB20DC62F0670F ON shipment');
        $this->addSql('ALTER TABLE shipment DROP single_order_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_address (user_id INT NOT NULL, address_id INT NOT NULL, INDEX IDX_5543718BA76ED395 (user_id), INDEX IDX_5543718BF5B7AF75 (address_id), PRIMARY KEY(user_id, address_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_address ADD CONSTRAINT FK_5543718BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_address ADD CONSTRAINT FK_5543718BF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE address_user');
        $this->addSql('ALTER TABLE orders ADD shipment_id INT NOT NULL');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT FK_E52FFDEE7BE036FC FOREIGN KEY (shipment_id) REFERENCES shipment (id)');
        $this->addSql('CREATE INDEX IDX_E52FFDEE7BE036FC ON orders (shipment_id)');
        $this->addSql('ALTER TABLE shipment ADD single_order_id INT NOT NULL');
        $this->addSql('ALTER TABLE shipment ADD CONSTRAINT FK_2CB20DC62F0670F FOREIGN KEY (single_order_id) REFERENCES orders (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2CB20DC62F0670F ON shipment (single_order_id)');
    }
}
