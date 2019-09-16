let listProducts = document.querySelectorAll(".productItem");

listProducts.forEach((product, pos) => {

    product.addEventListener('click', e => {

        let url = "http://localhost:8001/product/show/";
       //   let url =  window.productShow;

        let card = product.closest('.card');

        let productId = card.dataset.productId;

        let data = {
            Id: productId
        }

        url = url + productId;

        let response = fetch(url, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
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

        let productItemModal = document.querySelector('#productItemModal');

        let productItemModalTitle = productItemModal.querySelector('#productItemModalTitle');

        productItemModalTitle.innerHTML = data.name;
 
        let productImg = productItemModal.querySelector("#productItemImg");

        productImg.src = data.product_image.final_path;

        let productDetail = productItemModal.querySelector("#productDetail");

       // productDetail.innerHTML = data.price;

        let price = productItemModal.querySelector(".item-price");

        if(data.price) {

        price.innerHTML = data.price;
        }

        let productItemDescription = productItemModal.querySelector("#productItemDescription");

        productItemDescription.innerHTML = data.description;

        let itemSize = productItemModal.querySelector(".item-size");

        if(data.size) {

        itemSize.innerHTML = data.size;   
        }

        let itemQuantity = productItemModal.querySelector(".item-quantity");

        itemQuantity.innerHTML = data.quantity;

        //productDetail.querySelector("#priceItem").innerHTML = data.price;

       // console.log(data.productImage.finalPath);

        $('#productItemModal').modal('show');

      });

    });
})