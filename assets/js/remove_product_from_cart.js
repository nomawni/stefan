
function removeProductFromCart(elem) {

    let product = elem.closest("product-container");

    let url = "http://localhost:8001/cart/remove/";

    let productId = product.dataset.productId;

    alert(productId);

    console.log(elem);

    if(!productId)
        return;

    url = url + productId;

}
