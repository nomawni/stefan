import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

import Checkout from './functions/checkout_list.js';

let listCart = document.getElementById("listCart");

//let url = window.cartAll;

let rememberResponse = null;

listCart.addEventListener('click', function(e) {

    Routing.setRoutingData(Routes);

    let url = Routing.generate("cart_show_all");

    let listCartsModal = document.querySelector("#listCartsModal");

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

        response.then(products =>  {

        let modalTitle = document.getElementById("listCartsModalTitle");

        modalTitle.innerHTML = "Your cart";

       let modalCartBody = document.getElementById('modalCartBody');

      /* ***** New table Items *****/

       let productHeaderNames = ["Product","Quantity", "Price", "Size", "Delete", "TotalSub"];

        //elemContainer.classList.add("product-container");
        let table = document.createElement("table");
        table.classList.add("item-to-buy");
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
       
        //modalCartBody.appendChild(table);
        modalCartBody.insertBefore(table, modalCartBody.childNodes[0]);
        
        let tbody = document.createElement("tbody");
        table.appendChild(tbody);
        let tfooter = document.createElement("tfoot");
        table.appendChild(tfooter);
       // the footer part          
          let footerTh =  document.createElement("th");
          footerTh.setAttribute("scope", "row");
          footerTh.setAttribute("colspan", "6");
          footerTh.innerHTML = "Totals";
          tfooter.appendChild(footerTh);
          let totalSumItemsTd = document.createElement("td");
          totalSumItemsTd.classList.add("total-sum-items");
          tfooter.appendChild(totalSumItemsTd);
          let totalItemsAmount = 0;

         /* **** End of the table Items *****/

         products.map(cart => {

            let item = cart.products[0];

            let i =0;
            let rowBody = document.createElement("tr");

            rowBody.dataset.cartId = cart.id;
            rowBody.dataset.productId = item.id;

            tbody.appendChild(rowBody);

            let imgTd = document.createElement("td");
            rowBody.appendChild(imgTd);
           
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
              
                let itemPriceTotal = this.parentElement.parentElement.querySelector(".price");
                
                let totalItemPrice = this.value * itemPriceTotal.innerHTML;
                totalItemPrice = parseFloat(totalItemPrice).toFixed(2);
                itemSubTotal.innerHTML = totalItemPrice; 
                let allSubTotals = document.querySelectorAll(".sub-total");
                let val =0;
                    allSubTotals.forEach(function(subTotal, pos)  {
                        val += parseFloat(subTotal.innerHTML);
                    });
                    totalSumItemsTd.innerHTML = parseFloat(val).toFixed(2);
            });

            let subTotal = price * qtInput.value;

            subTotalTd.classList.add("sub-total");
            subTotalTd.innerHTML = subTotal;

            totalItemsAmount += subTotal;

    });

        // Setting the value of the total items
        totalSumItemsTd.innerHTML = parseFloat(totalItemsAmount).toFixed(2);

        /* Handling checkout button */
        
        //let checkoutBtn = listCartsModal.querySelector(".checkout");

        let checkout = new Checkout(listCartsModal);

        //checkout.handleCheckout();

        /* End of handling checkout button */

        $('#listCartsModal').modal('show');

        $('#listCartsModal').on('show.bs.modal', function (e) {
            //let productItemModalWrapper = productItemModal.querySelector('#productItemModalWrapper');
            listCartsModal.querySelector(".checkout").style.display = "inline";

        });
    });

    $("#listCartsModal").on('hidden.bs.modal', e => {

        //modalCartBody.innerHTML = "";
        let paymentForm = listCartsModal.querySelector("form");
        let listCartTable = listCartsModal.querySelector("table");
        listCartTable.remove();
        paymentForm.querySelectorAll(".tab")[1].style.display = "none";
        paymentForm.style.display = "none";
    });
    
});


function removeProductFromCart(elem) {

    let item = elem.closest("tr"); //elem.parentElement.parentElement;

    //let url = Routing.generate("cart_delete"); //"http://localhost:8001/cart/remove/";

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
            
            let totalSumItem = totalItemPrice(item);

            item.remove();

            nCart.innerHTML = data.numberCart;

            addCart.style = "black";
        }
    })

}

function totalItemPrice(elem) {

    let subTotal = elem.querySelector(".sub-total");

    let subTotalVal = parseFloat(subTotal.innerHTML);

    let table = elem.closest("table");

    let totalSumItems  = table.querySelector(".total-sum-items");

    let totalSumItemsVal = parseFloat(totalSumItems.innerHTML);

    let newTotalSumItems = totalSumItemsVal - subTotalVal;

    totalSumItems.innerHTML = parseFloat(newTotalSumItems).toFixed(2);

    return newTotalSumItems;
}