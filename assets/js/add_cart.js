import Ajax from './ajax.js';
const routes = require('../../public/js/fos_js_routes.json');
import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js';

Routing.setRoutingData(routes);

//let lf = "http://localhost:8001/cart/";

let url = window.cardNew;

var listAddCart = document.querySelectorAll('.add-cart');

listAddCart.forEach(function(item, pos) {

    item.addEventListener('click', function(e) {

    // let productItem = document.querySelectorAll('.productItem')[pos];

    let cartId = item.dataset.cartId ? item.dataset.cartId : null;

    let productItem = item.closest('.card');

     let productId = productItem.dataset.productId;

    // let cartId = item.dataset.cartId;

     productId = parseInt(productId);

     cartId = parseInt(cartId);

     console.log(productId);

     //let responseData;
        
       let data = {
           Id: productId,
           CartId: cartId
       };

       let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
           // console.log(JSON.stringify(data));
            return data;
        })
        .catch(error => console.error(error));
    
        console.log(response);

        response.then(data => {

            console.log(data);
            let productCart = document.querySelector(".nCart");
            productCart.innerHTML = data["numberCart"];  
            
            if(data["type"] == "added")
                item.style.color = "blue";
            else 
                item.style.color = "black";
        });         

});
   

});