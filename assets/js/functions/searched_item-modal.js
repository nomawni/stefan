//const axios = require("axios");
import axios from 'axios';
import { async } from 'q';

export default class Search {

    constructor(searchedItems) {
      this.searchModal = document.querySelector("#searchModal");
      this.searchedItems = searchedItems;
      this.searchedValue = searchedItems.querySelector("input").value;
    }

    showModal() {
        console.log(this.searchModal);
        $("#searchModal").modal("show");
    }

    clearSearchInput() {
        let searchBox = document.getElementById("searchItem");
        let self = this;

        $("#searchModal").on("hide.bs.modal", function(e) {
            self.searchModal.querySelector(".modal-body").innerHTML = "";
            searchBox.innerHTML = "";
        })
    }

    serializeModal(listItems) {
        let modalBody = this.searchModal.querySelector(".modal-body");
        modalBody.innerHTML = "";
       
        listItems.map(item => {
            let prodImg = item.productImages.length > 0 ? item.productImages[0].finalPath : null;
            let ratings = `<ul class="nav rating">`;

            for(var i =1; i <= 5; i++) {
                if(item.stars.length > 0) {
                    item.stars.map(star => {
                       ratings +=`<li class="star-product" data-star-id="${star.id}" data-star="${i}">`;
                    
                    if(star.value >= i) {
                      ratings += `<i class="fas fa-star cursor-pointer"></i> `;
                    }else {
                        ratings += `<i class="far fa-star cursor-pointer"></i></li>`;
                    }
                    });
                }else {
                    ratings += `<i class="far fa-star cursor-pointer"></i></li>`;
                }
            }
            ratings += '</ul>';

           let doc = `<div class="display-searched-item productItem" data-product-id="${item.id}"> 
               <div class="prod-img"> <img src="${prodImg}" /> </div>
               <div class="prod-item-content"> 
               <p> ${item.name} </p>
               <p> By ${item.client.username} </p>
               <p> <span> € </span> ${item.price} </p> `;
            
           doc += ratings;

           doc +=    `</div> </div>`;
           modalBody.insertAdjacentHTML('afterbegin', doc);
        });
    }

   async  ajax (url, method)  {
       try {
        const response = await axios.get(url);
        return response;
       } catch(error) {
           console.error(error);
       }
    }

}