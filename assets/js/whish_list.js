let url = window.wishlistNew;

var listAddCart = document.querySelectorAll('.add-whishlist');

listAddCart.forEach(function(item, pos) {

    item.addEventListener('click', function(e) {

    // let productItem = document.querySelectorAll('.productItem')[pos];

    let productItem = item.closest(".card");

     let productId = productItem.dataset.productId;

     productId = parseInt(productId);

     console.log(productId);

     let responseData;
        
       let data = {
           Id: productId
       }

       let response = fetch(url, {
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
           // console.log(JSON.stringify(data));

            return data;
        })
        .catch(error => console.error(error));
    
        console.log(response);

        response.then(data => {

            let productCart = document.querySelector(".nwishlist"); // nwishlist

            productCart.innerHTML = data["numberWhishlists"];

            item.style.color = "green";
        });

});
   
});