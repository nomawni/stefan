let listProducts = document.querySelectorAll(".productItem");

listProducts.forEach((product, pos) => {

    product.addEventListener('click', e => {

        let url = "http://localhost:8001/product/show/";
       //   let url =  window.productShow;

        let card = product.closest('.card');

        let productId = card.dataset.productId;

        let data = {
            Id: productId
        }

        url = url + productId;

        let response = fetch(url, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
           // body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));

            return data;
        })
        .catch(error => console.error(error));

      response.then(data => {

        let productItemModal = document.querySelector('#productItemModal');

        productItemModal.dataset.productId = productId;

        let productItemModalTitle = productItemModal.querySelector('#productItemModalTitle');

        let productActions = productItemModal.querySelector(".product-actions");

        let authorActions = productActions.querySelector(".author-actions");

        if(card.dataset.author) {

           authorActions.style = "display:inline";

           // let deleteButton = document.createElement("button");

           // deleteButton.classList.add("btn", "btn-warning");

           // deleteButton.innerHTML = "Delete";

            //productActions.appendChild(deleteButton);
        }else {

            authorActions.style = "display:none";
        }

        productItemModalTitle.innerHTML = data.name;
 
        let productImg = productItemModal.querySelector("#productItemImg");

        productImg.src = data.productImage.finalPath;

        let productDetail = productItemModal.querySelector("#productDetail");

       // productDetail.innerHTML = data.price;

        let price = productItemModal.querySelector(".item-price");

        if(data.price) {

        price.innerHTML = data.price;
        }

        let productItemDescription = productItemModal.querySelector("#productItemDescription");

        productItemDescription.innerHTML = data.description;

        let itemSize = productItemModal.querySelector(".item-size");

        if(data.size) {

        itemSize.innerHTML = data.size;   
        }

        let itemQuantity = productItemModal.querySelector(".item-quantity");

        itemQuantity.innerHTML = data.quantity;

        let listComments = productItemModal.querySelector("#listComments");

        listComments.innerHTML = "";

        let allComments = data.comments;

        console.log(allComments);

        for(let i = 0; i < allComments.length; i++) {

            let comment = allComments[i];

            let img = document.createElement("img");

            img.src = comment.author.avatar.finalPath;

            img.alt = comment.author.avatar.originalName;

            img.style = "width:50px;height:50px;";

            listComments.appendChild(img);

            let p = document.createElement("p");

            p.innerHTML = allComments[i].content;

            listComments.appendChild(p);

            let span = document.createElement("span");

            span.innerHTML = new Date(comment.publishedAt);

            listComments.appendChild(span);
        }

        //productDetail.querySelector("#priceItem").innerHTML = data.price;

       // console.log(data.productImage.finalPath);

        $('#productItemModal').modal('show');

      });

    });
})