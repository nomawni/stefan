<?php
namespace App\EventListener;

use App\Entity\PasswordReset;
use DateTime;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class ResetPasswordListener {

    private $mailer;
    private $adminMail;

    public function __construct(MailerInterface $mailer, $adminMail) {
        $this->mailer = $mailer;
        $this->adminMail = $adminMail;
    }

    public function postPersist(LifecycleEventArgs $args) {
        $entity = $args->getObject();

        if(!$entity instanceof PasswordReset) {
            return;
        }

        $token = $entity->getToken();
        $userEmail = $entity->getUser()->getEmail();
        $username = $entity->getUser()->getUsername();

        $emailToSend = $this->sendEmail($userEmail, $username, $token);
        $sentEmail = $this->mailer->send($emailToSend);
    }

    private function sendEmail($userEmail, $username, $token) {

        $email = (new TemplatedEmail())
                 ->from(new Address($this->adminMail, "Kolon"))
                 ->to(new Address($userEmail))
                 ->subject("Reset your password")
                 ->htmlTemplate("emails/resetPassword.html.twig")

                 ->context([
                     "expiration_date" => new DateTime("+7 days"),
                     "username" => $username,
                     "token" => $token
                 ]);
                
            return $email;
    }
}