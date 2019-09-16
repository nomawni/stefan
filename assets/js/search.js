let searchItem = document.getElementById("searchItem");

let searchResults  = document.getElementById("searchResults");

let url = window.searchItem;

searchItem.addEventListener('keyup', function(e) {
    
   let searchedValue = e.target.value;

   console.log(searchedValue);

   if(searchedValue === " ") 
       return false;

    let data = {
        value: searchedValue
    };

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

            let ulElement = document.createElement('ul');

            let liElement = document.createElement('li');

            let link = document.createElement('a');

            link.className = "searched-link";

            link.dataset.searchedLink = product.id;

            link.innerHTML = product.name;

            liElement.appendChild(link);

            ulElement.appendChild(liElement);

           // searchResults.innerHTML += product.name;

           searchResults.appendChild(ulElement);

        });

    });

});