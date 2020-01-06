
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';

export default class AccountValidation {

    constructor() {
        Routing.setRoutingData(Routes);
    }

     requestAccountValidation(e) {
        let elem = e.currentTarget;
        
        console.log(elem.parentNode);
        let statusMessages = elem.parentNode.querySelector(".status-messages");
        statusMessages.innerHTML = "";
        console.log(elem);
        let url = Routing.generate("new_email_confirmaiton");
        let response = axios.get(url)
                       .then(response => {

                            if(response.status === 200) {
                              //elem.parentNode.appendChild(this.serializeValidateForm());
                              elem.parentNode.insertBefore(this.serializeValidateForm(), elem);

                              var responseMessage = `<div class="alert alert-success" role="alert">
                                        ${response.data.message}
                                       </div>`;
                                statusMessages.insertAdjacentHTML("afterbegin", responseMessage);
                                elem.style.display = "none";

                            }else if(response.status === 403) {
                               let errorDiv = `<div class="alert alert-danger" role="alert">
                                        ${response.data.message}
                                       </div>`;
                                statusMessages.insertAdjacentHTML("afterbegin", errorDiv);
                            }else {
                                alert("Inside the else ...");
                                let responseMessage = `<div class="alert alert-danger" role="alert">
                                        An unknown error occured on the server side. Please try again !
                                       </div>`;
                                statusMessages.insertAdjacentHTML("afterbegin", responseMessage);
                            }
                       })
                       .catch(error => {
                           console.log(error);
                           
                       });
    }

    serializeValidateForm() {

        let self = this;
        
        let accountValidationForm = document.createElement("form");
           accountValidationForm.id = "accountValidationForm";
           accountValidationForm.classList.add("account-validation-form", "form");

       /* let statusMessage = document.createElement('div');
        statusMessage.classList.add('status', 'status-messages');
        accountValidationForm.appendChild(statusMessage); */
        
        let formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        accountValidationForm.appendChild(formGroup);

        let formInput = document.createElement("input");
        formInput.classList.add("form-control");
        formInput.setAttribute("type", "text");
        formInput.setAttribute("name", "token");
        formInput.setAttribute("placeholder", "enter the validation token");
        formGroup.appendChild(formInput);
        //accountValidationForm.appendChild(formInput);

        let submitFormBtn = document.createElement("button");
        submitFormBtn.classList.add("submit-account-validation-form", "btn", "btn-primary");
        submitFormBtn.innerHTML = "Validate";
        accountValidationForm.appendChild(submitFormBtn);

        accountValidationForm.onsubmit = function(e) {self.handleAccountValidationForm(e)}

        return accountValidationForm;
                                     
    
    }

    validateForm() {

    }

   async handleAccountValidationForm(e) {
        e.preventDefault();
        let form = e.currentTarget;

        let statusMessages = form.parentNode.querySelector(".status-messages");
        statusMessages.innerHTML = "";

        let tokenInput = form.querySelector("input");
        let tokenValue = tokenInput.value;

        console.log(tokenInput);
        console.log(tokenValue);

        if(!tokenValue || tokenValue.length < 6) {

        }

        let url = Routing.generate("validate_email_confirmation");

        let data = {
            token: tokenValue
        };

        data = JSON.stringify(data);

        let response = await axios.post(url,data)
                       .then(response => {
                          if(response.status === 200) {
                              console.log(response.data);
                              var responseMessage = `<div class="alert alert-success" role="alert">
                                        ${response.data.message}
                                       </div>`;
                                form.remove();
                              
                                statusMessages.insertAdjacentHTML("afterbegin", responseMessage);
                                
                          }else if(response.status === 403) {
                            var errorDiv = `<div class="alert alert-danger" role="alert">
                                     ${response.data.message}
                                </div>`;
                                statusMessages.insertAdjacentHTML("afterbegin", errorDiv);
                          }else {
                            var errorDiv = `<div class="alert alert-danger" role="alert">
                                           An unknown error occured on the server. Please try again later !
                                        </div>`;
                                statusMessages.insertAdjacentHTML("afterbegin", errorDiv);
                          }
                       })
                       .catch(error => {
                           console.error(error);
                           
                       });

    }
}