<?php
namespace App\EventSubscriber;

use App\Entity\EmailConfirmation;
use App\Entity\User;
use DateTime;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class ValidateAccountSubscriber implements EventSubscriber{
    private  $mailer;
    private $adminMail;

    public function __construct(MailerInterface $mailer, $adminMail)
    {
        $this->mailer = $mailer;
        $this->adminMail = $adminMail;
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postUpdate,
        ];
    }

    public function postPersist(LifecycleEventArgs $args) {

        $this->valideAccount("postPersist", $args);
    }

    public function postUpdate(LifecycleEventArgs $args) {
        $this->valideAccount("postUpdate", $args);
    }

    public function valideAccount(string $action, LifecycleEventArgs $args) {

        $entity = $args->getObject();

        if(!$entity instanceof EmailConfirmation) {
           return;
        }

        $userEmail = $entity->getUser()->getEmail();
        $token = $entity->getToken();
        $username = $entity->getUser()->getUsername();

       $emailToSend = $this->sendConfirmationEmail($userEmail, $token, $username);
       $sentEmail = $this->mailer->send($emailToSend);

    }

    private function sendConfirmationEmail($toEmail, $token, $username) {
       
        $email = (new TemplatedEmail())
                 ->from(new Address($this->adminMail, "Kolon"))
                 ->to(new Address($toEmail))
                 ->subject("Email confirmation !")

                 ->htmlTemplate("emails/validate_account.html.twig")

                 ->context([
                     "expiration_date" => new DateTime("+7 days"),
                     "token" => $token,
                     "username" => $username
                 ]);

                 return $email;

    }

}