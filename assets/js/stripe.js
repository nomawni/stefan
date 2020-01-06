/*import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../public/js/fos_js_routes.json';
import axios from 'axios';
// Create a Stripe client.

var stripe = Stripe('pk_test_AWqhFRx5lEWGMTLVffG7Hr960006ZvOxQB');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

var currentCard = '#card-element1';
var card = elements.create('card', {style: style});
card.mount('.card-element');

//var cardElements = document.querySelectorAll(".card-element");
//cardElements.forEach(function(cardElement, pos) {
var listCheckouts = document.querySelectorAll(".checkout");
listCheckouts.forEach(function(elem) {
  elem.addEventListener("click", function(e) {
  //++pos;
    let modalElement = elem.closest(".modal");
    let cardElement = modalElement.querySelector(".card-element");
    let cardId = cardElement.id;
    var unmountedCard = elements.getElement('card');
    card.unmount(currentCard);
    currentCard = `#${cardId}`;
    card.mount(currentCard);
    //console.log(elements.getElement('card'));
    //alert(elements.getElement('card'));
    // Create an instance of Elements.
    //var elements = stripe.elements();

    //var card = elements.create('card', {style: style});

// Create an instance of the card Element.

// Add an instance of the card Element into the `card-element` <div>.
//card.mount('#card-element');
 //card.mount('.card-element'+pos);
//});
//});

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  //var displayError = document.getElementById('card-errors');
  var displayError = cardElement.nextElementSibling; //querySelector('.card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
      });
   });
});

// Handle form submission.
//var form = document.getElementById('payment-form');
var forms = document.querySelectorAll(".payment-form");

forms.forEach(function(form) {
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token, form);
    }
  });
});
});

// Submit the form with the token ID.
function stripeTokenHandler(token, form) {
    Routing.setRoutingData(Routes);
  // Insert the token ID into the form so it gets submitted to the server
  //var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  let url = Routing.generate("transactions_new");

  let transactionSucceeded = form.nextElementSibling;

  // Submit the form
  //form.submit();

  let response = ajax(url, form);
  console.log(response);
  response.then(data => {
      console.log(data);
     
  })

}

function ajax(url, form) {

    let token = form.querySelector("input[name='stripeToken']");
    let fullName = form.querySelector("input[name='fullName']").value;
    let careOf = form.querySelector("input[name='careOf']").value;
    let street = form.querySelector("input[name='street']").value;
    let city = form.querySelector("input[name='city']").value;
    let postalCode = form.querySelector("input[name='postalCode']").value;
    let phoneNumber = form.querySelector("input[name='phoneNumber']").value;
    let instructions = form.querySelector("textarea[name='instructions']").value;
    let tokenValue = token.value;
    let orderType = form.querySelector("input[name='orderType']");
    let orderTypeVal = orderType.dataset.orderType;
    let orderTypeId = orderType.dataset.orderId;

    let itemInfos = getListItems(form, orderType);
    console.log(itemInfos);
    console.log("---------------------------------");
    
    let transactionSucceeded = form.nextElementSibling;

    let productDetail = form.closest("#productDetail");
    console.log(tokenValue);
    let content = {
        token: tokenValue,
        fullName: fullName,
        careOf: careOf,
        street: street,
        city: city,
        postalCode: postalCode,
        phoneNumber: phoneNumber,
        instructions: instructions,
        orderType: orderTypeVal,
        orderTypeId: orderTypeId,
        productInfo: itemInfos
    }
    let data = JSON.stringify(content);
    let response = fetch(url, {
        method: "POST",
        body:data
    })
    .then(response => { 
      if(response.status === 200) {

        form.style.display = "none";
        transactionSucceeded.style.display = "block";
      }

      if(response.status === 403) {
        form.style.display = "none";
       let errorText = `<h2> An error occured please try again ! </h2>`;
       transactionSucceeded.insertadjacenthtml('afterbegin', errorText);
      }
      console.log(response.json());
      return response.json();
    })
    .then(data => data)
    .catch(error => { 
      console.error(error);
       form.style.display = "none";
       let errorText = `<h2> An error occured please try again ! </h2>`;
       transactionSucceeded.insertadjacenthtml('afterbegin', errorText);
    });

    return response;
}

function getListItems (form, orderType) {

  let modalBody = form.closest(".modal-body");
  let listItemsHolder = new Object();
  let orderTypeVal = orderType.dataset.orderType;

  listItemsHolder.orderType = orderTypeVal;
  // If the modal body has a table we 
  if(modalBody.querySelector("table")) {

    let listItemsContainer = [];

    let modalBodyTable = modalBody.querySelector("table");
    let tableBody = modalBodyTable.querySelector("tbody");
    let modalBodyTableRows = tableBody.querySelectorAll("tr");
    let orderTypeId = modalBodyTable.dataset.cartId || modalBodyTable.dataset.whishListId;
    listItemsHolder.orderTypeId = orderTypeId;

    modalBodyTableRows.forEach(function(row, index) {
    
    let productId = row.dataset.productId;
    console.log(row);
    let quantity = row.querySelector("input[class='quantity']").value;

    let itemInfo = {
      productId: productId,
      quantity: quantity
    };

    listItemsContainer.push(itemInfo); // itemInfo;

  });

  listItemsHolder.itemInfo = listItemsContainer;

  return listItemsHolder;

  }

  let selectQt = modalBody.querySelector("input[name='selectQt']").value;
  let modalWrapper = modalBody.closest(".product-item");
  let productId = modalWrapper.dataset.productId;

  let itemInfo = {
    quantity: selectQt,
    productId: productId,
  };

  listItemsHolder.itemInfo = itemInfo;

  return listItemsHolder;
    
}

/**
 * Begining of the tabs handler
 */

//var currentTab = 0; // Current tab is set to be the first tab (0)
//showTab(currentTab); // Display the current tab

/*function showTab(n, elem) {
  alert("Michael Jackson");
  // This function will display the specified tab of the form...
  //var x = document.getElementsByClassName("tab");
  var x = elem.getElementsByClassName("tab");
  console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
  console.log(elem);
  console.log(x);
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    elem.getElementById("prevBtn").style.display = "none";
  } else {
    elem.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    elem.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    elem.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n, elem);
}

function nextPrev(n, elem) {
  alert("MICHAEL JORDAN");
  // This function will figure out which tab to display
  //var x = document.getElementsByClassName("tab");
  var x = elem.closest(".tab");
  var paymentForm = elem.closest(".payment-form");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm(paymentForm)) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm(elem) {
  alert("Michael Jackson");
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  //x = document.getElementsByClassName("tab");
  x = elem.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    elem.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n, elem) {
  // This function removes the "active" class of all steps...
  var i, x = elem.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
} */
