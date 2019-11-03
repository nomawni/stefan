import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
window.addEventListener("load", function() {

    let deleteProduct = document.querySelector(".delete-product");

    deleteProduct.addEventListener("click", e => {

        Routing.setRoutingData(Routes);

         //"http://localhost:8001/product/delete/";

        let productItemModal = deleteProduct.closest("#productItemModal");

        let productId = productItemModal.dataset.productId;
        
        if(!productId) {
            return;
        }

        let url = Routing.generate("product_delete", {id: productId});
         
        //url = url + productId;

        //alert(_token);

        let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type" : "application/json",
            },
           // body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));
            return data;
        })
        .catch(error => console.error(error));

        response.then(data => {

            console.log(data);

            let element = document.querySelector(`[data-product-id="${productId}"]`);

            console.log(element);

            if(data.action == "deleted") {

                element.remove();

                console.log("Element removed");
            }

        });


    })


})