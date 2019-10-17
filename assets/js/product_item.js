import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

let listProducts = document.querySelectorAll(".productItem");

//listProducts.forEach((product, pos) => {

    //product.addEventListener('click', e => {
    $(document).on('click', '.productItem', function(e) {

        Routing.setRoutingData(Routes);

        let product = e.target;
         //"http://localhost:8001/product/show/";
       //   let url =  window.productShow;

        let card = product.closest('.card');
        //let card = product.closest('.card');

        let cartElem = card.closest(".add-cart");

        console.log(product);

        console.log(card);

        //console.log(cartId);

        let productId = card.dataset.productId;

        let data = {
            Id: productId
        }

        let url = Routing.generate("product_show", {id: productId});

        //url = url + productId;

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

         console.log(document.cookie);

        let productItemModal = document.querySelector('#productItemModal');

        productItemModal.dataset.productId = productId;

        let addCart = productItemModal.querySelector(".add-cart");

        //addCart.dataset.productId = productId;

        let productItemModalTitle = productItemModal.querySelector('#productItemModalTitle');

        let productActions = productItemModal.querySelector(".product-actions");

        let authorActions = productActions ? productActions.querySelector(".author-actions"): null;

        if(card.dataset.author) {
           if(authorActions)
               authorActions.style =  "display:inline";

        }else {
            
            if(authorActions) {
            authorActions.style = "display:none";
            }
        }

        productItemModalTitle.innerHTML = data.name;
 
        let productImg = productItemModal.querySelector("#productItemImg");

        productImg.src = data.productImage ? data.productImage.finalPath : "";

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

        let listComments = productItemModal.querySelector("#listComments");

        listComments.innerHTML = "";

        let allComments = data.comments;

        console.log(allComments);

        for(let i = 0; i < allComments.length; i++) {

            let comment = allComments[i];

            let img = document.createElement("img");

            img.src = comment.author.avatar ? comment.author.avatar.finalPath : "";

            img.alt = comment.author.avatar ? comment.author.avatar.originalName : "";

            img.style = "width:50px;height:50px;";

            listComments.appendChild(img);

            let p = document.createElement("p");

            p.innerHTML = allComments[i].content;

            listComments.appendChild(p);

            let span = document.createElement("span");

            span.innerHTML = new Date(comment.publishedAt);

            listComments.appendChild(span);
        }

        //productDetail.querySelector("#priceItem").innerHTML = data.price;

       // console.log(data.productImage.finalPath);

        $('#productItemModal').modal('show');

      });

    });
//})