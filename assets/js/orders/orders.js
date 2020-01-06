import axios from 'axios';
import TimeComponents from '../times/time_components.js';

export default class Orders {
    constructor(modal) {
       this.modal = modal;
       this.modalBody = modal.querySelector(".modal-body");
    }



   static async getListTransactions(url) {

        if(!url || typeof url !== "string" ) {
            return false;
        }
        let response = await axios.get(url);

        console.log(response);

        return response;
    }

    serializeOrders(transactions) {

        let orderTable = document.createElement("table");

        let tableHeader = `<thead> <tr> 
         <th> Transaction ID </h> <th> Delivered </th> <th> Nr Product </th> 
         <th> Amount </th> <th> Date </th> </tr> </thead>`;

        orderTable.insertAdjacentHTML('afterbegin', tableHeader);

        Object.keys(transactions).forEach(function(key) {
            let transaction = JSON.parse(transactions[key]);
            let address = transaction.customer.address[0];
            let dateTime = TimeComponents.extractTime(transaction.createdAt.timestamp);
            console.log(transaction);
            let tableContent = `<tr>
               <td> ${ transaction.stripeCustomerId } </td>
               <td> ${ address.street}  ${address.postalCode }</td>
               <td> ${ transaction.products.length} </td>
               <td> ${ transaction.amount } </td>
               <td> ${ dateTime } </td>
             </tr>`;

             orderTable.insertAdjacentHTML('beforeend', tableContent);
        });

        let modalBody = this.modal.querySelector(".modal-body");

        modalBody.appendChild(orderTable);

        return orderTable;
        
    }

     error403(message) {
       
       let errorText =  `<div class="alert alert-danger">
                        <p class="error"> ${message} </p>
                        </div>`;
       this.modalBody.innerHTML = "";
       this.modalBody.insertAdjacentHTML('afterbegin', errorText);

    }

    unknownError() {
         let errorText = `<div class="alert alert-danger">
                         <p class="error"> An unknown error occured ! Please try later again </p> 
                        </div>`; 
         this.modalBody.innerHTML = "";
         this.modalBody.insertAdjacentHTML('afterbegin', errorText);
    }
}