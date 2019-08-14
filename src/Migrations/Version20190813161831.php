<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190813161831 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE address ADD shipment_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F817BE036FC FOREIGN KEY (shipment_id) REFERENCES shipment (id)');
        $this->addSql('CREATE INDEX IDX_D4E6F817BE036FC ON address (shipment_id)');
        $this->addSql('ALTER TABLE cart ADD shipment_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE cart ADD CONSTRAINT FK_BA388B77BE036FC FOREIGN KEY (shipment_id) REFERENCES shipment (id)');
        $this->addSql('CREATE INDEX IDX_BA388B77BE036FC ON cart (shipment_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F817BE036FC');
        $this->addSql('DROP INDEX IDX_D4E6F817BE036FC ON address');
        $this->addSql('ALTER TABLE address DROP shipment_id');
        $this->addSql('ALTER TABLE cart DROP FOREIGN KEY FK_BA388B77BE036FC');
        $this->addSql('DROP INDEX IDX_BA388B77BE036FC ON cart');
        $this->addSql('ALTER TABLE cart DROP shipment_id');
    }
}
