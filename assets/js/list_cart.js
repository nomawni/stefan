import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

let listCart = document.getElementById("listCart");

//let url = window.cartAll;

let rememberResponse = null;

listCart.addEventListener('click', function(e) {

    Routing.setRoutingData(Routes);

    let url = Routing.generate("cart_show_all");

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

        modalTitle.innerHTML = "Your cart";

       let modalCartBody = document.getElementById('modalCartBody');

      /* ***** New table Items *****/

       let productHeaderNames = ["Product","Quantity", "Price", "Size", "Delete", "TotalSub"];

        //elemContainer.classList.add("product-container");
        let table = document.createElement("table");
        let theader = document.createElement('thead');
        table.appendChild(theader);
        let row = document.createElement("tr");
        theader.appendChild(row);

        productHeaderNames.map(name => {
            let headerCol = document.createElement("th");
            if(name == "Product") {
                headerCol.setAttribute("colspan", "2");
            }
            
            headerCol.innerHTML = name;
            row.appendChild(headerCol);
        });
       
        modalCartBody.appendChild(table);
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        let tfooter = document.createElement("tfoot");
        table.appendChild(tfooter);
       // elemContainer.dataset.productId = 
       // the footer part          
          let footerTh =  document.createElement("th");
          footerTh.setAttribute("scope", "row");
          footerTh.innerHTML = "Totals";
          tfooter.appendChild(footerTh);
          let totalSumItemsTd = document.createElement("td");
          tfooter.appendChild(totalSumItemsTd);
          let totalItemsAmount = 0;

         /* **** End of the table Items *****/

         products.map(cart => {

            let item = cart.products[0];

            console.log(item);

            let i =0;
            let rowBody = document.createElement("tr");

            rowBody.dataset.cartId = cart.id;
            rowBody.dataset.productId = item.id;

            //rowBody.appendChild(tbody);
            tbody.appendChild(rowBody);

            let imgTd = document.createElement("td");
            rowBody.appendChild(imgTd);
            //productTd.setAttribute("collapse", 2);
            let prodImg = document.createElement('img');

            let img = item.productImages[0] ? item.productImages[0].finalPath : null;
            let name = item.name;

            prodImg.src = item.productImages[0] ? item.productImages[0].finalPath : null; //img.finalPath;
            prodImg.style.width = "50px";
            prodImg.style.hidden = "50px";
            imgTd.appendChild(prodImg);

            let nameTd = document.createElement("td");
            rowBody.appendChild(nameTd);
            nameTd.innerHTML = name;

            let qtTd = document.createElement("td");
            rowBody.appendChild(qtTd);

            let quantity = item.quantity;

            let qtInput = document.createElement("input");
            qtInput.setAttribute("type", "number");
            qtInput.setAttribute("min", "1");
            qtInput.setAttribute("max", quantity);
            qtInput.classList.add("quantity");
            qtInput.value = 1;
            qtTd.appendChild(qtInput);
            // The price of the item
            let priceTd = document.createElement("td");
            priceTd.classList.add("price");
            rowBody.appendChild(priceTd);
            let price = item.price;
            //let priceTd = document.createElement("td");
            //rowBody.appendChild(priceTd);
            priceTd.innerHTML = price;

            // The size of the item
            let size = item.size;
            let sizeTd = document.createElement("td");
            rowBody.appendChild(sizeTd);
            sizeTd.innerHTML = size;

            // Creating the delete item button
            let removeItemTd = document.createElement("td");
            rowBody.appendChild(removeItemTd);
            
            let removeItem = document.createElement("button");

            removeItem.onclick = function() { removeProductFromCart(this) };

            removeItem.classList.add("btn", "btn-primary");
            let deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fas", "fa-trash");
            //removeItem.innerHTML = "Remove";
            removeItem.appendChild(deleteIcon);
            removeItemTd.appendChild(removeItem);

            // End of the delete item button

            //This total is related to the quantity of the item and the price of the item
            let subTotalTd = document.createElement("td");
            rowBody.appendChild(subTotalTd);

            qtInput.addEventListener("change", function() {
                let itemSubTotal = this.parentElement.parentElement.querySelector(".sub-total");
                //let itemQtTotal = this.parentElement.parentElement.querySelector(".quantity");
                let itemPriceTotal = this.parentElement.parentElement.querySelector(".price");
                console.log(itemSubTotal);
                //console.log(itemQtTotal.value);
                console.log(itemPriceTotal.innerHTML);
                //itemSubTotal.innerHTML = itemQtTotal.value * itemPriceTotal.innerHTML;
                //itemSubTotal.innerHTML = this.value * itemPriceTotal.innerHTML;
                
                let totalItemPrice = this.value * itemPriceTotal.innerHTML;
                totalItemPrice = parseFloat(totalItemPrice).toFixed(2);
                itemSubTotal.innerHTML = totalItemPrice; //this.value * itemPriceTotal.innerHTML;
                let allSubTotals = document.querySelectorAll(".sub-total");
                let val =0;
                    allSubTotals.forEach(function(subTotal, pos)  {
                        console.log(subTotal);
                        console.log(val);
                        val += parseFloat(subTotal.innerHTML);
                    });
                    totalSumItemsTd.innerHTML = parseFloat(val).toFixed(2);
            });
            //qtTd.appendChild(qtInput);

            let subTotal = price * qtInput.value;
            //subTotal = parseFloat(subTotal).toFixed(2);
            //let subTotalTd = document.createElement("td");
            subTotalTd.classList.add("sub-total");
            //rowBody.appendChild(subTotalTd);
            subTotalTd.innerHTML = subTotal;

            
            /*totalSumItemsTd.innerHTML*/ totalItemsAmount += subTotal; 




        /*let elemContainer = document.createElement("div");

        products.map(product => {

            let item = product.products[0];

            let productContainer = document.createElement("div");

            productContainer.classList.add("product-container");

            productContainer.dataset.productId = item.id;

            productContainer.dataset.cartId = product.id;

            //console.log(item.productImage.finalPath);

            let productImg = document.createElement('img');

            let produdDesc = document.createElement('p');

           // productImg.src = product.prodFinalPath;

           let productTitle = document.createElement("h1");

           let productPrice = document.createElement("p");

           let productQt = document.createElement("p");

           productTitle.innerHTML = item.name;

            productImg.src = item.productImage ? item.productImage.finalPath : "";

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

               /* if(item.stars.length > 0) {

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

        }); */
    });

        // Setting the value of the total items
        totalSumItemsTd.innerHTML = totalItemsAmount;

        //console.log(elemContainer);

        //modalCartBody.appendChild(elemContainer);

        console.log(modalCartBody);

        $('#listCartsModal').modal('show');
    });

    $("#listCartsModal").on('hidden.bs.modal', e => {

        modalCartBody.innerHTML = "";
    });
    
});


function removeProductFromCart(elem) {

    //let product = elem.closest(".product-container");

    let item = elem.parentElement.parentElement;

    //let url = Routing.generate("cart_delete"); //"http://localhost:8001/cart/remove/";

    console.log(elem);
    console.log(item);

    //let productId = product.dataset.productId;
    let productId = item ? item.dataset.productId : null;

    if(!productId){
        alert("An error occured !");
        return;
    }

    let cartId = item ? item.dataset.cartId : null;

    if(!cartId) {
        alert("An error occured !");
        return;
    }

    let url = Routing.generate("cart_delete", {id: cartId});

    let data = {
        productId: productId
    }

   // url = url + cartId;

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
            item.remove();

            nCart.innerHTML = data.numberCart;

            addCart.style = "black";
        }
    })

}