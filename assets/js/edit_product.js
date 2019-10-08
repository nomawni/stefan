
window.addEventListener("load", function() {

    let editProduct = document.querySelector(".edit-product");

    editProduct.addEventListener("click", e => {

        let url = "";

        $('.modal').modal('hide');

        $('#productEditModal').modal('toggle');

       // $('.modal').modal('show');
    })

})