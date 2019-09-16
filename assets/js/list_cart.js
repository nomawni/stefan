
let listCart = document.getElementById("listCart");

let url = window.cartAll;

let rememberResponse = null;

listCart.addEventListener('click', function(e) {

    let response = fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
    })
    .then(response => response.json())
    .then(data => {
   //  console.log(JSON.stringify(data))
      return data
    })
    .catch(error => console.error(error)
    );

    console.log("************************************************");
    console.log(response);
    console.log("--------------------------------------------------");

    response.then(products =>  {
        let modalTitle = document.getElementById("exampleModalLongTitle");

        let modalCartBody = document.getElementById('modalCartBody');

        modalTitle.innerHTML = "Your cart";
        products.map(product => {

            let productImg = document.createElement('img');

            let produdDesc = document.createElement('p');

            productImg.src = product.prodFinalPath;

            produdDesc.innerHTML = product.prodDesc;

            modalCartBody.appendChild(productImg);

            modalCartBody.appendChild(produdDesc);

        });

        $('#exampleModalCenter').modal('show');
    });

   
    
});