let productNew = document.getElementById("productNew");

productNew.addEventListener("click", e => {

    e.preventDefault();

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

        newProductContainer.map(elem => {
             console.log(`${elem.name} : ${elem.value}`);
             product[elem.name] = elem.value;
        });

        console.log(productImage.files);

        product["productImageFiles"] = productImageFiles;

        console.log(product);
   // });

    let url = "http://localhost:8001/product/new";

    let response = fetch(url, {
        "method" : "POST",
        "cache": "no-cache",
        "credentials": "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
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
           
});

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