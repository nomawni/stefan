
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';
class ChangePassword {

    constructor() {
          Routing.setRoutingData(Routes);
    }

    requestNewPassword(e) {
         
         let self = this;
         e.preventDefault();
         let changePasswordBtn = e.currentTarget;
         changePasswordBtn.insertAdjacentHTML("beforebegin", this.serializeRequestForm());
         // We add the event listener when the user submit the form
         let changePasswordForm = changePasswordBtn.parentNode.querySelector("#changePasswordForm");
         let nextBtn = changePasswordForm.querySelector(".next");
         //changePasswordForm.addEventListener("submit", function(e) {self.handleChangePasswordForm(e)});
        // nextBtn.addEventListener("click", function(e){ self.handleChangePasswordForm(e)});
        nextBtn.addEventListener("click", function(e) {
            e.preventDefault();
            self.stepsHandler(changePasswordForm)}
            );

         changePasswordBtn.style.display = "none";
    }

    serializeRequestForm() {

        let self = this;
        let changePasswordForm =  `
                                <div class="status">
                               </div>
                                <form id="changePasswordForm">
        
                               <div class="Validate-old-password-step">
                                   <div class="form-group">
                                       <input type="password" name="oldPassword" class="form-control" placeholder="enter your password" />
                                   </div>
                               </div> 

                               <div class="change-password-step" style="display:none;">
                                   <div class="form-group">
                                       <input type="password" name="newPassword" class="form-control" placeholder="enter your new password" />
                                    </div>
                                    <div class="form-group">
                                       <input type="password" name="repeatNewPassword" class="form-control" placeholder="repeat your new password" />
                                    </div>
                               </div>

                               <div style="overflow:auto;"> 
                                       <button class="btn btn-primary next"> Next </button>
                                       <button style="display:none;" class="btn btn-primary change-your-password"> Change your password </button>
                               </div>
                               
                                </form>
                               `;
                //changePasswordForm.insertAdjacentHTML("afterbegin", chanPasswordForm);
               // changePasswordForm.onsubmit = function(e) {self.handleChangePasswordForm(e)};

                return changePasswordForm;
    }
    
    //TODO Delete this function , it is not supposed to do anything
    handleChangePasswordForm(e) {
        e.preventDefault();
        
        //let changePasswordForm = e.currentTarget;
        let nextBtn = e.currentTarget;
        let changePasswordForm = nextBtn.closest("form");

        this.formSteps(changePasswordForm);

      /*  let currentStep = 0;


        let oldPasswordInput = changePasswordForm.querySelector('input[name="oldPassword"]');

        let oldPasswordValue = oldPasswordInput.value;

        let isOldPasswordValid = this.verifyOldPassword(oldPasswordValue, changePasswordForm);

        if(!isOldPasswordValid) {
           
            return;
        }
        // We only change the user password if he entered his right password to prove that he's the owner of the account
        if(isOldPasswordValid) {
         
        this.resetPassword(this.serializeChangePassword(changePasswordForm), changePasswordForm);
        } */
    }

    serializeChangePassword(form) {
       

        let isFormValide = this.validatePasswords(form);

        if(!isFormValide) {
            return;
        }

        let newPassword = form.querySelector("input[name='newPassword']").value;
        let repeatNewPassword = form.querySelector("input[name='repeatNewPassword']").value;

        console.log(newPassword);
        console.log(repeatNewPassword);

        let content = {
            newPassword: newPassword,
            repeatNewPassword: repeatNewPassword
        }

        return content;
    }

   async verifyOldPassword(oldPasswordValue, form) {

        let status = form.parentNode.querySelector(".status");
        status.innerHTML = "";
        // State indicate if the was validated in server or not 
        var state = false;

        if(!oldPasswordValue) {
            let responseMessage = `<div class="alert alert-danger" role="alert">
                         Please enter a valide password
                  </div>`;
            status.insertAdjacentHTML('afterbegin', responseMessage);
            return;
        }
        
        let data = {
            oldPassword: oldPasswordValue
        }

        let content = JSON.stringify(data);
        let url = Routing.generate("validate_password");
        let response = await axios.post(url, content)
                       .then(response => {
                           
                           if(response.status === 200) {
                             let responseMessage = `<div class="alert alert-success" role="alert">
                                               ${response.data.message}
                                                </div>`;
                            status.insertAdjacentHTML("afterbegin", responseMessage);
                            // we return true to indicate that the user has entered the right password
                            state = true;
                           }else if(response.status === 403) {
                              console.log(response.data);
                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                                  ${response.data.message}
                                                 </div>`;
                             status.insertAdjacentHTML('afterbegin', responseMessage);
                             // We indicate that the password entered by the user is false
                             state = false;
                           }else {
                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                                An unknown error occured on the server. Sorry 
                                               </div>`;
                            status.insertAdjacentHTML('afterbegin', responseMessage);
                            // We indicate that an error occured in the server
                           }
                           return response;
                       })
                       .catch(error => {
                        console.log(error);
                       });
                //console.log(response.json());
                //console.log(state);
                //alert(state);
                return state;
    }

    validatePasswords(form) {
        let status = form.parentNode.querySelector(".status");
        status.innerHTML = "";
        let newPassword = form.querySelector("input[name='newPassword'");
        let repeatNewPassword = form.querySelector("input[name='repeatNewPassword']");

        if(!newPassword.value) {
            let responseMessage = `<div class="alert alert-danger" role="alert">
                                  the new password can not be null
                                 </div>`;
                newPassword.insertAdjacentHTML("afterend", responseMessage);
                return false;
        }

        if(newPassword.value.length < 7) {
            let responseMessage = `<div class="alert alert-danger" role="alert">
                                   The password can not be less than 7 characters long
                                  </div>`;
                newPassword.insertAdjacentHTML("afterend", responseMessage);
                return false;
        }

        if(!repeatNewPassword.value) {
            let responseMessage = `<div class="alert alert-danger" role="alert">
                                  the repeat password can not be null
                                 </div>`;
                repeatNewPassword.insertAdjacentHTML("afterend", responseMessage);
                return false;
        }

        if(repeatNewPassword.value !== newPassword.value) {
            let responseMessage = `<div class="alert alert-danger" role="alert">
                                The two passwords do not match
                                  </div>`;
                status.insertAdjacentHTML("afterbegin", responseMessage);
                return false;
        }

        return true;

    }

    resetPassword(content, form) {
        console.log(content);
        if(!content) {
            return;
        }

        let status = form.parentNode.querySelector(".status");
        status.innerHTML = "";
        let state = false;
        // We want bring back the change password btn that we disabled 
        let changePasswordBtn = form.parentNode.querySelector(".change-password-btn");
        let url = Routing.generate("reset_password");
        let data = JSON.stringify(content);

        let response = axios.post(url, data)
                       .then(response => {
                           
                           if(response.status === 200) {
                             let statusMessage = this.responseStateHandler(200, response.data.message);
                             status.insertAdjacentHTML('afterbegin', statusMessage);
                             // if everything went ok , we remove the form and add the change password btn back
                             // After 3 seconds
                             setTimeout(function(e){
                                 form.remove();
                                 changePasswordBtn.style.display = "block";
                                 state = true;
                            }, 3000);
                           }
                           if(response.status === 403) {
                              let statusMessage = this.responseStateHandler(403, response.data.message);
                              status.insertAdjacentHTML('afterbegin', statusMessage);
                              state = false;
                           }else {
                               state = false;
                           }
                       })
                       .catch(error => {
                           console.error(error);
                          
                       });
                return state;
    }

    responseStateHandler(statusCode, content) {

        let responseMessage = null;
        if(statusCode === 200) {
             responseMessage = `<div class="alert alert-success" role="alert">
                                        ${content}
                                         </div>`;
        }else if(statusCode === 403){
            responseMessage = `<div class="alert alert-danger" role="alert">
                                      ${content}
                             </div>`;
        }else {
            responseMessage = `<div class="alert alert-danger" role="alert">
                                            An unknown error occured on the server. Sorry 
                                       </div>`;
        }
        return responseMessage;
    }

    // TODO Delete this function again , does not do anything
    formSteps(form) {
     let self = this;
     // let allFormStep = form.querySelectorAll(".step");
     // let previousBtn = form.querySelector(".previous");
      let nextBtn = form.querySelector(".next");
     // previousBtn.onclick = function(e) {}
      nextBtn.addEventListener("click", function(e) {self.stepsHandler(form)});
      //onclick = function(e) {self.stepsHandler(form)};
    }

    submitChangePassword(changePasswordForm) {

      let hasPasswordChangedSuccessfully = this.resetPassword(this.serializeChangePassword(changePasswordForm), changePasswordForm);
      
    }

   async stepsHandler(changePasswordForm) {
        
        let self = this;
        let oldPasswordInput = changePasswordForm.querySelector('input[name="oldPassword"]');
        let oldPasswordValue = oldPasswordInput.value;
        let isOldPasswordValid = await this.verifyOldPassword(oldPasswordValue, changePasswordForm);

        let ValidateOldPasswordStep = changePasswordForm.querySelector(".Validate-old-password-step");
        let changePasswordStep = changePasswordForm.querySelector(".change-password-step");
        let changeYourPasswordBtn = changePasswordForm.querySelector(".change-your-password");
        let nextBtn = changePasswordForm.querySelector(".next");

        if(!isOldPasswordValid) return;

        if(isOldPasswordValid) {
            ValidateOldPasswordStep.style.display = "none";
            nextBtn.innerHTML = "Change your password";
            // We remove the event that handles to verify the old password
            nextBtn.style.display = "none";
            changeYourPasswordBtn.style.display = "inline";
            //nextBtn.removeEventListener("click", this.stepsHandler);
            // We attach a new event that wiil change the password of the user 
            changeYourPasswordBtn.addEventListener("click", function(e) {
                e.preventDefault();
                self.submitChangePassword(changePasswordForm)}
                );
            changePasswordStep.style.display = "block";
        }else {
            alert("Invalide");
            ValidateOldPasswordStep.style.display = "block";
           // nextBtn.innerHTML = "next";
           nextBtn.style.display = "inline";
           changeYourPasswordBtn.style.display= "none";
            changePasswordStep.style.display = "none";
        }
    }
}

export default ChangePassword;