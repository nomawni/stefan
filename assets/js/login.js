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

        response.then(data => {
            console.log(data);
            if(data.status === 200) {
                alert("You logged in");
                console.log(homepage_url);
                window.location.href = homepage_url;
            }
        })

        }
    }
});
}