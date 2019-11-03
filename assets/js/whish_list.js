import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';
//let url = window.wishlistNew;

var listAddCart = document.querySelectorAll('.add-whishlist');

//listAddCart.forEach(function(item, pos) {

   // item.addEventListener('click', function(e) {

   $(document).on("click", ".add-whishlist", function(e) {

        Routing.setRoutingData(Routes);

        let url = Routing.generate("whish_lists_new");
        let item = e.target;

    // let productItem = document.querySelectorAll('.productItem')[pos];

    let whishlistId = item.dataset.whishlistId ? item.dataset.whishlistId : null;

    let productItem = item.closest(".card");

     let productId = productItem.dataset.productId;

     productId = parseInt(productId);

     whishlistId = parseInt(whishlistId);

     console.log(productId);

     let responseData;
        
       let data = {
           Id: productId,
           WhishlistId: whishlistId
       }
       
       let status = null;

       let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            console.log(response);
            status = response.status;
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data));
            return data;
        })
        .catch(error => {
            console.error(error)
            
        });
    
        console.log(response);

        response.then(data => {
            console.log(data);

            if(status === 403) {

                window.alert("You are not connected");

                return;
            }

            let productCart = document.querySelector(".nwishlist"); // nwishlist

            if(data.numberWhishlists > 0){
                productCart.innerHTML = data.numberWhishlists; //data["numberWhishlists"];
            }else {
                productCart.innerHTML = "";
            }

            if(status === 201) {
                item.style.color = "green";
                item.dataset.whishlistId = data["Id"] ? data["Id"] : null;

            }else if (status === 200) {
                item.style.color = "black";
                item.dataset.whishlistId = null;


            }else {
                return;
            }

           /* if(data["type"] == "added") {
                item.style.color = "green";
                item.dataset.whishlistId = data["Id"] ? data["Id"] : null;

            }else if (data["type"] == "removed") {
                item.style.color = "black";
                item.dataset.whishlistId = null;


            }else {
                return;
            } */

            
        });

});
   