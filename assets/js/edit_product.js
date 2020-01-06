import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';
 import axios from 'axios';
//window.addEventListener("load", function() {

   // let editProduct = document.querySelector(".edit-product");

    //editProduct.addEventListener("click", e => {
  window.addEventListener("load", function (e) {
    
    $(document).on("click", '.edit-product', function() {

        Routing.setRoutingData(Routes);

        let productItemModal = document.querySelector('#productItemModal');
        let productItemModalBody = productItemModal.querySelector(".modal-body");
        let productItemWrapper = productItemModalBody.querySelector("#productItemWrapper");

        //let modalBodyBackup = productItemModalBody.cloneNode(true);

        let productItemModalWrapper = productItemModalBody.querySelector("#productItemModalWrapper");
        let productItemBackup = productItemModalWrapper.cloneNode(true);

        /* The begining of the cloning of the product new Modal */

        //let modalProductNewBody =  //document.getElementById("modalProductNewBody");
        let createEditTemplate = document.querySelector("#createEditProductTTemplate");
        let clonedProductNewBody = document.importNode(createEditTemplate.content, true);//createEditTemplate.cloneNode(true);

        /* End */

        /*let ModalTitel = */ 
        productItemModal.querySelector('.modal-title').innerHTML = "Edit Product";
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
            
            console.log(data);
            let productNewModalTitle = productItemModal.querySelector("#productItemModalTitle");
            //let modalProductNewBody = productItemModal.querySelector("#modalProductNewBody");
            let modalFooter = productItemModal.querySelector('.modal-footer');
            productNewModalTitle.innerHTML = "Edit Product";

            let productName = clonedProductNewBody.querySelector("#productName");
            let productPrice = clonedProductNewBody.querySelector("#productPrice");

            let productQt = clonedProductNewBody.querySelector("#productQt");
            let productSize = clonedProductNewBody.querySelector("#productSize");

            let productDescription = clonedProductNewBody.querySelector("#productDescription");
            let productCategory = clonedProductNewBody.querySelector("#productCategory");

            let productTags = clonedProductNewBody.querySelector("#productTags");

            console.log(createEditTemplate);

            productName.value = data.name;

            productPrice.value = data.price;

            productQt.value = data.quantity;

            productSize.value = data.size;

            productDescription.innerHTML = data.description;

            //productCategory.value = data.category.name;

            serializeCategory(productCategory, data.category);
            
           /* var tagsString = "";

            data.tags.forEach(function(elem,pos) {
               tagsString += elem.name + ','

            });

            tagsString = tagsString.slice(0,-2);

            productTags.value = tagsString; */

           //productItemModalBody.style.display = "none";
            productItemWrapper.style.display = "none";

           //productItemModalBody.parentNode.insertBefore(clonedProductNewBody, productItemModalBody.nextSibling);
            
           productItemModalBody.appendChild(clonedProductNewBody);

           // We serialize the list of all the tags
           serializeTags(data.tags);

            let newProductForm = clonedProductNewBody.querySelector("#newProductForm");

            //newProductForm.id = "editProductForm";
            clonedProductNewBody.id = "editProductForm";

            let buttonFooter = modalFooter.querySelectorAll("button");

            let updateProductBtn = buttonFooter[1];

           updateProductBtn.innerHTML = "Update";
           updateProductBtn.style.display = "inline";

           let productImage = productItemModalBody.querySelector("#productImage");//clonedProductNewBody.querySelector("#productImage");
           //let productImage = clonedProductNewBody.querySelector("#productImage");

           updateProductBtn.onclick = function(e) { 

            let editModal = e.currentTarget.parentNode.parentNode.querySelector("#newProductForm");
            let productImageTag = editModal.querySelector("#productImage");
            let productImages = productImageTag.files;
               
            let editProductForm = $("#editProductForm").serializeArray();

            let dataContainer = deserializeProduct(editProductForm);

            console.log(dataContainer);
            console.log(editProductForm);

            let prodImageFile = productImages ? productImages : null;

            editProductForm.push(prodImageFile);
            
            updateProductItem(editProductForm); 
        
             }

            /**
            * Update the product images
            */

           //document.getElementById("productImage");
           //productImage.style.display = "none";
           //productImage.addEventListener("change", updateImageDisplay);
           productImage.onchange = function(e) { 
             alert(e.currentTarget);
            updateImageDisplay(productImage)};
            //productImage.style.display = "none";

           /** The preview of the product images when the user select the images */

             // Serialize the list of all images 
             //let imgPreview = clonedProductNewBody.querySelector(".preview");
             let imgPreview = productItemModalBody.querySelector(".preview");
             serializeImages(imgPreview, data.productImages);
             //let productItemWrapper = productItemModalBody.querySelector("#productItemWrapper");
            // clonedProductNewBody.parentNode.parentNode.insertBefore(modalFooter, clonedProductNewBody.nextSibling);
            productItemModalBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);

        });

          // let preview = modalProductNewBody.querySelector(".preview");

           //productImage.style.display = "none";
           //productImage.onchange = function() { updateImageDisplay(productImage)};
           //productImage.addEventListener("change", updateImageDisplay);

            /**
             * end of update
             */

       $("#productItemModal").on('hidden.bs.modal', function(e) {

        let footerToDisable = productItemModal.querySelector(".modal-footer");
        console.log(footerToDisable);
        footerToDisable.querySelectorAll("button")[1].style.display = "none";
        
        // We remove the message holder for the edit response if it exists
        if(productItemModalBody.querySelector(".response-message-holder")) {
          productItemModalBody.querySelector(".response-message-holder").remove();
        }

        if(productItemModalBody.querySelector("#newProductForm")) {
        productItemModalBody.querySelector("#newProductForm").remove();
        }
        //productItemModalBody.style.display = "block";
         productItemWrapper.style.display = "block";

       });

    //});

   /* function serializeTags(tagsContainer, listTags) {

       let tagsInputBootstrap = '<div class="bootstrap-tagsinput">';
       listTags.map(tag => {
           tagSpanWrapper = `<span class="tag label label-info"> ${tag.name} `;
           tagSpan = `<span data-role="remove"> </span>`;

           tagSpanWrapper += `</span>`;
       });

       tagsInputBootstrap += '</div>';
    } */

    function serializeImages(container, listImages) {

       listImages.map(img => {
         let imgItem = `<div class="prod-img" data-img-id="${img.id}">
                   <img src="${img.finalPath}" alt="${img.originalName}" />
                   <button class="button primary remove-img"> Delete </button>
           "`;
           container.insertAdjacentHTML("afterbegin", imgItem);
       });
       return container;
    }

    $(document).on("click", ".remove-img", function(e) {
      e.preventDefault();
       let elemParent = this.parentNode;
       let imageId = elemParent.dataset.imgId;
       alert(imageId);
       let url = Routing.generate("product_image_delete", {id: imageId});

       let response = axios({
         method: "DELETE", 
         url: url,
         responseType: "json"
       })
       .then(function(response) {
           if(response.status === 200) {
             console.log(response);
             elemParent.remove();
           }
       });
    });

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

   function serializeTags(listTags) {
      if(!listTags) return;
      let newProductForm = productItemModalBody.querySelector("#newProductForm");
      let productTagsInput = productItemModalBody.querySelector("#productTags").parentNode;
      let listTagsHolder = document.createElement("div");
      listTagsHolder.classList.add("list-tags-holder");

      productTagsInput.parentNode.insertBefore(listTagsHolder, productTagsInput);

      listTags.forEach(function(tag, index) {

        let tagHolder = `<div class="input-group">
                            <span class="delete-tag"> ${tag.name} </span>
                            <div class="input-group-append">
                            <span class="badge badge-secondary"> x </span>
                            </div>
                          </div>`;
           listTagsHolder.insertAdjacentHTML("beforeend", tagHolder);
          let deleteTag = listTagsHolder.querySelector(".delete-tag:last-child");
          deleteTag.addEventListener("click", function(e){ removeTag(e); });
      });
   }

   function removeTag(e) {
       e.preventDefault();
       alert("Hello...");
   }

    function editProductItem(elem) {


        let productItemModal = document.querySelector('#productItemModal');

        let productItemModalBody = productItemModal.querySelector(".modal-body");
        let productItemWrapper = productItemModalBody.querySelector("#productItemWrapper");

        //let modalBodyBackup = productItemModalBody.cloneNode(true);

        let productItemModalWrapper = productItemModalBody.querySelector("#productItemModalWrapper");
        let productItemBackup = productItemModalWrapper.cloneNode(true);

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
           productItemModalBody.parentNode.insertBefore(productItemModalBody, productItemModalBody.nextSibling);
           //productItemModalBody.style.display = "none";
           let buttonFooter = modalFooter.querySelectorAll("button");

           let updateProductBtn = buttonFooter[1];

           updateProductBtn.innerHTML = "Update";

           updateProductBtn.style.display = "inline";

           /**
            * Update the product images
            */

           let productImage = modalProductNewBody.getElementById("productImage");

           //productImage.addEventListener("change", updateImageDisplay);
           productImage.onchange = function() {updateImageDisplay(productImage)};

           /** The preview of the product images when the user select the images */

            productImage = productImage.files ? productImage.files : null;

            console.log(productImage);

           updateProductBtn.onclick = function() {

            let editProductForm = $("#editProductForm").serializeArray();
            
            let dataContainer = deserializeProduct(editProductForm);

            console.log(dataContainer);
            console.log(editProductForm);

            editProductForm.push(prodImageFile);
               
            updateProductItem(editProductForm); 
        
            }
           clonedProductNewBody.parentNode.insertBefore(modalFooter, productItemModalBody.nextSibling);

           console.log(buttonFooter[1]);

            console.log(productItemModalBody);

        });

       $("#productItemModal").on('hidden.bs.modal', function(e) {
        let editButton = productItemBackup.querySelector(".edit-product");

        let footerToDisable = productItemModal.querySelector(".modal-footer");
        console.log(footerToDisable);
        footerToDisable.querySelectorAll("button")[1].style.display = "none";

        editButton.onclick = function() { editProductItem(this); }

        clonedProductNewBody.remove();
       });
    }

    function updateProductItem(prodToUpdate) {

        console.log(prodToUpdate);
        //console.log(prodToUpdate[7].productImage);
        let prodObject = deserializeProduct(prodToUpdate); //new Object();
        
        let editProductForm = productItemModalBody.querySelector("#newProductForm");
        let productImage = editProductForm.querySelector("#productImage");

        console.log(productImage);
        //let prodImageFile = prodToUpdate[7].productImage ? prodToUpdate[7].productImage: null;
        let prodImageFile = productImage.files ? productImage.files[0] : null;

        console.log(prodImageFile)
        delete prodObject["undefined"];
        console.log(prodObject);

        let responseStatus = null;

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
        .then(response => { 
          responseStatus = response.status;
          return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data));

            return data;
        })
        .catch(error => console.error(error));

        response.then(data => {

            if(responseStatus === 200) {
              serializeProduct(data);
              // This function remoes the form and display a successfull message
            }
            successMessageHolder(responseStatus, data);
            /*else if (responseStatus === 403) {

            }else {

            } */
        });

        $("#productItemModal").on('hidden.bs.modal', e => {

          productItemModalBody.innerHTML = "";
  
         // console.log(modalBodyBackup);
  
          //let editButton = modalBodyBackup.querySelector(".edit-product");
          let editButton = productItemBackup.querySelector(".edit-product");
  
          editButton.onclick = function() { editProductItem(); }
          //productItemBackup
         // productItemModalBody.appendChild(modalBodyBackup);
          productItemModalBody.appendChild(productItemBackup);
         });
    }

    /**
     * Duplicated code
     * TODO: the original code is in product_new.js
     * but for new i just want it to work
     */

    function updateImageDisplay(productImage) {
         alert("Update preview image");
         let editProductForm = document.getElementById("#newProductForm");
      //let productImage = editProductForm.querySelector("#productImage");
         //let productImage = editProductForm.querySelector("#productImage"); //modalProductNewBody.querySelector("#editProductForm"); //productItemModalBody.querySelector("#productImage");
         //productImage = productImage ? productImage : null;
         let preview = editProductForm.querySelector(".preview");
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

    
      function deserializeProduct(contentForm) {
      
        console.log("ddddddddddddddddddddddddddddddddddddd");
        let content = productItemModal.querySelector("#newProductForm");
        console.log(content);
        console.log(contentForm);
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

      // This function update the updated product
     function serializeProduct(data) {
        if(!data) return;

        let product = document.querySelector(`[data-product-id='${productId}']`);
        console.log(product);

        let cardTitle = product.querySelector(".card-title");
        cardTitle.innerHTML = data.name;

        let prodCat = product.querySelector("h6");
        prodCat.innerHTML = data.category.name;

        let productPrice = product.querySelector(".product-price");
        productPrice.innerHTML = data.price;

      }
     // Basically this function removes the the editForm and this a message indication that the 
     // was successfully edited and then remove it
     function successMessageHolder(responseStatus, data) {
       
       let newProductForm  = productItemModalBody.querySelector("#newProductForm");
       let messageHolder = document.createElement("div");
       messageHolder.classList.add("response-message-holder");
       newProductForm.parentNode.insertBefore(messageHolder, newProductForm);
        
       let statusMessage  = null;
       if(responseStatus === 200) {
         statusMessage = `<div class="alert alert-success" role="alert">
                            The product has been updated successfully check below to see the changes
                           </div>`;
               // We remove the form
              newProductForm.remove();
              messageHolder.insertAdjacentHTML("afterbegin", statusMessage);

             setTimeout(function() {
                 messageHolder.remove();
                 $("#productItemModal").modal("hide");
             }, 3000);
       }else if (responseStatus === 403){
        statusMessage = `<div class="alert alert-danger" role="alert">
                           ${data.message}
                         </div>`;
         messageHolder.insertAdjacentHTML("afterbegin", statusMessage);
       }else {
        statusMessage = `<div class="alert alert-danger" role="alert">
                       An unknown error occured on the server. Please try again later !
                       </div>`;
         messageHolder.insertAdjacentHTML("afterbegin", statusMessage);
       }

      }

});
});