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
       
        alert("You would like to register ?");

        let usernameInput = registrationFrom.querySelector("#username");
        let usernameValue = usernameInput.value;

       /* if(usernameValue.length < 5) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your username can not be less than 5";
            console.log(errorElem);
            usernameInput.after(errorElem);
            return;
        } 
        if(!usernameValue) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your username can not null";
            usernameInput.after(errorElem);
            return;
        }

        let emailInput = registrationFrom.querySelector("#email");
        let emailValue = emailInput.value;

        if(!emailValue) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your email can not be null";
            emailInput.after(errorElem);
            return;
        }

        if(!validateEmail(emailValue)) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your email is not valid";
            emailInput.after(errorElem);
            return;
        }

        let plainPasswordInput = registrationFrom.querySelector("#plainPassword");
        let plainPasswordValue = plainPasswordInput.value;

        if(!plainPasswordValue) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your password can not be null";
            plainPasswordInput.after(errorElem);
            return;
        }

        if(plainPasswordValue.length < 7) {
            let errorElem = document.createElement("p");
            errorElem.innerHTML = "Your password can not be less than 7 characters";
            plainPasswordInput.after(errorElem);
            return;
        } */

        let url = Routing.generate("app_register");
        let homepage_url = Routing.generate("app_homepage");
        let formData = new FormData(registrationFrom);
        
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
                alert("You have been registered");
                window.location.href= homepage_url;
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