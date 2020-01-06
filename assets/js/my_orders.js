import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../public/js/fos_js_routes.json';
import Orders from './orders/orders.js';

$(document).on("click", ".myOrders", function(){
    
    Routing.setRoutingData(Routes);

    let ordersModal = document.getElementById("ordersModal");
    let listTransactionsUrl = Routing.generate("list_transactions");
    let orders = new Orders(ordersModal);

    let listTransactions = Orders.getListTransactions(listTransactionsUrl);

    listTransactions.then(response => {

        console.log(response);
        if(response.status === 200) {

            let data = response.data;

            orders.serializeOrders(data);
        }

        if(response.status === 403) {
           let message = response.data.message;
           orders.error403(message);
        }
    })
    .catch(error => {
       console.log(error);
       orders.unknownError();
    });

    $("#ordersModal").modal("show");
})
