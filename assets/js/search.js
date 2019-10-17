import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

let searchItem = document.getElementById("searchItem");

let searchResults  = document.getElementById("searchResults");

//let url = window.searchItem;

searchItem.addEventListener('keyup', function(e) {

    Routing.setRoutingData(Routes);

    let url = Routing.generate("search_item");
  
   //let result = document.querySelector("#result");
    
   let searchedValue = e.target.value;
   var expression = new RegExp(searchedValue, "i");

   console.log(searchedValue);

    let data = {
        value: searchedValue
    };

    if(searchedValue) {

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
        console.log(JSON.stringify(data));
        return data;
    })
    .catch(error => console.error(error));

    response.then(products => {
         
        products.map(product => {

            $("#result").append('<li class="list-group-item productItem" data-product-id="'+ product.id +'">' + product.name +' <span class="text-muted"> </span>');

            //let ulElement = document.createElement('ul');

            //let liElement = document.createElement('li');

            //let link = document.createElement('a');

            //link.className = "searched-link";

            //link.dataset.searchedLink = product.id;

            //link.innerHTML = product.name;

            //liElement.appendChild(link);

            //ulElement.appendChild(liElement);

           // searchResults.innerHTML += product.name;

           //searchResults.appendChild(ulElement);

        });

    });
   }else {
       result.innerHTML = "";
   }

});