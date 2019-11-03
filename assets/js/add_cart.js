import Ajax from './ajax.js';
const routes = require('../../public/js/fos_js_routes.json');
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js';

//var listAddCart = document.querySelectorAll('.add-cart');

//listAddCart.forEach(function(item, pos) {

    //item.addEventListener('click', function(e) {

    $(document).on("click", ".add-cart", function(e) {

        let item = e.target;
        Routing.setRoutingData(routes);

        let url = Routing.generate("cart_new");

        console.log(item);

    // let productItem = document.querySelectorAll('.productItem')[pos];

    let cartId = item.dataset.cartId ? item.dataset.cartId : null;

    //let productItem = item.closest('.card');
    let productItem = item.closest('.product-item');

     let productId = productItem.dataset.productId;

     /**
      * adding this element when the user clicks on the product item, so when the user clicks
      * on the add to cart button, we change the color of the add to card button 
      */

     let productElem = document.querySelector(`[data-product-id='${productId}']`);

     let addtoCartButton = productElem.querySelector('.add-cart');

     console.log(productElem);

     console.log(addtoCartButton);

    // let cartId = item.dataset.cartId;

     productId = parseInt(productId);

     cartId = parseInt(cartId);

     console.log(productId);

     //let responseData;
        
       let data = {
           Id: productId,
           CartId: cartId
       };

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
        
         status = response.status;
         return response.json()
        })
        .then(data => {
            console.log(JSON.stringify(data));
            return data;
        })
        .catch(error => {  
            console.error(error);
            
        });
    
        console.log(response);

        response.then(data => {

            if(status === 403) {
                window.alert("Sorry you are not connected");

                return;
            }

            console.log("Cart Data");
            console.log(data);

            let productCart = document.querySelector(".nCart");
            
            if(data.numberCart > 0) {
            productCart.innerHTML = data.numberCart; //data["numberCart"];  
            }else {
                productCart.innerHTML = "";
            }

            if(status === 201) {

                item.dataset.cartId = data["Id"] ? data["Id"] : null;
                item.style.color = "blue";
                addtoCartButton.style.color = "blue";

            }else if(status === 200) {

                item.dataset.cartId = null;
                item.style.color = "black";
                addtoCartButton.style.color = "black";

            }else {
                  return;
            }
            
           /* if(data["type"] == "added") {

                item.dataset.cartId = data["Id"] ? data["Id"] : null;
                item.style.color = "blue";
                addtoCartButton.style.color = "blue";

            }else if(data["type"] == "removed") {

                item.dataset.cartId = null;
                item.style.color = "black";
                addtoCartButton.style.color = "black";

            }else {
                  return;
            } */
        });         

});
   