import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';
export default class ResetPassword {

    
    constructor() {
        Routing.setRoutingData(Routes);
        this._loginModalBody = null;
        this._loginForm =null;
        this._resetPasswordBtn = null;
        this._loginStatus = null;
    }

    requestResetPassword(forgetPasswordBtn) {
         let self = this;
         
         this._resetPasswordBtn = forgetPasswordBtn;
         let loginModalBody = forgetPasswordBtn.parentNode;
         this._loginModalBody = loginModalBody;

         this._loginStatus = loginModalBody.querySelector(".login-status");
         this._loginStatus.innerHTML = "";

         let loginModalForm = loginModalBody.querySelector("#loginModalForm");
         this._loginForm = loginModalForm;

         let resetPasswordFrom = this.serializeResetPassword();
         loginModalForm.style.display = "none";
         forgetPasswordBtn.style.display = "none";
         loginModalBody.insertAdjacentHTML("beforeend", resetPasswordFrom);
         let serializedForm = loginModalBody.querySelector("#resetPassword");

         this._resetPasswordWrapper = this._loginModalBody.querySelector(".reset-password-wrapper");
         // After serializing the form, we need to verify that he exist with his email
         let verifyEmail = serializedForm.querySelector(".verify-email");
         verifyEmail.addEventListener("click", function(e) {
             e.preventDefault();
             self.verifyEmail(e.currentTarget, serializedForm);
         })
    }

    serializeResetPassword() {

    let form = `<div class="reset-password-wrapper">
                    <div class="response-status"> </div>
                     <form id="resetPassword">
                        <div class="confirm-email">
                            <div class="form-group">
                                <input type="email" name="confirmEmail" placeholder="enter your email" class="form-control" />
                            </div>
                        </div>
                        <div class="validate-token" style="display:none;">
                            <div class="form-group">
                                <input type="text" name="confirmToken" class="form-control" placeholder="please enter the token we sent you" />
                            </div>
                        </div>
                        <div class="reset-password-step" style="display:none;">
                            <div class="form-group">
                             <input type="password" name="newPassword" class="form-control" placeholder="enter your new password" />
                            </div>

                            <div class="form-group">
                             <input type="password" name="repeatNewPassword" class="form-control" placeholder="repeat your new password" />
                            </div>
                        </div>

                        <div style="overflow:auto;"> 
                            <button class="btn btn-primary verify-email"> Verify Email </button>
                            <button style="display:none;" class="btn btn-primary validate-token-btn"> Validate token </button>
                            <button style="display:none;" class="btn btn-primary reset-password-btn"> Reset your password </button>
                        </div>
                    </form>
                </div>`;
                
            return form;
    }

    verifyEmail(verifyEmailBtn, form) {
        
        let url = Routing.generate("verify_user_email");
        let emailInput = form.querySelector("input[name='confirmEmail']");
        let emailValue = emailInput.value;
        let responseStatus = form.parentNode.querySelector(".response-status");
        responseStatus.innerHTML = "";
        // If the email is valide, we verify that the token we sent him is valide
       // let validateToken = form.querySelector(".validate-token");
        if(!emailValue) {
            return;
        }
        let content = {
            email: emailValue
        }
        let data = JSON.stringify(content);

        let response = axios.post(url,data)
                            .then(response => {
                                if(response.status === 200) {
                                 // if the email is valide , we hide the email step and display the token step
                                 this.serializeValidateToken(form);
                                 let responseMessage = `<div class="alert alert-success" role="alert">
                                                      ${response.data.message}
                                                     </div>`;
                                    responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                                }else if (response.status === 403) {
                                    let responseMessage = `<div class="alert alert-danger" role="alert">
                                                      ${response.data.message}
                                                     </div>`;
                                    responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                                }else {
                                    let responseMessage = `<div class="alert alert-danger" role="alert">
                                                    An unknown error occured on the server. Please try later again !
                                                    </div>`;
                                    responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            })
    }

    serializeValidateToken(form) {
        let self = this;
        // If the email is validate we hide the confirm email
        let confirmEmail = form.querySelector(".confirm-email");
        let verifyEmail = form.querySelector(".verify-email");
        confirmEmail.style.display = "none";
        verifyEmail.style.display = "none";
        // We display the token verificaiton input
        let validateToken = form.querySelector(".validate-token");
        let validateTokenBtn = form.querySelector(".validate-token-btn");
        validateToken.style.display = "block";
        validateTokenBtn.style.display = "inline";

        // And then we add an event Listener to the validate token button
        validateTokenBtn.addEventListener("click", function(e){
            e.preventDefault();
            self.validateToken(form);
        })

    }
    

    validateToken(form) {

        let tokenInput = form.querySelector("input[name='confirmToken']");
        let tokenValue = tokenInput.value;

        if(!tokenValue) {
            return;
        }

        let responseStatus = form.parentNode.querySelector(".response-status");
        responseStatus.innerHTML = "";
        
        let url = Routing.generate("password_reset_validate_token");
        let content = {
            token: tokenValue
        }
        let data = JSON.stringify(content);
        let response = axios.post(url,data)
                       .then(response => {
                           if(response.status === 200) {
                             // If the token is valide we allow the user to proceed to the change password step
                             this.serializePasswordResetStep(form);
                             let responseMessage = `<div class="alert alert-success" role="alert">
                                                      ${response.data.message}
                                                     </div>`;
                                responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                           }else if (response.status === 403) {
                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                                      ${response.data.message}
                                                  </div>`;
                                responseStatus.insertAdjacentHTML("afterbegin", responseMessage);

                           }else {
                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                                An unknown error occured on the server. Please try later again !
                                               </div>`;
                                responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                           }
                       })
                       .catch(error =>{
                           console.error(error);
                       });

    }

    serializePasswordResetStep(form) {

         let self = this;
         // if the token is valide we hide the token step and proceed to the change password step
         let validateToken = form.querySelector(".validate-token");
         let validateTokenBtn = form.querySelector(".validate-token-btn");
         validateToken.style.display = "none";
         validateTokenBtn.style.display = "none";
         
         let resetPasswordStep = form.querySelector(".reset-password-step");
         let resetPasswordBtn = form.querySelector(".reset-password-btn");

         resetPasswordStep.style.display = "block";
         resetPasswordBtn.style.display = "inline";
         resetPasswordBtn.addEventListener("click", function(e) {
             e.preventDefault();
             self.handleResetPassword(form);
         })
    }

    handleResetPassword(form) {

        let content = this.deserializeForm(form);
        
        if(!content) return;
        let responseStatus = form.parentNode.querySelector(".response-status");
        responseStatus.innerHTML = "";

        let url = Routing.generate("reset_forget_password");
        let data = JSON.stringify(content);
        let response = axios.post(url,data)
                       .then(response => {
                           if(response.status === 200) {
                            // If the response has succeeded we remove the form and add back the the resest password button
                            let responseMessage = `<div class="alert alert-success" role="alert">
                                                      ${response.data.message}
                                                     </div>`;
                               // responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                                this._loginStatus.insertAdjacentHTML("afterbegin", responseMessage);
                                this.handleAfterPasswordResat(form);
                           }else if (response.status === 403) {

                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                                  ${response.data.message}
                                                   </div>`;
                                responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                           }else {
                            let responseMessage = `<div class="alert alert-danger" role="alert">
                                       An unknown error occured on the server. Please try later again !
                                                  </div>`;
                                responseStatus.insertAdjacentHTML("afterbegin", responseMessage);
                           }
                       })
                       .catch(error => {
                           console.error(error);
                       })

    }

    deserializeForm(form) {
        let email = form.querySelector("input[name='confirmEmail']").value;
        let token = form.querySelector("input[name='confirmToken']").value;
        let newPassword = form.querySelector("input[name='newPassword']");
        let newPasswordValue = newPassword.value;
        let repeatNewPassword = form.querySelector("input[name='repeatNewPassword']").value;

        let responseStatus = form.parentNode.querySelector(".response-status");
        responseStatus.innerHTML = "";

        if(!newPasswordValue || newPasswordValue === null || newPasswordValue === '') {
          let errorMessage = `<div class="alert alert-danger" role="alert">
                              The new password is invalide
                              </div>`;
                newPassword.insertAdjacentHTML("afterend", errorMessage);
                return false;
        }

        if(newPasswordValue.length < 8) {
            let errorMessage = `<div class="alert alert-danger" role="alert">
                              The password must be at least 8 characters long
                              </div>`;
                newPassword.insertAdjacentHTML("afterend", errorMessage);
                return false;
        }

        if(newPasswordValue !== repeatNewPassword) {
            let errorMessage = `<div class="alert alert-danger" role="alert">
                              The two passwords does not match
                              </div>`;
                responseStatus.appendChild(errorMessage);
                return false;
        }

        if(!email || !token) {
            let errorMessage = `<div class="alert alert-danger" role="alert">
                              You have to go through all the steps to reset your password
                              </div>`;
                responseStatus.appendChild(errorMessage);
                return false;
        }

        let content = {
            email: email,
            token: token,
            newPassword: newPasswordValue,
            repeatNewPassword: repeatNewPassword
        }
        return content;
    }

    handleAfterPasswordResat(form) {
        // If the user has successfully resat his password we remove the form first
        //form.remove();
        this._resetPasswordWrapper.remove();
        // we bring back the login form
        this._loginForm.style.display = "block";
        // we bring the reset password button
        this._resetPasswordBtn.style.display = "inline";
    }
}