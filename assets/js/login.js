import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

if(document.getElementById("loginLink")){

let login = document.getElementById("loginLink");

login.addEventListener("click", e => {

    e.preventDefault();

    Routing.setRoutingData(Routes);

    if(document.getElementById("loginModal")) {

        $("#loginModal").modal("show");

        let loginModal = document.getElementById("loginModal");

        let loginModalBody = loginModal.querySelector("#loginModalBody");
        let loginForm = loginModalBody.querySelector("form");

        let _csrfToken = loginForm.querySelector("[name=_csrf_token]");

        let signIn = loginModal.querySelector(".sign-in");

        //_csrfToken.value = "{{ csrf_token('authenticate') }}";

        //loginForm.addEventListener("submit", e => {
            signIn.addEventListener("click", function(e) {
            e.preventDefault();

            let formData = new FormData(loginForm);
            let url = Routing.generate("app_login");

            console.log(formData);

            let response = fetch(url, {
                method: "POST", 
                headers: {

                }, 
                body: formData
            });

            console.log(response);

        });

    //alert("Wanna login ?");

    }
});
}