import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

 import Search from './functions/searched_item-modal.js';

 Routing.setRoutingData(Routes);

/*let searchItem = document.getElementById("searchItem");

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
        });

    });
   }else {
       result.innerHTML = "";
   }

}); */

$(document).on("click", ".searched-result-item", function(e) {

  //alert(e.target);
  let content = null;
  let elem = e.target;
  let itemValue = elem.querySelector("input").value;
  let search = new Search(elem);
  let url = Routing.generate("list_searched_item", {"name": itemValue});
  let response = search.ajax(url, "GET");
  
  console.log(response);
  let data = response
             .then(function(response) {
               console.log(response);
               search.serializeModal(response.data);
               return response.data;
             });

  search.showModal();
  // When the user closes the search modal we want to clear the search input
  search.clearSearchInput();
  console.log(elem);
  console.log(data);
  
});

function ajax(url, data) {
    
    let content = {
        value: data
    };
    let results;
    let response = fetch(url, {
        method: "POST", 
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
    })
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data));
        return data;
    })
    .catch(error => console.error(error));

    /*response.then(products => {

        results = products;
    }); */

    return response;

}

function searchAutoComplete(/*searchBox, data */) {

   // Routing.setRoutingData(Routes);

    let url = Routing.generate("search_item");

    let searchBox = document.getElementById("searchItem");

    let currentFocus;

    searchBox.addEventListener("input", function(e) {

        var itemsContainer, matchedSearch, i, val = this.value;

         /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      itemsContainer = document.createElement("div");
      itemsContainer.setAttribute("id", this.id + "autocomplete-list");
      itemsContainer.setAttribute("class", "result-searched-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(itemsContainer);
        
      let response = ajax(url, val);

      console.log(response);

      /*for each item in the array...*/
      response.then(data => {

      if(data) {
      for (i = 0; i < data.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        //if (data[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          matchedSearch = document.createElement("div");
          matchedSearch.classList.add("searched-result-item");
          /*make the matching letters bold:*/
          matchedSearch.innerHTML = "<strong>" + data[i].name.substr(0, val.length) + "</strong>";
          matchedSearch.innerHTML += data[i].name.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          matchedSearch.innerHTML += "<input type='hidden' value='" + data[i].name + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          matchedSearch.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              searchBox.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
              console.log(matchedSearch);
              console.log(itemsContainer);
          });
          itemsContainer.appendChild(matchedSearch);
       // }
      }
    }else {
      
    }
   });

 });

    /*execute a function presses a key on the keyboard:*/
    searchBox.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("result-searched-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != searchBox) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

searchAutoComplete();