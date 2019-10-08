let listCart = document.getElementById("listCart");

let url = window.cartAll;

let rememberResponse = null;

listCart.addEventListener('click', function(e) {

    let response = fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
    })
    .then(response => response.json())
    .then(data => {
     console.log(JSON.stringify(data))
      return data;
    })
    .catch(error => console.error(error));

    console.log("************************************************");
    console.log(response);
    console.log("--------------------------------------------------");

    response.then(products =>  {

        console.log(products);

        let modalTitle = document.getElementById("listCartsModalTitle");

        let modalCartBody = document.getElementById('modalCartBody');

        modalTitle.innerHTML = "Your cart";

        let elemContainer = document.createElement("div");

        products.map(product => {

            let item = product.products[0];

            let productContainer = document.createElement("div");

            productContainer.classList.add("product-container");

            productContainer.dataset.productId = item.id;

            productContainer.dataset.cartId = product.id;

            console.log(item.productImage.finalPath);

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
            }

            let removeProduct = document.createElement("button");

            removeProduct.onclick = function() { removeProductFromCart(this) };
            
            removeProduct.classList.add("btn", "btn-primary");

            removeProduct.innerHTML = "Remove";

            productContainer.appendChild(removeProduct);

            elemContainer.appendChild(productContainer);

            console.log(product);

        });

        console.log(elemContainer);

        modalCartBody.appendChild(elemContainer);

        console.log(modalCartBody);

        $('#listCartsModal').modal('show');
    });

   
    
});


function removeProductFromCart(elem) {

    let product = elem.closest(".product-container");

    let url = "http://localhost:8001/cart/remove/";

    console.log(elem);

    let productId = product.dataset.productId;

    let cartId = product.dataset.cartId;

    console.log(productId);

    console.log(elem);

    console.log(product);

    if(!productId)
        return;

    let data = {
        productId: productId
    }

    url = url + cartId;

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

        let nCart = document.querySelector(".nCart");

        let productElem = document.querySelector(`[data-product-id='${productId}']`);

        let addCart = productElem.querySelector(".add-cart");

        if(data.type == "removed") {

            //numberCart
            product.remove();

            nCart.innerHTML = data.numberCart;

            addCart.style = "black";
        }
    })

}