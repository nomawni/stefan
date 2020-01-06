<?php
namespace App\EventListener;
use App\Entity\Transactions;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
//use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class TransactionsListener {

    private $mailer;
    private $adminMail;

    public function __construct(MailerInterface $mailer, $adminMail)
    {
      $this->mailer = $mailer;   
      $this->adminMail = $adminMail;
    }

    public function postPersist(LifecycleEventArgs $events) {

        $entity = $events->getObject();
       if($entity instanceof Transactions ) {
          $products = $entity->getProducts();
          $customerAddress = $entity->getCustomer()->getAddress();
          $amount = $entity->getAmount();
          $username = $entity->getCustomer()->getUser()->getUsername();
          $userEmail = $entity->getCustomer()->getUser()->getEmail();

          $emailToSend = $this->sendEmail($userEmail, $products, $customerAddress, $amount, $username);
          $sentEmail =$this->mailer->send($emailToSend);

       }

    }

    private function sendEmail($toEmail, $products, $customerAddress, $amount, $username): TemplatedEmail {

        $email = (new TemplatedEmail())
                 ->from(new Address($this->adminMail, "Kolon"))
                 ->to(new Address($toEmail))
                 ->subject("Thanks for buying !")
                 ->htmlTemplate("emails/transactions.html.twig")

                 ->context([
                     'expiration_date' => new \DateTime('+7 days'),
                     'username' => $username,
                     "products" => $products,
                     "amount" => $amount,
                     "customerAddress" => $customerAddress
                 ]);

                 return $email;

    }

}