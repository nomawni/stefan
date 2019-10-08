let url = window.wishlistNew;

var listAddCart = document.querySelectorAll('.add-whishlist');

listAddCart.forEach(function(item, pos) {

    item.addEventListener('click', function(e) {

    // let productItem = document.querySelectorAll('.productItem')[pos];

    let whishlistId = item.dataset.whishlistId ? item.dataset.whishlistId : null;

    let productItem = item.closest(".card");

     let productId = productItem.dataset.productId;

     productId = parseInt(productId);

     whishlistId = parseInt(whishlistId);

     console.log(productId);

     let responseData;
        
       let data = {
           Id: productId,
           WhishlistId: whishlistId
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

            if(data["type"] == "added") {
                item.style.color = "green";
                item.dataset.whishlistId = data["Id"] ? data["Id"] : null;

            }else if (data["type"] == "removed") {
                item.style.color = "black";
                item.dataset.whishlistId = null;


            }else {
                return;
            }

            
        });

});
   
});