import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';
export default class StripeHandler {

    constructor() {
        // Create a Stripe client
         this.stripe = Stripe('pk_test_AWqhFRx5lEWGMTLVffG7Hr960006ZvOxQB');
        // Create an instance of Elements.
         this.elements = this.stripe.elements();
       // Custom styling can be passed to options when creating an Element.
       // (Note that this demo uses a wider set of styles than the guide below.)
       var style = {
           base: {
               color: '#32325d',
               fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
               fontSmoothing: 'antialiased',
               fontSize: '16px',
               '::placeholder': {
               color: '#aab7c4'
                 }
        },
          invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
         }
};

     this.currentCard = '#card-element1';
     this.card = this.elements.create('card', {style: style});
     this.card.mount('.card-element');
     // We prevent all payment-forms from submitting
     this.resetSubmitPayment();
    // this.submitPaymentFormHandler();
    }

    serializeStripeForm(modalElement) {
        //var listCheckouts = document.querySelectorAll(".checkout");
       // listCheckouts.forEach(function(elem) {
           // elem.addEventListener("click", function(e) {
                //++pos;
               // let modalElement = elem.closest(".modal");
                let cardElement = modalElement.querySelector(".card-element");
                let cardId = cardElement.id;
                var unmountedCard = this.elements.getElement('card');
                this.card.unmount(this.currentCard);
                this.currentCard = `#${cardId}`;
                this.card.mount(this.currentCard);
                // Handle real-time validation errors from the card Element.
                this.card.addEventListener('change', function(event) {
                    var displayError = cardElement.nextElementSibling; //querySelector('.card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
           // });
       // });
    }

    resetSubmitPayment() {

        var forms = document.querySelectorAll(".payment-form");

        forms.forEach(function(form) {
            form.addEventListener('submit', function(event) {
                 event.preventDefault();
            });
        });
    }

    submitPaymentFormHandler(form, addressId) {

        if(!addressId) return false;
        
        let self = this

                 self.stripe.createToken(this.card).then(function(result) {
                     if (result.error) {
                     // Inform the user if there was an error.
                     var errorElement = form.querySelector(".card-errors"); //document.getElementById('card-errors');
                     errorElement.textContent = result.error.message;
                     } else {
                     // Send the token to your server.
                     let paymentState = self.stripeTokenHandler(result.token, form, addressId);
                     return paymentState;

                     }
                 });
    }

   async stripeTokenHandler(token, form, addressId) {
        Routing.setRoutingData(Routes);
        // Insert the token ID into the form so it gets submitted to the server
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);
    
        let url = Routing.generate("transactions_new");
        let transactionSucceeded = form.nextElementSibling;
    
      let response = await this.paymentHandler(url, form, addressId);  //this.ajax(url, form);
      
        return response;
    
    }

   async paymentHandler(url, form, addressId) {
        
        if(!addressId) return false;
        let token = form.querySelector("input[name='stripeToken']");

        let isPaymentSucceeded = false;
        let tokenValue = token.value;
        let orderType = form.querySelector("input[name='orderType']");
        let orderTypeVal = orderType.dataset.orderType;
        let orderTypeId = orderType.dataset.orderId;
        let itemInfos = this.getListItems(form, orderType);

        let content = {
            token: tokenValue,
            orderType: orderTypeVal,
            orderTypeId: orderTypeId,
            productInfo: itemInfos,
            addressId: addressId
        }
        let data = JSON.stringify(content);
        let transactionSucceeded = form.nextElementSibling;
        transactionSucceeded.innerHTML = "";

        let response = await axios.post(url, data)
                       .then(response => {
                         if(response.status === 200) {
                            isPaymentSucceeded = true;
                          let statusMessage = `<div class="alert alert-success" role="alert">
                                                Your payment has succeeded 
                                                </div>`;
                            transactionSucceeded.insertAdjacentHTML("afterbegin", statusMessage);
                            // if the transaction has succeeded we hide the form and display a beautifull message
                            form.style.display = "none";
                            transactionSucceeded.style.display = "block";

                         }else if(response.status === 403) {
                            isPaymentSucceeded = false;
                            let statusMessage = `<div class="alert alert-danger" role="alert">
                                                ${response.data.message}
                                               </div>`;
                            transactionSucceeded.insertAdjacentHTML("afterbegin", statusMessage);
                         }else {
                            isPaymentSucceeded = false;
                            let statusMessage = `<div class="alert alert-danger" role="alert">
                                            An unknown error occured on the server. Please try again later
                                                </div>`;
                            transactionSucceeded.insertAdjacentHTML("afterbegin", statusMessage);
                         }
                       })
                       .catch(error => {
                           console.log(error);
                       });

                    return isPaymentSucceeded;
    }

    onpaymentSucceded(){
       
    }

    getListItems (form, orderType) {

        let modalBody = form.closest(".modal-body");
        let listItemsHolder = new Object();
        let orderTypeVal = orderType.dataset.orderType;
      
        listItemsHolder.orderType = orderTypeVal;
        // If the modal body has a table we 
        if(modalBody.querySelector("table")) {
      
          let listItemsContainer = [];
      
          let modalBodyTable = modalBody.querySelector("table");
          let tableBody = modalBodyTable.querySelector("tbody");
          let modalBodyTableRows = tableBody.querySelectorAll("tr");
          let orderTypeId = modalBodyTable.dataset.cartId || modalBodyTable.dataset.whishListId;
          listItemsHolder.orderTypeId = orderTypeId;
      
          modalBodyTableRows.forEach(function(row, index) {
          
          let productId = row.dataset.productId;
          console.log(row);
          let quantity = row.querySelector("input[class='quantity']").value;
      
          let itemInfo = {
            productId: productId,
            quantity: quantity
          };
      
          listItemsContainer.push(itemInfo); // itemInfo;
      
        });
      
        listItemsHolder.itemInfo = listItemsContainer;
        return listItemsHolder;
      
        }
      
        let selectQt = modalBody.querySelector("input[name='selectQt']").value;
        let modalWrapper = modalBody.closest(".product-item");
        let productId = modalWrapper.dataset.productId;
      
        let itemInfo = {
          quantity: selectQt,
          productId: productId,
        };
      
        listItemsHolder.itemInfo = itemInfo;
        return listItemsHolder;
          
      }
}