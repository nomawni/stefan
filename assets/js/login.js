import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
import ResetPassword from './confirmation/reset_password.js';
if(document.getElementById("loginLink")){

let login = document.getElementById("loginLink");

login.addEventListener("click", e => {

    e.preventDefault();

    Routing.setRoutingData(Routes);

    if(document.getElementById("loginModal")) {

        let loginModal = document.getElementById("loginModal");
        let loginModalBody = loginModal.querySelector("#loginModalBody");
        // Before we handle the reset password request , we first check if the reset-password-wrapper exist 
        // If it exists we remove it
        if(loginModalBody.querySelector(".reset-password-wrapper")) {
            loginModalBody.querySelector(".reset-password-wrapper").remove();
        }
    
        let loginForm = loginModalBody.querySelector("form");
        // We set the login form visible if it was hidden from the request rest password
        loginForm.style.display = "block";

        $("#loginModal").modal("show");
        // handle when the user has forgotten his password 
        let resetPassword = new ResetPassword();

        let forgetPassword = loginModalBody.querySelector(".forget-password");
        forgetPassword.addEventListener("click", function(e) {
            e.preventDefault();
            resetPassword.requestResetPassword(e.currentTarget);
        });

        // End of handling the reset password

        let _csrfToken = loginForm.querySelector("[name=_csrf_token]");

        let signIn = loginModal.querySelector(".sign-in");

        //_csrfToken.value = "{{ csrf_token('authenticate') }}";

        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            loginHandler();
        });

        //loginForm.addEventListener("submit", e => {
            signIn.addEventListener("click", function(e) {
            e.preventDefault();
            loginHandler();

        });

    //alert("Wanna login ?");

    function loginHandler() {

        let inputEmail = loginForm.querySelector("#inputEmail");
        let inputEmailValue = inputEmail.value;

        let inputPassword = loginForm.querySelector("#inputPassword");
        let inputPasswordValue = inputPassword.value;

        if(!inputEmailValue) {
            inputEmail.nextElementSibling.innerHTML = "Your email can not be null";
            return;
        }
        if(!inputPasswordValue){
            inputPassword.nextElementSibling.innerHTML = "Your password can not be null";
            return;
        }

        let formData = new FormData(loginForm);
        let url = Routing.generate("app_login");
        let homepage_url = Routing.generate("app_homepage");

        console.log(formData);

        let response = fetch(url, {
            method: "POST", 
            headers: {

            }, 
            body: formData
        });

        console.log(response);
        let loginStatus = loginModalBody.querySelector(".login-status");
        loginStatus.innerHTML = "";
        response.then(data => {
            console.log(data);
            if(data.status === 200) {
                
                let successMessage = `<div class="alert alert-success" role="alert">
                                      You have logged in successfully
                                        </div>`;
                loginStatus.insertAdjacentHTML("afterbegin", successMessage);
                setTimeout(function() {
                    window.location.href = homepage_url;
                }, 3000);
                
               // window.location.href = homepage_url;
            }else if (data.status === 500) {
                let successMessage = `<div class="alert alert-danger" role="alert">
                                      Your login or password is incorrect
                                        </div>`;
                loginStatus.insertAdjacentHTML("afterbegin", successMessage);
            }else {
                let successMessage = `<div class="alert alert-danger" role="alert">
                                      An unknown error occured on the server. Please try again later!
                                        </div>`;
                loginStatus.insertAdjacentHTML("afterbegin", successMessage);
            }
        })

        }
    }
});
}