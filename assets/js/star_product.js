
let starProduct = document.querySelectorAll('.star-product');

let url = window.starNew;

starProduct.forEach(function(item, pros) {

    item.addEventListener('click', function(e) {
        
        let starValue = item.dataset.star ? item.dataset.star : null;

        let productItem = item.closest(".product-container");

        let productId = productItem.dataset.productId ? productItem.dataset.productId : null;

        let starId = item.dataset.starId ? item.dataset.starId : null;

        let data = {
            star: starValue,
            productId: productId,
            starId: starId
        }

        let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
          then(response => response.json())
         .then((data) => {

            return data;
             
         }).catch((err) => {
             console.error(err);
             
         });

         response.then(data => {

         });

        console.log(item);

        console.log(productItem);

        console.log(starValue);

        console.log(productId);
    })
});

/*
 * The function to call

function starProduct() {

let starProduct = document.querySelectorAll('.star-product');

let url = window.starNew;

starProduct.forEach(function(item, pros) {

    item.addEventListener('click', function(e) {
        
        let starValue = item.dataset.star ? item.dataset.star : null;

        let productItem = item.closest(".product-container");

        let productId = productItem.dataset.productId ? productItem.dataset.productId : null;

        let starId = item.dataset.starId ? item.dataset.starId : null;

        let data = {
            star: starValue,
            productId: productId,
            starId: starId
        }

        let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
          then(response => response.json())
         .then((data) => {

            return data;
             
         }).catch((err) => {
             console.error(err);
             
         });

         response.then(data => {

         });

        console.log(item);

        console.log(productItem);

        console.log(starValue);

        console.log(productId);
    })
}) 
} */