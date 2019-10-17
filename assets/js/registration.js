import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
//document.addEventListener("load", e => {

       // alert("Outside of registration link");

    if(document.getElementById("registrationLink")) {

        Routing.setRoutingData(Routes);

       // alert("Inside registration link");

        let registrationLink = document.getElementById("registrationLink")

        registrationLink.addEventListener("click", function(e) {
            
            e.preventDefault();

        if(document.getElementById("registrationModal")) {

         $("#registrationModal").modal("show");

         let registrationModal = document.getElementById("registrationModal");
         let registrationModalBody = registrationModal.querySelector("#registrationModalBody");

         let registrationFrom = registrationModalBody.querySelector("form");

         registrationFrom.addEventListener("submit", e => {

            let url = Routing.generate("app_register");
            let formData = new FormData(registrationFrom);

            let response = fetch(url, {
                method: "POST", 
                headers: {

                }, 
                body: formData
            });

            console.log(response);


         });

        }

    })

    }
//})