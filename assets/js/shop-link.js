import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';


window.addEventListener('load', () => {

    if(document.getElementById("shopLink")) {
    
    let shopLink = document.getElementById("shopLink");

    //shopLink.addEventListener("click", e => {
    $(document).on("click", "#shopLink", function(e) {

    console.log(Routes);

    Routing.setRoutingData(Routes);

        e.preventDefault();

        console.log(shopLink);

        let newUrl = Routing.generate("shop_new");

        let shopModal = document.getElementById("shopModal");

        let shopModalBody = shopModal.querySelector("#shopModalBody");

        let shopForm = shopModalBody.querySelector("#shopForm");

        let displayShopInfo = shopModalBody.querySelector("#displayShopInfo");

        let editshop = displayShopInfo.querySelector(".edit-shop");

        let newShop = displayShopInfo.querySelector(".new-shop");

        let deleteShop = displayShopInfo.querySelector(".delete-shop");

        let submitForm = shopModal.querySelector(".submit-form"); 

        // Check if the element containing the shop data is available

        

        if(shopLink.hasAttribute("data-shop-id")) {

            if(displayShopInfo.style.display = "none") {
                displayShopInfo.style.display = "block";
            }
            let shopId = shopLink.dataset.shopId;

            let url = Routing.generate("shop_show");

            url = url + `/${shopId}`;

            let response = fetch(url, {
                method: "GET", 
                cache: "no-cache", 
                credentials: "same-origin", 
            })
            .then(response => response.json())
            .then(data => {

                console.log(JSON.stringify(data));
                return data;
            })
            .catch(error => console.error(error));

            response.then(data => {
                console.log(data);

                let shopAddress = data.shopAddress;
                
                let shopName = displayShopInfo.querySelector(".shopName");
                let shopCategory = displayShopInfo.querySelector(".shopCategory");
                let shopCountry = displayShopInfo.querySelector(".shopCountry");
                let shopCity = displayShopInfo.querySelector(".shopCity");
                let shopStreet = displayShopInfo.querySelector(".shopStreet");
                let shopPostalCode = displayShopInfo.querySelector(".shopPostalCode");
                let shopEmail = displayShopInfo.querySelector(".shopEmail");
                let shopPhoneNumber = displayShopInfo.querySelector(".shopPhoneNumber");
                let shopWebsite = displayShopInfo.querySelector(".shopWebsite");

                shopName.innerHTML = data.name;
                shopCategory.innerHTML = `Category: ${data.shopCategory.name}`;
                shopCountry.innerHTML = shopAddress.country;
                shopCity.innerHTML = shopAddress.city;
                shopStreet.innerHTML = shopAddress.street; 
                shopPostalCode.innerHTML = shopAddress.postalCode;
                shopEmail.innerHTML = shopAddress.email;
                shopPhoneNumber.innerHTML = shopAddress.phoneNumber ? shopAddress.phoneNumber: '';
              
                shopWebsite.innerHTML = shopAddress.website ? shopAddress.website : "";
                

            });

            shopForm.style.display ="none";

            $("#shopModal").modal('show');

            //editshop.addEventListener("click", editShop);
            let editUrl = Routing.generate("shop_edit", {id: shopId});

            editshop.onclick = function() { 
                submitForm.removeEventListener("click", createShop);
                //let editData = $("#shopForm").serializeArray();
                //let form = "shopForm";
                //let editData = deserializeShop(form);
                //let formData = new FormData(shopForm);
                
                //console.log(formData);
                submitForm.onclick = function(){ 
                    let editData = $("#shopForm").serializeArray();
                    //editData.shopCategory.name = editData.shopCategory;
                    console.log(editData);
                    //let form = "shopForm";
                    let content = deserializeShop(editData);
                    //let essai = deserializeShop(editData);
                    console.log(content);
                    //console.log(essai);
                    //let cat = essai.shopCategory;
                    //delete content.shopCategory;
                    //delete essai.shopCategory;
                    //essai.shopCategory;
                    //console.log(essai);
                    //let shopCategory = new Object();
                    //shopCategory.name = cat;
                    //console.log(shopCategory);
                    //let shopCategory = {}
                    //Object.assign(shopCategory, cat);
                    //console.log(shopCategory);
                    //essai.shopCategory = new Object();
                    //Object.assign(essai, shopCategory);
                    //console.log(essai);
                    //Object.assign(content, shopCategory);
                    updateShop(editUrl, content);
                }
                displayShopInfo.style.display ="none";
                editShop(editUrl, shopId);
                shopForm.style.display ="block";
            };
            //newShop.addEventListener("click", createShop);
            newShop.addEventListener("click", e => {
                submitForm.removeEventListener("click", updateShop);

                submitForm.onclick = function() {
                    alert("Submit create");

                    let createData = $("#shopForm").serializeArray();
                    let content = deserializeShop(createData);

                    console.log(content);

                    createShop(newUrl, content, true);
                }
                
                //let frag = document.createRange().createContextualFragment(response);
                //console.log(frag);
                /*
                let frag = document.createRange().createContextualFragment(data);
                console.log(frag);
                let symfonyForm = shopModal.querySelector("#symfonyForm");
                symfonyForm.appendChild(frag);
            }); */
                shopForm.reset();
                displayShopInfo.style.display = "none";
                shopForm.style.display ="block";
            });
            deleteShop.onclick = function () { removeShop(shopId) }  //addEventListener("click", removeShop);


        }else {
            displayShopInfo.style.display = "none";
            $("#shopModal").modal('show');

            submitForm.removeEventListener("click", updateShop);

            submitForm.onclick = function() {
                alert("Submit create");

                let createData = $("#shopForm").serializeArray();
                let content = deserializeShop(createData);

                console.log(content);

                createShop(newUrl, content, true);
            }
        }

    function editShop(url) {

        alert("Edit product");

        if(!url) 
           return;
        
       // shopId = parseInt(shopId);   
       //  url = url + `/${shopId}`;
         let method = "GET";
        
         let response = ajax(url, method);
         //let listContainer = shopForm.querySelectorAll("input");
         //console.log(listContainer);

         response.then(data => {
             console.log(data);
             //let dataToArray = Object.entries(data);
             //console.log("------------Data to array -------------");
             //console.log(dataToArray)
             serializeShop(data, shopForm);

         });
    }
    
    function updateShop(url, data) {
        //alert("Edit product");

        if(!url || !data)
          return;
        
        let method  = "POST";
        let response = ajax(url, method, true, data);

        if(response) {

            response.then(data => {
                console.log(data);
            });
        }
    }

    function createShop(url, data) {
        alert("create product");

        if(!data || !url) 
          return;

        let method = "POST";
        let response = ajax(url, method, true, data);

        if(response) {

            response.then(data => {
                console.log(data);
            })
        }
    }

    function removeShop(shopId) {

        if(!shopId)
          return;

        //alert("delete product");
        let url = Routing.generate("shop_delete", {id: shopId});

        let response = fetch(url, {
            method: "POST",
        });

        console.log(response);
    }

    async function ajax(url, method, isJson = true, data = null) {

      if(!url || !method)
         return false;

         let headers = new Headers();

         if(isJson) {
             headers.append("Content-Type", "application/json");
         }

         let init = {
             method: method,
             headers: headers,
             mode: 'cors',
             cache: "no-cache",
             credentials: "same-origin"
         }

       if(data) {    
           if(isJson){
               data = JSON.stringify(data);
           }
       }
       
        if(method == "POST") {
            if(data) {
                init.body = data;
            }
        }

        let request = new Request(url, init);

        try {

       const response = await fetch(request);

       let contentType = response.headers.get("content-type");

       if(contentType || contentType.includes("application/json")) {
         let json = response.json()
                    .then(data => {
                        console.log(JSON.stringify(data));

                        return data;
                    });
             return json;
       }
       return response;
    }catch(error) {
       console.log(error);

       return false;
    }

    }

    function serializeShop(data, formList) {

        //if(!Array.isArray(formList)) 
         //   return;
        
        //let dataToArray = Object.entries(data);

        let listContainer = formList.querySelectorAll("input");

        listContainer.forEach(function(elem,pos) {

            //if(elem.hasAttribute)
            let attrNameValue = elem.getAttribute("name");
            
            for(var name in data) {
                if(attrNameValue == name) {
                    console.log(typeof data[name]);
                    console.log(`name Value ${name}`);
                    if(typeof data[name] === 'object') {
                        console.log("**************************");
                        console.log("Object");
                    //if(Object.entries(name).length === 0 && name.constructor === Object) {
                     //   console.log("Constructor");
                    if(Reflect.has(data[name], "name")) {
                        console.log("--------------------");
                        console.log(data[name]);
                        if(data[name].name) {
                        elem.setAttribute("value", data[name].name);
                            }
                         }
                        
                    }else {
                    //console.log(data[name])
                    //elem.value = data[name];
                    if(data[name].name){
                    elem.setAttribute("value",data[name]);
                        }
                    }
                }
                else if(data[name].hasOwnProperty(attrNameValue)){
                    //console.log(data[name][attrNameValue]);
                    //elem.value = data[name][attrNameValue];
                    if(data[name][attrNameValue]){
                    elem.setAttribute("value", data[name][attrNameValue]);
                    }
                }
                else{
                    console.log(name);
                }              
            } 

        });
    }

    function deserializeShop(content) {

        let data = new Object();

        let listElements = content; //document.getElementById(form).children;
        let shopCategory = new Object();
        let shopAddress = new Object();

        listElements.forEach(function(elem) {

             if(elem.name == "shopCategory") {
               shopCategory.name = elem.value;
               console.log("Found");
             }else if (elem.name == "name") {
                data[elem.name] = elem.value;
             }
            else {
               //data[elem.name] = elem.value;
               shopAddress[elem.name] = elem.value;
            }
            //let attr = elem.getAttribute("name");
            //let val = elem.getAttribute("value");
             
            //data[attr] = val;
        });
        console.log(data);
        console.log(shopCategory);
        //Object.assign(data, shopCategory);
        data.shopCategory = shopCategory;
        data.shopAddress = shopAddress;

        console.log(data);

        return data;

    }
    });
}
});
