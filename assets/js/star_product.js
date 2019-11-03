import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';

//let starProduct = document.querySelectorAll('.star-product');

//let url = star_new // window.starNew;

//starProduct.forEach(function(item, pros) {

    //item.addEventListener('click', function(e) {
    $(document).on("click", '.star-product', function(e) {

        let itemFasStar = e.target;

        let item = itemFasStar.closest(".star-product");

        console.log(item);

        Routing.setRoutingData(Routes);

        let url = Routing.generate("star_new");
        
        let starValue = item.dataset.star;

        if(!starValue) {
            alert("the value of the star can not be null");
            return;
        }

        let productItem = item.closest(".product-container");

        let listStars = productItem.querySelectorAll('.fa-star');

        let productId = productItem.dataset.productId;

        if(!productId) {
            alert(" the Id of product can not be null");
        }

        let starId = item.dataset.starId ? item.dataset.starId : null;

        let data = {
            star: starValue,
            productId: productId,
            starId: starId
        }

        let status = null;

        let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
          .then(response => {
            status = response.status;
            return response.json()
          })
         .then((data) => {

            return data;
             
         }).catch((err) => {

             if(error.response.status === 403){
                 alert("You are not connected")
             }else {
                 alert("An error occured");
             }
             console.error(err);
             
         });

         response.then(data => {

            let starValue = data.value;

            console.log(listStars);

            if(status === 403) {
                alert("You are not connected");
                return;
            }else if(status === 201 || status === 200) {

            

            listStars.forEach(function(star, pos) {
                console.log(star);
                console.log(pos);
                pos = pos +1;

                if(starValue  >= pos) {
                  star.classList.replace("far", "fas");
                }else {
                    star.classList.replace("fas", "far");
                }
            });
        }else {
            alert("An error occured ");
            return;
        }
                
            });

         //   }else if(status === 200) {

        

        console.log(item);

        console.log(productItem);

        console.log(starValue);

        console.log(productId);
    });
//});

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