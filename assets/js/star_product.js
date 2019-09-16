
let starProduct = document.querySelectorAll('.star-product');

let url = window.starNew;

starProduct.forEach(function(item, pros) {

    item.addEventListener('click', function(e) {
        
        let starValue = item.dataset.star;

        let productItem = item.closest(".card");

        let productId = productItem.dataset.productId;

        let data = {
            star: starValue,
            productId: productId
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