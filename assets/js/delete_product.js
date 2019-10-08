
window.addEventListener("load", function() {

    let deleteProduct = document.querySelector(".delete-product");

    deleteProduct.addEventListener("click", e => {

        let url = "http://localhost:8001/product/delete/";

        let productItemModal = deleteProduct.closest("#productItemModal");

        //let _token = productItemModal.getElementsByName("_token");

        //let _method = productItemModal.getElementsByName("_method");

        productId = productItemModal.dataset.productId;

       /* let data = {
            ProductId: productId,
           // _token: _token,
           // _method: _method
        } */

       // console.log(data);
        
        if(!productId) {
            return;
        }
         
        url = url + productId;

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