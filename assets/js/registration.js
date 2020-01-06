import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
//document.addEventListener("load", e => {

       // alert("Outside of registration link");

    if(document.getElementById("registrationLink")) {

        Routing.setRoutingData(Routes);

       // alert("Inside registration link");

        let registrationLink = document.getElementById("registrationLink");

        registrationLink.addEventListener("click", function(e) {
            
            e.preventDefault();

        if(document.getElementById("registrationModal")) {

         $("#registrationModal").modal("show");

         let registrationModal = document.getElementById("registrationModal");
         let registrationModalBody = registrationModal.querySelector("#registrationModalBody");

         let registrationFrom = registrationModalBody.querySelector("form");

         let registerButton = registrationModal.querySelector(".register");

         registrationFrom.addEventListener("submit", e => {

            e.preventDefault();
            registrationHandler();

         });

         registerButton.addEventListener("click", function(e) {
            
            registrationHandler();

         });

     /* This function validate the email address */

     function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

     /* end of the email address validate */

    function registrationHandler() {

        // We remove all of the alert elements in the form when the user submit the form
        let allAlerts = registrationFrom.querySelectorAll(".alert");
        if(allAlerts) {
            allAlerts.forEach(function(alert){
                alert.remove();
            })
        }

        let usernameInput = registrationFrom.querySelector("#username");
        let usernameValue = usernameInput.value;
 
        if(!usernameValue) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                                Your username can not null
                              </div>`;
           // errorElem.innerHTML = "";
            usernameInput.parentNode.insertAdjacentHTML("afterend", errorElem); //after(errorElem);
            return;
        }

        if(usernameValue.length < 5) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                               Your username can not be less than 5
                              </div>`; //document.createElement("p");
            //errorElem.innerHTML = "Your username can not be less than 5";
           // console.log(errorElem);
            usernameInput.parentNode.insertAdjacentHTML("afterend", errorElem);  //after(errorElem);
            return;
        }

        let emailInput = registrationFrom.querySelector("#email");
        let emailValue = emailInput.value;

        if(!emailValue) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                                Your email can not be null
                              </div>`;
           // errorElem.innerHTML = "";
            emailInput.parentNode.insertAdjacentHTML("afterend", errorElem); //after(errorElem);
            return;
        }

        if(!validateEmail(emailValue)) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                                    Your email is not valid
                              </div>`;
           // errorElem.innerHTML = "";
            emailInput.parentNode.insertAdjacentHTML('afterend', errorElem);
            return;
        }

        let plainPasswordInput = registrationFrom.querySelector("#plainPassword");
        let plainPasswordValue = plainPasswordInput.value;

        if(!plainPasswordValue) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                                 Your password can not be null
                              </div>`;
           // errorElem.innerHTML = "";
            plainPasswordInput.parentNode.insertAdjacentHTML('afterend', errorElem);
            return;
        }

        if(plainPasswordValue.length < 8) {
            let errorElem =  `<div class="alert alert-danger" role="alert">
                                   Your password can not be less than 8 characters
                              </div>`;
            //errorElem.innerHTML = "";
            plainPasswordInput.parentNode.insertAdjacentHTML("afterend", errorElem);   //after(errorElem);
            return;
        } 

        let url = Routing.generate("app_register");
        let homepage_url = Routing.generate("app_homepage");
        let formData = new FormData(registrationFrom);

        let registrationStatus = registrationModalBody.querySelector(".registration-status");
        registrationStatus.innerHTML = "";
        
        let status = null;
        let response = fetch(url, {
            method: "POST", 
            headers: {
                "Accept": "application/json",
            }, 
            body: formData
        })
        .then(response => {
         
         status = response.status;
         return response.json();
        }) 
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => console.error(error)); 

        response.then( data => {
            if(status === 200) {
                let statusMessage = `<div class="alert alert-success" role="alert">
                                     You have reigstered successfully
                                    </div>`;
                registrationStatus.insertAdjacentHTML("afterbegin", statusMessage);
                //alert("You have been registered");
                setTimeout(function(e) {
                   window.location.href= homepage_url;
               }, 3000);
            }else if (status === 403) {
                let statusMessage = `<div class="alert alert-danger" role="alert">
                                     ${data.message}
                                   </div>`;
                registrationStatus.insertAdjacentHTML("afterbegin", statusMessage);
            }
            else if (status === 400) {
                let statusMessage = `<div class="alert alert-danger" role="alert">
                                     The data you entered are incorrect. Please check them !
                                   </div>`;
                registrationStatus.insertAdjacentHTML("afterbegin", statusMessage);
            }else {
                let statusMessage = `<div class="alert alert-danger" role="alert">
                                    An unknown error occured on the server. Please try again later !
                                   </div>`;
                registrationStatus.insertAdjacentHTML("afterbegin", statusMessage);
            }
            console.log(data);
            if(data) {

                console.log(data);
            }

        });

        console.log(response);

    }

        }

    })

    }
//})