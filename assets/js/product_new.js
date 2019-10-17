import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

if(document.getElementById("productNew")) {
let productNew = document.getElementById("productNew");

productNew.addEventListener("click", e => {

    e.preventDefault();

    Routing.setRoutingData(Routes);

    $('#productNewModal').modal('show');

    let createProduct = document.querySelector(".create-product");

    let productImage = document.getElementById("productImage");

    /** The preview of the product images when the user select the images */

    let preview = document.querySelector(".preview");

        /**
         * set opacity of the productImage to  0
         */

         productImage.style.display = "none";

         /**
          * set an event listener to the input type file, to update the preview, because the input is not visible
          */
        productImage.addEventListener("change", updateImageDisplay);

    /** When the clicks on the save button , this event is emitted to get values of the form */ 

        createProduct.addEventListener("click", e => {

        /** The object that will contain the data from the form that we will send to create 
         * the new product
         */

         let product = new Object();

         let productImageFiles = productImage.files

        let newProductForm = document.getElementById("newProductForm");

        console.log(newProductForm);

        let newProductContainer = $("#newProductForm").serializeArray();

        console.log(newProductContainer);

       /* newProductContainer.map(elem => {
             console.log(`${elem.name} : ${elem.value}`);

            if(elem.name == "quantity" || elem.name == "size")
            product[elem.name] = parseInt(elem.value);
            else if (elem.name == "productImage")
            product["productImage"] = "";
            else
             product[elem.name] = elem.value;
        });

        console.log(productImage.files); */

        //delete product["undefined"];

        //product["productImageFiles"] = productImageFiles;

        let content = deserializeProduct(newProductContainer); //JSON.stringify(product);

        content = JSON.stringify(content);

        console.log(content);

        let productImg = productImageFiles[0];

        console.log(product);

        let formData = new FormData();

        formData.append("data", content);
        formData.append("productImage", productImg);
   // });

    let url = Routing.generate("product_new"); //"http://localhost:8001/product/new";

    let response = fetch(url, {
        "method" : "POST",
        "cache": "no-cache",
        "credentials": "same-origin",
        headers: {
            //"Content-Type": "application/json",
              "Accept": "application/json",
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data));

        return data;
    })
    .catch(error => console.error(error));

    response.then(data => {
        console.log(data);
        let productId = data;
        console.log(productId);

        let url = Routing.generate("product_show", {id: productId});

        let showResponse = ajax(url, "GET");

        showResponse.then(data => {
          console.log(data);
          serializeProduct(data);
        })

        //serializeProduct(data);
    });
           
});

function ajax(url, method) {

  let response = fetch(url, {
        method: method, 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers:{
          "Accept": "application/json"
        }
   })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
     .catch(error => console.error(error));

     return response;
}

function updateImageDisplay() {
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    var curFiles = productImage.files;
    if(curFiles.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      var list = document.createElement('ol');
      preview.appendChild(list);
      for(var i = 0; i < curFiles.length; i++) {
        var listItem = document.createElement('li');
        var para = document.createElement('p');
        if(validFileType(curFiles[i])) {
          para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
          var image = document.createElement('img');
          image.src = window.URL.createObjectURL(curFiles[i]);
  
          listItem.appendChild(image);
          listItem.appendChild(para);
  
        } else {
          para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
          listItem.appendChild(para);
        }
  
        list.appendChild(listItem);
      }
    }
  }

  var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
  ]
  
  function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
      if(file.type === fileTypes[i]) {
        return true;
      }
    }
  
    return false;
  }

  function returnFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  }
});
  
  function deserializeProduct(content) {
     
    if(!content)
      return;

      let data = new Object();
      let tags = new Object();
      let productImage = new Object();
      let category = new Object();
      let shop = new Object();

      let listElements = content;

      listElements.forEach(function(elem) {
        
         if(elem.name == "category") {
           category.name = elem.value;
         }else if(elem.name == "tags"){
           tags.name = elem.value;
         }else if(elem.name == "productImage"){
           productImage.productImage = elem.value;
         }else {
              if(elem.name == "quantity" || elem.name == "size") {
                data[elem.name] = parseInt(elem.value);
              }else {
                data[elem.name] = elem.value;
              }
         }
      });

        data.productImage = productImage;
        data.category = category;
        data.tags = tags;

        return data;

  }

 function serializeProduct(product) {

      if(!product)
          return;
      
      let productsWrapper = document.querySelector(".products-wrapper");
      let firstProductItem = document.querySelector(".product-item-wrapper");

      let productItem = firstProductItem.cloneNode(true);

      let card = productItem.querySelector(".card");

      console.log(productItem);
      console.log(card);

      card.dataset.author = product.client.id;

      console.log(card);

      let productContainer = productItem.querySelector(".product-item");

      productContainer.dataset.productId = product.id;

      productContainer.dataset.author = product.client.id;

      let img = productItem.querySelector("img");

      img.src = product.productImage ? product.productImage.finalPath  : "";

      let h4 = productItem.querySelector("h4");

      h4.innerHTML = product.category.name;

      let cardTitle = productItem.querySelector('.card-title');

      cardTitle.innerHTML = product.name;

      productsWrapper.appendChild(productItem);

      let cardText = productItem.querySelector(".card-text"); // The description of the product
      cardText.innerHTML = product.description;

      let ListStarProduct = productItem.querySelectorAll(".star-product");

      ListStarProduct.forEach(function(elem, pos) {

        elem.dataset.star = ++pos;
        
        let faStar = elem.querySelector(".fa-star");

        faStar.classList.replace("fas", "far");

        elem.removeAttribute("data-star-id");

      });

      let productPrice = productItem.querySelector(".product-price");
      productPrice.innerHTML = product.price;

      let addCart = productItem.querySelector(".add-cart");
      addCart.style.color = "black";
      addCart.removeAttribute("data-cart-id");

      let addWhishlist = productItem.querySelector(".add-whishlist");
      addWhishlist.style.color = "black";

      addWhishlist.removeAttribute("data-whishlist-id");
   
 }
}
