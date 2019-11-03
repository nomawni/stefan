import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
//window.addEventListener("load", function() {

   // let editProduct = document.querySelector(".edit-product");

    //editProduct.addEventListener("click", e => {
    $(document).on("click", '.edit-product', function() {

        Routing.setRoutingData(Routes);

        let productItemModal = document.querySelector('#productItemModal');

        let productItemModalBody = productItemModal.querySelector(".modal-body");

        let modalBodyBackup = productItemModalBody.cloneNode(true);

        /* The begining of the cloning of the product new Modal */

        let modalProductNewBody = document.getElementById("modalProductNewBody");

        let clonedProductNewBody = modalProductNewBody.cloneNode(true);

        /* End */

        /*let ModalTitel = */ productItemModal.querySelector('.modal-title').innerHTML = "Edit Product";

        let productId = productItemModal.dataset.productId;

        productId = parseInt(productId);

        if (!productId)
            return;

        let url = Routing.generate("product_edit", {id: productId}); //`http://localhost:8001/product/edit/${productId}`;

        console.log(url);

        let type = "get";

        let data = {
            type: type
        }

        console.log(url);

        let response = fetch(url, {
            method: "GET",
            "cache": "no-cache",
            "credentials": "same-origin",
            headers: {
                "Content-Type" : "application/json",
                "Accept": "application/json",
            },
            //body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));

            return data;
        })
        .catch(error => console.error(error));

        response.then(data => {

            //productItemModalBody.innerHTML = "";
            //alert("Inside then");

            //let modalProductNewBody = document.getElementById("modalProductNewBody");

            //let clonedProductNewBody = modalProductNewBody.cloneNode(true);

            let productNewModalTitle = productItemModal.querySelector("#productItemModalTitle");

            let modalFooter = productItemModal.querySelector('.modal-footer');

            productNewModalTitle.innerHTML = "Edit Product";

            let productName = clonedProductNewBody.querySelector("#productName");

            let productPrice = clonedProductNewBody.querySelector("#productPrice");

            let productQt = clonedProductNewBody.querySelector("#productQt");

            let productSize = clonedProductNewBody.querySelector("#productSize");

            let productDescription = clonedProductNewBody.querySelector("#productDescription");

            let productCategory = clonedProductNewBody.querySelector("#productCategory");

            let productTags = clonedProductNewBody.querySelector("#productTags");

            productName.value = data.name;

            productPrice.value = data.price;

            productQt.value = data.quantity;

            productSize.value = data.size;

            productDescription.innerHTML = data.description;

            //productCategory.value = data.category.name;

            serializeCategory(productCategory, data.category);

            var tagsString = "";

            data.tags.forEach(function(elem,pos) {

               // productTags.value += elem.name + ', ';

               tagsString += elem.name + ','
            });

            //productTags = productTags.substr(-1, 1);

            tagsString = tagsString.slice(0,-2);

            console.log(tagsString);

            productTags.value = tagsString;

            console.log(productName);

            //let newProductForm = clonedProductNewBody.querySelector("#newProductForm");

            //newProductForm.id = "editProductForm";

           // productItemModalBody.appendChild(clonedProductNewBody);

           productItemModalBody.replaceWith(clonedProductNewBody);

            let newProductForm = clonedProductNewBody.querySelector("#newProductForm");

            newProductForm.id = "editProductForm";

            let buttonFooter = modalFooter.querySelectorAll("button");

            let updateProductBtn = buttonFooter[1];

           updateProductBtn.innerHTML = "Update";

           //let productImage = productItemModalBody.querySelector("#productImage");

           updateProductBtn.onclick = function() { 

            /**
            * Update the product images
            */

           let productImage = document.querySelector("#productImage");//document.getElementById("productImage");

           /** The preview of the product images when the user select the images */

             // productImage = productImage ? productImage.files : null;

            //console.log(productImage);
               
            let editProductForm = $("#editProductForm").serializeArray();

            let dataContainer = deserializeProduct(editProductForm);

            console.log(dataContainer);
            console.log(editProductForm);

            let prodImageFile = productImage ? {productImage: productImage[0]} : null;

            editProductForm.push(prodImageFile);
            
            updateProductItem(editProductForm); 
        
             }

             alert("Hello world");
             console.log(modalFooter);
             console.log(clonedProductNewBody)
             let productItemFooter = productItemModal.querySelector(".modal-footer");
            //productItemModalBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);
            clonedProductNewBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);
            //productItemFooter.replaceWith(modalFooter);
            //productItemModalBody.replaceWith(clonedProductNewBody);

        });


          // let preview = modalProductNewBody.querySelector(".preview");

           productImage.style.display = "none";

           productImage.addEventListener("change", updateImageDisplay);

            /**
             * end of update
             */

        //$('.modal').modal('hide');

       // $('#productEditModal').modal('toggle');

       // $('.modal').modal('show');

       $("#productItemModal").on('hidden.bs.modal', function(e) {

        productItemModalBody.innerHTML = "";

        //let editButton = modalBodyBackup.querySelector(".edit-product");

        //editButton.onclick = function() { editProductItem(); }

        let footerToDelete = productItemModal.querySelector(".modal-footer");
        console.log(footerToDelete);
        footerToDelete ? footerToDelete.remove() : null;

        //productItemModalBody.appendChild(modalBodyBackup);
        clonedProductNewBody.replaceWith(modalBodyBackup);

       });

    //});

   function serializeCategory(productCategory, category) {

    //let productCategory = document.querySelector("#productCategory");

      let url = Routing.generate("category_all");

      let response = fetch(url, {
        method: "GET", 
        headers: {
          "Accept": "application/json"
        }
      }).then(response => response.json())
        .then(data => {
           console.log(JSON.stringify(data));
           return data;
        })
        .catch(error => console.error(error));

        response.then(res => {

          res.map(data => {
  
         //$("#productCategory").append("<option value=")
         
         let option = document.createElement("option");
         option.setAttribute("value", data.id);
         option.innerHTML = data.name;

         if(data.name == category.name) {
           option.selected = true;
         }
  
         productCategory.appendChild(option);
          });
  
        });
   }

    function editProductItem(elem) {


        let productItemModal = document.querySelector('#productItemModal');

        let productItemModalBody = productItemModal.querySelector(".modal-body");

        let modalBodyBackup = productItemModalBody.cloneNode(true);

        //let ModalTitel = productItemModal.querySelector('.modal-title').innerHTML = "Edit Product";

        let productId = productItemModal.dataset.productId;

        productId = parseInt(productId);

        if (!productId)
            return;

        /*console.log(productId);
        alert(productId); */

        let url = Routing.generate("product_edit", {id: productId}); //`http://localhost:8001/product/edit/${productId}`;

        let type = "get";

        let data = {
            type: type
        }

        console.log(url);

        let response = fetch(url, {
            method: "GET",
            "cache": "no-cache",
            "credentials": "same-origin",
            headers: {
                "Content-Type" : "application/json",
                "Accept": "application/json",
            },
            //body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));

            return data
        })
        .catch(error => console.error(error));

        response.then(data => {

            productItemModalBody.innerHTML = "";

            let modalProductNewBody = document.getElementById("modalProductNewBody");

            let clonedProductNewBody = modalProductNewBody.cloneNode(true);

            let productNewModalTitle = productItemModal.querySelector("#productItemModalTitle");

            let modalFooter = productItemModal.querySelector('.modal-footer');

            productNewModalTitle.innerHTML = "Edit Product";

            let productName = clonedProductNewBody.querySelector("#productName");

            let productPrice = clonedProductNewBody.querySelector("#productPrice");

            let productQt = clonedProductNewBody.querySelector("#productQt");

            let productSize = clonedProductNewBody.querySelector("#productSize");

            let productDescription = clonedProductNewBody.querySelector("#productDescription");

            let productCategory = clonedProductNewBody.querySelector("#productCategory");

            let productTags = clonedProductNewBody.querySelector("#productTags");

            productName.value = data.name;

            productPrice.value = data.price;

            productQt.value = data.quantity;

            productSize.value = data.size;

            productDescription.innerHTML = data.description;

            //productCategory.value = data.category.name;
            serializeCategory(productCategory, data.category);

            var tagsString = "";

            data.tags.forEach(function(elem,pos) {

               // productTags.value += elem.name + ', ';

               tagsString += elem.name + ', '
            });

            //productTags = productTags.substr(-1, 1);

            tagsString = tagsString.slice(0,-2);

            console.log(tagsString);

            productTags.value = tagsString;

            //console.log(productTags.replace(/_, $/,""));

            console.log(productName);

            let newProductForm = clonedProductNewBody.querySelector("#newProductForm");

            newProductForm.id = "editProductForm";

            console.log(clonedProductNewBody)

            //productItemModalBody.appendChild(clonedProductNewBody);

            productItemModalBody.replaceWith(clonedProductNewBody);

           let buttonFooter = modalFooter.querySelectorAll("button");

           let updateProductBtn = buttonFooter[1];

           updateProductBtn.innerHTML = "Update";

           /**
            * Update the product images
            */

           let productImage = modalProductNewBody.getElementById("productImage");

           productImage.addEventListener("change", updateImageDisplay);

           /** The preview of the product images when the user select the images */

            productImage = productImage.files ? productImage.files : null;

            console.log(productImage);

           updateProductBtn.onclick = function() {

            let editProductForm = $("#editProductForm").serializeArray();
            
            let dataContainer = deserializeProduct(editProductForm);

            console.log(dataContainer);
            console.log(editProductForm);

            //editProductForm["productImage"] = productImage[0] ? productImage[0] : null;

            //let prodImageFile = productImage ? {productImage: productImage[0]} : null;

            editProductForm.push(prodImageFile);
               
            updateProductItem(editProductForm); 
        
            }

           //productItemModalBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);
           clonedProductNewBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);

           console.log(buttonFooter[1]);

            console.log(productItemModalBody);

        });

        //$('.modal').modal('hide');

       // $('#productEditModal').modal('toggle');

       // $('.modal').modal('show');

       $("#productItemModal").on('hidden.bs.modal', function(e) {

        //productItemModalBody.innerHTML = "";

        console.log(modalBodyBackup);

        let editButton = modalBodyBackup.querySelector(".edit-product");

        editButton.onclick = function() { editProductItem(this); }

        //productItemModalBody.appendChild(modalBodyBackup);
        console.log("cccccccccccccccccccccccccccccccccccccccccccccccc");
        console.log(productItemModalBody);
        clonedProductNewBody.replaceWith(modalBodyBackup);
       });
    }

    function updateProductItem(prodToUpdate) {

        //alert("Hello world");

        console.log(prodToUpdate);

        //console.log(prodToUpdate[7].productImage);

        let prodObject = deserializeProduct(prodToUpdate); //new Object();


        //prodObject["productImage"] = prodToUpdate[7].productImage;

       /* prodToUpdate.map(data => {

            if(data.name == "quantity" || data.name == "size")
            prodObject[data.name] = parseInt(data.value);
            else if (data.name == "productImage")
            prodObject["productImage"] = "";
            else
            prodObject[data.name] = data.value;
        }); */

        //prodObject["productImage"] = prodToUpdate[7].productImage ? prodToUpdate[7].productImage: null;
        let editProductForm = document.getElementById("editProductForm");
        let productImage = editProductForm.querySelector("#productImage");

        console.log(productImage);
        //let prodImageFile = prodToUpdate[7].productImage ? prodToUpdate[7].productImage: null;
        let prodImageFile = productImage.files ? productImage.files[0] : null;

        console.log(prodImageFile)

        delete prodObject["undefined"];

        console.log(prodObject);

        //console.log(prodObject["undefined"]); 

        //let type = "edit";

        let data = {
            content: prodObject,
            //type: type
        }

        data = JSON.stringify(data);

        let formData = new FormData();

        formData.append("data", data);
        formData.append("productImage", prodImageFile);

        let response = fetch(url, {
            method: "POST",
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
        });

        $("#productItemModal").on('hidden.bs.modal', e => {

          productItemModalBody.innerHTML = "";
  
          console.log(modalBodyBackup);
  
          let editButton = modalBodyBackup.querySelector(".edit-product");
  
          editButton.onclick = function() { editProductItem(); }
  
          productItemModalBody.appendChild(modalBodyBackup);
         });
    }

    /**
     * Duplicated code
     * TODO: the original code is in product_new.js
     * but for new i just want it to work
     */

    function updateImageDisplay() {
         let editProductForm = document.getElementById("editProductForm");
      //let productImage = editProductForm.querySelector("#productImage");
         let productImage = editProductForm.querySelector("#productImage"); //modalProductNewBody.querySelector("#editProductForm"); //productItemModalBody.querySelector("#productImage");
         //productImage = productImage ? productImage : null;
         console.log(productImage);
         let preview = modalProductNewBody.querySelector(".preview");
        while(preview.firstChild) {
          preview.removeChild(preview.firstChild);
        }
      
        var curFiles = productImage.files ? productImage.files : null;
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

});