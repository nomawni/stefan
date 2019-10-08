
window.addEventListener("load", function(e) {

    let shareProduct = document.querySelectorAll(".share-product");

    shareProduct.forEach(function(item, pos) {

        item.addEventListener("click", e => {

            if(navigator.share === undefined) {
                console.log("Unsupported navigator share");
                return;
            }

            if(navigator.share) {

            let card = item.closest(".card");
            
            let productTitle = card.querySelector(".card-title").innerHTML;

            let productDescription = card.querySelector(".card-text").innerHTML;

            navigator.share({
                title: productTitle,
                text: productDescription,
                url: "http://localhost:8001/product/" + productTitle
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));

            console.log(productTitle);

            console.log(productDescription);
            }
        })
    })
})