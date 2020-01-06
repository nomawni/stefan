<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191214122114 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE comments_reply_rating (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, comments_reply_id INT NOT NULL, action VARCHAR(7) NOT NULL, created_at DATETIME NOT NULL, edited_at DATETIME DEFAULT NULL, INDEX IDX_4216EF2319EB6921 (client_id), INDEX IDX_4216EF2318D10917 (comments_reply_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comments_reply_rating ADD CONSTRAINT FK_4216EF2319EB6921 FOREIGN KEY (client_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comments_reply_rating ADD CONSTRAINT FK_4216EF2318D10917 FOREIGN KEY (comments_reply_id) REFERENCES comments_reply (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE comments_reply_rating');
    }
}
