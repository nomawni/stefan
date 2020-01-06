import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';
import StripeHandler from '../orders/stripe_handler.js';

class Checkout {

    constructor(modal) {
      Routing.setRoutingData(Routes);
      console.log(modal);
      this.modal = modal;
      this.checkoutBtn = modal.querySelector(".checkout");
      this.tableElem = modal.querySelector(".item-to-buy");
      //this.paymentForm = modal.querySelector("#payment-form");
      this.paymentForm = modal.querySelector(".payment-form");
      this.checkoutBtn.addEventListener("click", this.handleCheckout.bind(this));

      this.stripeHandler = new StripeHandler();
    }


    handleCheckout() {
       
        console.log(this.tableElem);
        console.log(this.paymentForm);

        if(this.paymentForm.querySelector("input[name='stripeToken']")) {
          this.paymentForm.querySelector("input[name='stripeToken']").remove();
        }

        this.tableElem.style.display = "none";
        this.paymentForm.style.display = "block";

        // this function handles the onclick event on the next button in payment-form
        this.handleAddressButton();        

        // We display the list of the client addresses if he has any
        this.listUserAddresses();
        //var currentTab = 0;
         currentTab = 0; // Current tab is set to be the first tab (0)
       // showTab(currentTab, this.paymentForm);
        // When we click on the button we make it disapear
        console.log(this);
        this.checkoutBtn.style.display = "none";
       
    }

    handleAddressButton(){
       let self = this;
       let nextBtn = this.paymentForm.querySelector(".address-next");
       let checkoutErrors = this.paymentForm.querySelector(".checkout-errors");

       nextBtn.addEventListener('click', function(e) {
         e.preventDefault();
         checkoutErrors.innerHTML = "";
        
         let listAddressesHolder = self.paymentForm.querySelector(".list-client-addresses");
         let isAddressChecked = listAddressesHolder.querySelector("input[type='radio']:checked");

         if(isAddressChecked) {
           // If the user's address is valid we proceed to his credit card validation
           // We set the next button to hidden and hide the list of addresses
           nextBtn.style.display = "none";
           listAddressesHolder.style.display = "none";
           let creditCardConfirm = self.paymentForm.querySelector(".credit-card-confirm");
           creditCardConfirm.style.display = "inline";

           // We show the payment-form section 
           let paymentSection  = self.paymentForm.querySelector(".payment-section");
           paymentSection.style.display = "block";
           // We insert the strip form
           let addressId = parseInt(isAddressChecked.value);
           self.stripeHandler.serializeStripeForm(self.modal);
           // We add anevent handle to treat the stripe form
           creditCardConfirm.addEventListener("click", function(e) { self.handleCreditCard(e, addressId) });
         }else {
           let errorMessage = `<div class="alert alert-danger" role="alert">
                                The address can not be null . You have select and existing one or create a new one
                               </div>`;
              checkoutErrors.insertAdjacentHTML("afterbegin", errorMessage);
         }

       });
    }
    handleCreditCard(e, addressId) {
      e.preventDefault();
      //let stripeHandler = new StripeHandler();
      let paymentState = this.stripeHandler.submitPaymentFormHandler(this.paymentForm, addressId);
      
    }

    listUserAddresses() {
      let listAddressesUrl = Routing.generate("list_addresses");
      let response = axios.get(listAddressesUrl)
                     .then(response => {
                          console.log(response);
                          let data = response.data;
                          console.log(data);
                          // We serialize the list of the client addresses if he has any
                          this.serializeListAddresses(data);
                     })
                     .catch(error => {
                         console.error(error);
                     })
    }

    serializeListAddresses(addresses) {
      let self = this;
      let listClientAddresses = this.paymentForm.querySelector(".list-client-addresses");
      addresses.forEach(function(address, index) {
          let addressWrapper = document.createElement("div");
          addressWrapper.classList.add("address-wrapper");
          let id = address.id;
          addressWrapper.id = id;
         // addressWrapper.addEventListener("click", function(e) { self.showAddress(address.id)});
          
          let inputId = address.city + id;
          let addressContent = ` <div class="form-check">
                         <input class="form-check-input" type="radio" id="${inputId}" name="deliveryAddress" value="${address.id}" />
                         <label class="form-check-label" for="${inputId}">
                         <h4> ${address.fullName} </h4>
                         <p> ${address.street}  </p>
                         <p> ${address.city} , ${address.postalCode}  ${address.country} </p>
                         </label>
                         </div>
                       `;

          addressWrapper.insertAdjacentHTML('beforeend', addressContent);

          let actionsOnAddress = document.createElement("div");
          addressWrapper.appendChild(actionsOnAddress);

          let deleteAddressBtn = document.createElement('button');
          deleteAddressBtn.insertAdjacentHTML('afterbegin', `<i class="fas fa-trash"></i>`);
          deleteAddressBtn.addEventListener("click", function(e) { self.deleteAddress(id, addressWrapper)} );
          actionsOnAddress.appendChild(deleteAddressBtn);

          let editeAddressBtn = document.createElement("button");
          editeAddressBtn.insertAdjacentHTML('afterbegin', `<i class="fas fa-edit"></i>`);
          editeAddressBtn.onclick = function(e) { self.editeAddress(id, addressWrapper)}
          actionsOnAddress.appendChild(editeAddressBtn);

          listClientAddresses.appendChild(addressWrapper);
      });

      // We add a button for the user to add a new Address
      let addAdderess = document.createElement("button");
      addAdderess.classList.add("btn", "btn-primary", 'add-new-address', "space-maker");
      addAdderess.innerHTML = "Add new Address";

      addAdderess.addEventListener("click", function(e){ self.newAddress(e.currentTarget, listClientAddresses)} );
      listClientAddresses.appendChild(addAdderess);

    }

    newAddress(addBtn, listAddresses) {
        
        addBtn.style.display= "none";
        addBtn.classList.add("disabled-element");
        let self = this;
        let createEditAddressTemplate = document.getElementById("createEditAddressTemplate");
        let clonedTemplate = document.importNode(createEditAddressTemplate.content, true);
        let cancelBtn = clonedTemplate.querySelector("button.cancel-address");
        let newAddressForm = clonedTemplate.querySelector("form");
        cancelBtn.addEventListener("click", function(e){self.cancelAddress(newAddressForm, addBtn)});
        newAddressForm.onsubmit = function(e) { self.createAddress(e, listAddresses, addBtn) }

        // We remove any existing form is already in the 
        let paymentForm = listAddresses.closest("#payment-form");
        if(paymentForm.querySelector("#newAddressForm")) {
          paymentForm.querySelector("#newAddressForm").remove();
        }
        listAddresses.parentNode.insertBefore(clonedTemplate, listAddresses.nextElementSibling);//  appendChild(clonedTemplate);
        
    }

    createAddress(elem, listAddresses, addAddressBtn) {

     elem.preventDefault();
     let newAddressForm = elem.currentTarget;
     if(!newAddressForm instanceof HTMLFormElement) {
       return false;
     }

     let isAddressFormValid = this.valideNewAddress(newAddressForm);
     if(!isAddressFormValid) {
       return;
     }

     let newAddressUrl = Routing.generate("address_new");
     let content = JSON.stringify(isAddressFormValid);

     let response = axios.post(newAddressUrl, content)
                    .then(response => {
                      
                      if(response.status === 200) {
                        let newAddress = response.data;
                        this.serializeNewAddress(newAddressForm, newAddress, listAddresses, addAddressBtn);
                      }
                    })
                    .catch(error => {
                       console.error(error);
                    });

    }

    valideNewAddress(newAddressForm) {

        let formElementsLength = newAddressForm.elements.length;
        let content = new Object();
        for(let i =0; i < formElementsLength; i++) {
          let element = newAddressForm.elements[i];
              console.log(element.name);
           if(element.value === '' && element.hasAttribute("required")) {
             let addressError = `<div class="alert alert-danger" role="alert">
                                   This field is required !
                                 </div>`;
                    alert("Inside the element !");
                    console.log(addressError);
                    element.insertAdjacentHTML('afterend', addressError);
                                 return false;
           }
           content[element.name] = element.value;
        }
        return content;
    }

    serializeNewAddress(form, address, listAddresses, addAddressBtn, isEdit =false, editedAddress=null) {
        let self = this;
        let addressWrapper = document.createElement("div");
          addressWrapper.classList.add("address-wrapper");
          let id = address.id;
          addressWrapper.id = id;
         // addressWrapper.addEventListener("click", function(e) { self.showAddress(address.id)});
          let inputId = address.city + id;
          let addressContent = ` <div class="form-check">
                         <input class="form-check-input" type="radio" id="${inputId}" name="deliveryAddress" value="${address.id}" />
                         <label class="form-check-label" for="${inputId}">
                         <h4> ${address.fullName} </h4>
                         <p> ${address.street}  </p>
                         <p> ${address.city} , ${address.postalCode}  ${address.country} </p>
                         </label>
                         </div>
                       `;

          addressWrapper.insertAdjacentHTML('beforeend', addressContent);

          let actionsOnAddress = document.createElement("div");
          addressWrapper.appendChild(actionsOnAddress);

          let deleteAddressBtn = document.createElement('button');
          deleteAddressBtn.insertAdjacentHTML('afterbegin', `<i class="fas fa-trash"></i>`);
          deleteAddressBtn.addEventListener("click", function(e) { self.deleteAddress(id, addressWrapper)} );
          actionsOnAddress.appendChild(deleteAddressBtn);

          let editeAddressBtn = document.createElement("button");
          editeAddressBtn.insertAdjacentHTML('afterbegin', `<i class="fas fa-edit"></i>`);
          editeAddressBtn.onclick = function(e) { self.editeAddress(id, addressWrapper)}
          actionsOnAddress.appendChild(editeAddressBtn);
          
          if(isEdit) {
            listAddresses.insertBefore(addressWrapper, editedAddress);
          }else {
          listAddresses.appendChild(addressWrapper);
          }
          form.remove();
          addAddressBtn.style.display = "block";

    }

   async showAddress(id) {
          console.log("Before show");
          if(!id) {
            return;
          }
          console.log("After shwo");
          let addressUrl = Routing.generate("address_show", {id: id});

          let response = await axios.get(addressUrl)
                         .then(response => {
                           if(response.status === 200) {
                             console.log(response.data);
                             return response.data;
                           }
                         })
                         .catch(error => {
                           console.error(error);
                         });

            return response;
    }

    deleteAddress(id, addressWrapper) {
       if(!id || id === null ) {
         return;
       }
       let deleteAddressUrl = Routing.generate("address_delete", {id: id});
       let response = axios.get(deleteAddressUrl)
                     .then(response => {
                          
                         if(response.status === 200) {
                          // alert(response.data.message);
                          addressWrapper.remove();
                         }
                     })
                     .catch(error => {
                        console.error(error);
                     })
    }

    editeAddress(id, addressWrapper) {
       let self = this;
       let content = this.showAddress(id);
       console.log("Before");
       if(!content) {
         return;
       }
       console.log("After");
      let serializedForm = this.serializeEditAddress(content, addressWrapper);
      console.log(serializedForm);

      // We remove any form that exist before inserting new one 
      let paymentForm = addressWrapper.closest("#payment-form");
      if(paymentForm.querySelector("#newAddressForm")) {
        paymentForm.querySelector("#newAddressForm").remove();
      }

      addressWrapper.parentNode.insertBefore(serializedForm, addressWrapper);
      addressWrapper.classList.add("disabled-element");
      addressWrapper.style.display = "none";

      serializedForm.onsubmit = function(e) { self.handleSubmitEdit(e,id, serializedForm, addressWrapper)};

      /* let editeUrl = Routing.generate("address_edit", {id: id});
       let response = axios({
         method: "post",
         url: editeUrl,
         data: content
       })
       .then(response => {

       })
       .catch(error => {

       }); */
    }

    serializeEditAddress(content, addressWrapper) {
        let self = this;
        console.log(content);
        let createEditAddressTemplate = document.getElementById("createEditAddressTemplate");
        let clonedTemplate = document.importNode(createEditAddressTemplate.content, true);
        let listInputs = clonedTemplate.querySelectorAll("[name]");
        console.log(content);
        content.then(data => {
          console.log(data);
        });
        content.then(data => {
          console.log(data);
        listInputs.forEach(function(input, index) {
          console.log(input);
        //for(const key of Object.keys(data)) {
          for(const [key, value] of Object.entries(data)) {
         // for(var key in data){
          //console.log(value);
          if(key === input.name && key !== null) {
            console.log("inside the input test ***");
            //console.log(value);
            console.log(data[key]);
            input.value = value; //data[key];
          }
        }
      });
    });
      
      let submitBtn = clonedTemplate.querySelector("button[type='submit']");
      submitBtn.innerHTML = "Edit Address";

      let cancelBtn = clonedTemplate.querySelector("button.cancel-address");
      let clonedForm = clonedTemplate.querySelector("form");
      cancelBtn.addEventListener("click", function(e) {self.cancelAddress(clonedForm, addressWrapper, true)});
      
      return clonedForm; //clonedTemplate.querySelector("form");

    }

    handleSubmitEdit(form,id, serializedForm, addressWrapper) {

      form.preventDefault();
      let isAddressFormValid = this.valideNewAddress(serializedForm);
      if(!isAddressFormValid) {
        return;
      }

      let content = JSON.stringify(isAddressFormValid);
      let listAddresses = serializedForm.closest(".list-client-addresses");

      let editeUrl = Routing.generate("address_edit", {id: id});
       let response = axios({
         method: "post",
         url: editeUrl,
         data: content
       })
       .then(response => {
         if(response.status === 200) {
           let address = response.data;
            this.serializeNewAddress(serializedForm, address, listAddresses, true, addressWrapper);
            addressWrapper.remove();
         }
       })
       .catch(error => {
           console.error(error);
       });
    }

    cancelAddress(form, addAddressBtn, isEdit = false) {
      form.remove();

     // if(!addAddressBtn) {
       if(isEdit) {
        let listAddresses = addAddressBtn.closest(".list-client-addresses");
        let disabledBtn = listAddresses.querySelector("button.disabled-element");
        disabledBtn.style.display = "block";
         addAddressBtn.style.display = "grid";
       }else {
        let listAddresses = addAddressBtn.closest(".list-client-addresses");
        let listDisabled = listAddresses.querySelectorAll(".disabled-element");  //(".address-wrapper");
        console.log(listDisabled);
        listDisabled.forEach(function(addressWrapper) {
          addressWrapper.style.display = "grid";
        });
        addAddressBtn.style.display = "block";
       }
    //  }
    }

}

export default Checkout;