import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../public/js/fos_js_routes.json';
import Checkout from './functions/checkout_list.js';

let whishlists = document.querySelector("#whishlists");

whishlists.addEventListener('click', function(e) {

    //let whishlists = document.querySelector("#whishlistModal");

    let whishlistModal = document.getElementById("whishlistModal");

    Routing.setRoutingData(Routes);
    
    let url = Routing.generate("whishlists_show_all"); 

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

        let whishlistModalTitle = whishlistModal.querySelector("#whishlistModalTitle");

        let modalWhishListBody = document.getElementById('modalWhishListBody');

        /**
        * If the client does not have any item in his cart, we show him the modal indicating he has nothing
        */

       if(products === "undefined" || products.length == 0) {

       if(!modalWhishListBody.querySelector(".empty-wishlist-info")){
          let emptyCartInfo = `<h2 class="empty-wishlist-info"> Your Wishlist is empty for now! </h2>`;
          modalWhishListBody.insertAdjacentHTML('afterbegin', emptyCartInfo);
          $('#whishlistModal').modal('show');
         
        }
        return;
     }  
        // If the client has some products in his cart we want to remove the the h2 if it exist
        if(modalWhishListBody.querySelector(".empty-wishlist-info")){
            modalWhishListBody.querySelector(".empty-wishlist-info").remove();
        }

        let orderType = modalWhishListBody.querySelector("input[name='orderType']");
        orderType.dataset.orderId = products.id;

        if(!products) {
            modalWhishListBody.innerHTML = "Your whishList is empty";
            return;
        }

        whishlistModalTitle.innerHTML = "Your whishlist";

        let elemContainer = document.createElement("div");
        let productHeaderNames = ["Product","Quantity", "Price", "Size", "Delete", "TotalSub"];

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
       
        //modalWhishListBody.appendChild(table);
        modalWhishListBody.insertBefore(table, modalWhishListBody.childNodes[0]);
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

        products.map(whishList => {

            let item = whishList.products[0];
            let timeLap = whishList.dateAdded.timestamp;

            let dateAdded = new Date(timeLap * 1000);
            //dateAdded.setMilliseconds(timeLap);
            console.log(timeLap);
            console.log(whishList);
            console.log(`The date time ${dateAdded}`);
            console.log(`Original ${whishList.dateAdded.timestamp}`);

            let i =0;
            let rowBody = document.createElement("tr");

            rowBody.dataset.whishListId = whishList.id
            rowBody.dataset.productId = item.id;
            table.dataset.whishListId = whishList.id;
           
            tbody.appendChild(rowBody);

            let imgTd = document.createElement("td");
            rowBody.appendChild(imgTd);
    
            let prodImg = document.createElement('img');
            let name = item.name;

            prodImg.src = item.productImages[0] ? item.productImages[0].finalPath : null; 
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

            removeItem.onclick = function() { removeProductFromWhishList(this) };

            removeItem.classList.add("btn", "btn-primary");
            let deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fas", "fa-trash");
            
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

        let checkout = new Checkout(whishlistModal);

        $('#whishlistModal').modal('show');

        $('#whishlistModal').on('show.bs.modal', function (e) {
            //let productItemModalWrapper = productItemModal.querySelector('#productItemModalWrapper');
            whishlistModal.querySelector(".checkout").style.display = "inline";

        });
    });

    $("#whishlistModal").on('hidden.bs.modal', e => {

        //modalWhishListBody.innerHTML = "";
        let paymentForm = whishlistModal.querySelector("form");
        let listCartTable = whishlistModal.querySelector("table");
        let transactionSucceeded = modalWhishListBody.querySelector(".transaction-succeeded");
        listCartTable.remove();
       // paymentForm.querySelectorAll(".tab")[1].style.display = "none";
       transactionSucceeded ? transactionSucceeded.style.display = "none" :null;
        paymentForm ? paymentForm.style.display = "none" : null;
    });
});


function removeProductFromWhishList(elem) {

    let item = elem.closest("tr"); //elem.parentElement.parentElement;

    if(!item) {
        alert("An error occured !");
        return;
    }


    let productId = item ? item.dataset.productId: null; 

    let whishListId = item ? item.dataset.whishListId: null; 

    if(!productId || !whishListId) {
        alert("An error occured !");
        return;
    }

    let data = {
        productId: productId
    }

    let url = Routing.generate("whish_lists_delete", {id: whishListId});

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

            //let tbody = item.closest("tbody");
            let results = totalPriceItems(item);

            item.remove();

            //let itemsTable = tbody.closest("table");

            //let totalSumItems = itemsTable.querySelector(".total-sum-items");

            //totalSumItems.innerHTML = results;
            
            nwishlist.innerHTML = data.numberWhishList;

            addWhishlist.style = "black";
        }
    })

}

function totalPriceItems(elem) {

    let subTotal = elem.querySelector(".sub-total");

    let subTotalVal = parseFloat(subTotal.innerHTML);

    let table = elem.closest("table");

    let totalSumItems  = table.querySelector(".total-sum-items");

    let totalSumItemsVal = parseFloat(totalSumItems.innerHTML);

    let newTotalSumItems = totalSumItemsVal - subTotalVal;

    totalSumItems.innerHTML = parseFloat(newTotalSumItems).toFixed(2);

    return newTotalSumItems;
}