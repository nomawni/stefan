import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

let whishlists = document.querySelector("#whishlists");

whishlists.addEventListener('click', function(e) {

    Routing.setRoutingData(Routes);
    
    let url = Routing.generate("whishlists_show_all"); //window.whishlistAll;
    let status = null;

    let response = fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
    })
    .then(response => response.json())
    .then(data => {

      return data;
    })
    .catch(error => console.error(error));

    response.then(products => {

        let whishlistModal = document.getElementById("whishlistModal");

        let whishlistModalTitle = whishlistModal.querySelector("#whishlistModalTitle");

        let modalWhishListBody = document.getElementById('modalWhishListBody');

        if(!products) {
            modalWhishListBody.innerHTML = "Your whishList is empty";
            return;
        }

        whishlistModalTitle.innerHTML = "Your whishlist";

        let elemContainer = document.createElement("div");
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
       
        modalWhishListBody.appendChild(table);
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        let tfooter = document.createElement("tfoot");
        table.appendChild(tfooter);
       // the footer part          
          let footerTh =  document.createElement("th");
          footerTh.setAttribute("scope", "row");
          footerTh.innerHTML = "Totals";
          tfooter.appendChild(footerTh);
          let totalSumItemsTd = document.createElement("td");
          tfooter.appendChild(totalSumItemsTd);
          let totalItemsAmount = 0;

        products.map(whishList => {

            let item = whishList.products[0];

            let i =0;
            let rowBody = document.createElement("tr");

            rowBody.dataset.whishListId = whishList.id
            rowBody.dataset.productId = item.id;
            //rowBody.appendChild(tbody);
            tbody.appendChild(rowBody);

            let imgTd = document.createElement("td");
            rowBody.appendChild(imgTd);
            //productTd.setAttribute("collapse", 2);
            let prodImg = document.createElement('img');

            //let img = item.productImages[0] ? item.productImages[0].finalPath : null;
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

            removeItem.onclick = function() { removeProductFromWhishList(this) };

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

           /* let allSubTotals = document.querySelectorAll(".sub-total");

            allSubTotals.forEach(function(elem, pos) {
                console.log(elem);
                elem.addEventListener("change", function() {

                    let val;
                    allSubTotals.map(subTotal => {
                        val += subTotal.innerHTML;
                    });

                    totalSumItemsTd.innerHTML = val;

                });
            }); */

            /*

            let productContainer = document.createElement("div");

            productContainer.classList.add("product-container");

            productContainer.dataset.productId = item.id;

            productContainer.dataset.whishListId = product.id;

            let productImg = document.createElement('img');

            let produdDesc = document.createElement('p');

            productImg.src = product.prodFinalPath;

           let productTitle = document.createElement("h1");

           let productPrice = document.createElement("p");

           let productQt = document.createElement("p");

           productTitle.innerHTML = item.name;
            
            if(item.productImage){
                productImg.src = item.productImage.finalPath;
                }

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

              /*  if(item.stars.length > 0) {

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

            elemContainer.appendChild(productContainer); */

        });

        // Setting the value of the total items
        totalSumItemsTd.innerHTML = totalItemsAmount;

        //console.log(elemContainer);

        //modalWhishListBody.appendChild(elemContainer);

        $('#whishlistModal').modal('show');
    })

    $("#whishlistModal").on('hidden.bs.modal', e => {

        modalWhishListBody.innerHTML = "";
    });
});


function removeProductFromWhishList(elem) {

    //let product = elem.closest(".product-container");

    let item = elem.parentElement.parentElement;

     //"http://localhost:8001/whishlists/remove/";
     console.log(elem);
     console.log(item);

    if(!item) {
        alert("An error occured !");
        return;
    }

    let productId = item ? item.dataset.productId: null; //product.dataset.productId;

    let whishListId = item ? item.dataset.whishListId: null;  // product.dataset.whishListId;


    if(!productId || !whishListId) {
        alert("An error occured !");
        return;
    }

    let data = {
        productId: productId
    }

    let url = Routing.generate("whish_lists_delete", {id: whishListId});

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
            item.remove();

            nwishlist.innerHTML = data.numberWhishList;

            addWhishlist.style = "black";

            console.log("----------------------------------");
            console.log(productElem);
        }
    })

}