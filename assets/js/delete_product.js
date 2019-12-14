import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
window.addEventListener("load", function() {

    let deleteProduct = document.querySelector(".delete-product");

    deleteProduct.addEventListener("click", e => {

        Routing.setRoutingData(Routes);

         //"http://localhost:8001/product/delete/";
         console.log(e.target);
         let modalEelm = e.target.closest("#productItemWrapper");

        let productItemModal = deleteProduct.closest("#productItemModal");
        let productItemModalBody = productItemModal.querySelector(".modal-body");
        let productId = productItemModal.dataset.productId;
        
        if(!productId) {
            return;
        }

        let url = Routing.generate("product_delete", {id: productId});

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
            console.log("*****************Target****************");

            console.log(element);

            if(data.action == "deleted") {

                element.remove();
                modalEelm.style.display = "none";
                console.log("Element removed");
                let indicateProdDeleted = `<p class="success"> The Product has been deleted successfully </p>`;
                productItemModalBody.insertAdjacentHTML('afterbegin', indicateProdDeleted);
            }else {
                let indicateProdDeleted = `<p class="success"> The Product could not be deleted successfully </p>`;
                productItemModalBody.insertAdjacentHTML('afterbegin', indicateProdDeleted);
            }

        });
     $("#productItemModal").on("hidden.bs.modal", function(el) {
        console.log("**************After Modal closed***********");
        console.log(el.target);
         productItemModalBody.removeChild(productItemModalBody.querySelector("p"));
         //e.target.querySelector("#productItemWrapper").style.display = "block";
         modalEelm.style.display ="block";
         
     });

    });


});