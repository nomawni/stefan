import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

let whishlists = document.querySelector("#whishlists");

whishlists.addEventListener('click', function(e) {

    Routing.setRoutingData(Routes);
    
    let url = Routing.generate("whishlists_show_all"); //window.whishlistAll;

    let response = fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
    })
    .then(response => response.json())
    .then(data => {

    //  console.log(data[0].id); 
   //  console.log(JSON.stringify(data))
      return data
    })
    .catch(error => console.error(error)
    );

    response.then(products => {

        let whishlistModal = document.getElementById("whishlistModal");

        let whishlistModalTitle = whishlistModal.querySelector("#whishlistModalTitle");

        let modalWhishListBody = document.getElementById('modalWhishListBody');

        whishlistModalTitle.innerHTML = "Your whishlist";

        let elemContainer = document.createElement("div");

        //elemContainer.classList.add("product-container");

       // elemContainer.dataset.productId = 

        products.map(product => {
            
            if(!product) {
                modalWhishListBody.innerHTML = "Your whishList is empty";
                return;
            }

            let item = product.products[0];

            console.log(item.productImage.finalPath);

            let productContainer = document.createElement("div");

            productContainer.classList.add("product-container");

            productContainer.dataset.productId = item.id;

            productContainer.dataset.whishListId = product.id;

            let productImg = document.createElement('img');

            let produdDesc = document.createElement('p');

           // productImg.src = product.prodFinalPath;

           let productTitle = document.createElement("h1");

           let productPrice = document.createElement("p");

           let productQt = document.createElement("p");

           productTitle.innerHTML = item.name;

            productImg.src = item.productImage.finalPath;

             productPrice.innerHTML = "Price: " + item.price;

             productQt.innerHTML = "Quantity: " + item.quantity;

            produdDesc.innerHTML = item.description;

            productContainer.appendChild(productImg);

            productContainer.appendChild(productTitle);

            productContainer.appendChild(produdDesc);

            productContainer.appendChild(productPrice);

            productContainer.appendChild(productQt);

            let navRatings = document.createElement("ul");

            navRatings.classList.add("nav", "rating");

            for(let i = 1; i <= 5; i++) {

              /*  let starProduct = document.createElement("li");

                starProduct.classList.add("star-product");

                let productStars = document.createElement("i"); */

                if(item.stars.length > 0) {

                    item.stars.forEach((item, pos) => {

                        let starProduct = document.createElement("li");

                        starProduct.classList.add("star-product");
        
                        let productStars = document.createElement("i");

                        if(item.value >= i) {

                            productStars.classList.add("fas","fa-star", "cursor-pointer");
                            starProduct.appendChild(productStars);
                        }else {
                            productStars.classList.add("far","fa-star","cursor-pointer");
                            starProduct.appendChild(productStars);
                        }

                        navRatings.appendChild(starProduct);

                    });

               // starProduct.appendChild(productStars);
                }else {

                  //  for(let i=1; i <= 5; i++) {

                        let starProduct = document.createElement("li");

                        starProduct.classList.add("star-product");
        
                        let productStars = document.createElement("i");

                    productStars.classList.add("far","fa-star","cursor-pointer");
                    starProduct.appendChild(productStars);

                    navRatings.appendChild(starProduct);
                  //  }
                }

                productContainer.appendChild(navRatings);
               // elemContainer.appendChild(productContainer);
            }

            console.log(product);

            let removeProduct = document.createElement("button");

            removeProduct.onclick = function() { removeProductFromWhishList(this) };

            removeProduct.classList.add("btn", "btn-primary");

            removeProduct.innerHTML = "Remove";

            productContainer.appendChild(removeProduct);

            elemContainer.appendChild(productContainer);

        });

        console.log(elemContainer);

        modalWhishListBody.appendChild(elemContainer);

        console.log(modalWhishListBody);
        
        console.log(products);
        console.log("****--------------*********");

        $('#whishlistModal').modal('show');
    })

    $("#whishlistModal").on('hidden.bs.modal', e => {

        modalWhishListBody.innerHTML = "";
    });
});


function removeProductFromWhishList(elem) {

    let product = elem.closest(".product-container");

     //"http://localhost:8001/whishlists/remove/";

    console.log(elem);

    let productId = product.dataset.productId;

    let whishListId = product.dataset.whishListId;

    console.log(productId);

    console.log(elem);

    console.log(product);

    if(!productId)
        return;

    let data = {
        productId: productId
    }

    let url = Routing.generate("whish_lists_delete", {id: productId});

    //url = url + whishListId;

    let response = fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data));

        return data;
    })
    .catch(error => console.error(error));

    response.then(data => {

        let nwishlist = document.querySelector(".nwishlist");

        let productElem = document.querySelector(`[data-product-id='${productId}']`);

        let addWhishlist = productElem.querySelector(".add-whishlist");

        if(data.type == "removed") {

            //numberWhishList
            product.remove();

            nwishlist.innerHTML = data.numberWhishList;

            addWhishlist.style = "black";

            console.log("----------------------------------");
            console.log(productElem);
        }
    })

}