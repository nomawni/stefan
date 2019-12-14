import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

 import Checkout from './functions/checkout_list.js';
 import Rating from './functions/rating.js';

//let listProducts = document.querySelectorAll(".productItem");

//listProducts.forEach((product, pos) => {

    //product.addEventListener('click', e => {
    $(document).on('click', '.productItem', function(e) {

        // Closing the search modal if it's in show mode

        $("#searchModal").modal("hide");

        Routing.setRoutingData(Routes);

        let product = e.target;

        console.log("*************************");
        console.log(product);

        let card = product.closest('.card') ? product.closest('.card') : product.closest(".display-searched-item");

       // let cartElem = card.closest(".add-cart");

        let productId = card.dataset.productId;

        let data = {
            Id: productId
        }

        let url = Routing.generate("product_show", {id: productId});

        let productItemModal = document.querySelector('#productItemModal');
        let productItemModalBody = productItemModal.querySelector(".modal-body");
        let backupModalBody = productItemModalBody.cloneNode(true);

        //url = url + productId;

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

         console.log(document.cookie);

        productItemModal.dataset.productId = productId;

        let addCart = productItemModal.querySelector(".add-cart");

        let productItemModalTitle = productItemModal.querySelector('#productItemModalTitle');

        let productActions = productItemModal.querySelector(".product-actions");

        let authorActions = productActions ? productActions.querySelector(".author-actions"): null;

        if(card.dataset.author) {
           if(authorActions)
               authorActions.style =  "display:inline";

        }else {
            
            if(authorActions) {
            authorActions.style = "display:none";
            }
        }

        productItemModalTitle.innerHTML = data.name;
 
        let productImagesContainer = productItemModal.querySelector(".product-images-container");

        let productImages = data.productImages;

        productSlideImg(productImagesContainer, productImages);

        let productDetail = productItemModal.querySelector("#productDetail");

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

            // The container of the whole single comment
            let commentWrapper = document.createElement("div");
            commentWrapper.classList.add("comment-wrapper");
            listComments.appendChild(commentWrapper);

            let comment = allComments[i];
            // The comment Id that we need for the comment ratings
            let commentId = comment.id;
            // The url for the comment likes or dislike 
            let ratingUrl = Routing.generate("comment_rating_new", {id: commentId});
            // The rating imported from './functions/rating' containing the class 
            // That handles the comment rating
            let rating = new Rating(ratingUrl, commentWrapper);

            // The comment ratings to indicate the number likes and dislikes
            let commentRatings = comment.commentRatings;

            let img = document.createElement("img");

            img.src = comment.author.avatar ? comment.author.avatar.finalPath : "/images/default_avatar/default_avatar.png";

            img.alt = comment.author.avatar ? comment.author.avatar.originalName : "";

            img.style = "width:50px;height:50px;";

            //listComments.appendChild(img);
            commentWrapper.appendChild(img);

            let commentAuthor = document.createElement("small");
            commentAuthor.innerHTML = comment.author.username;
            commentWrapper.appendChild(commentAuthor);

            let commentedAt = document.createElement("time");
            let timeStamp = comment.publishedAt.timestamp;

            let dateTime = new Date(timeStamp * 1000);
            let parsedDate = dateTime.getDate() + '-' + dateTime.getMonth() + '-' + dateTime.getFullYear();
            commentedAt.setAttribute("datetime", parsedDate);
            commentedAt.innerHTML = parsedDate;

            //listComments.appendChild(span);
            commentWrapper.appendChild(commentedAt);

            let p = document.createElement("p");

            p.innerHTML = allComments[i].content;
            //listComments.appendChild(p);
            commentWrapper.appendChild(p);

            let likesDiv = document.createElement("div");
            likesDiv.className = "likes-buttons-wrapper";

            commentWrapper.appendChild(likesDiv);
            
            // the Like comment button
            let thumbsUp = document.createElement("i");
            thumbsUp.classList.add("far", "fa-thumbs-up", "thumbs-button");
            // Add the a like when they click on the like button
            let likeValue = "like";
            // The number of Likes
            let numberLikes = rating.numberLikes(commentRatings);
            thumbsUp.onclick = function() { rating.likeComment(likeValue); }
            // Add the like button to the comment likes div
            likesDiv.appendChild(thumbsUp);

            let numberLikesSpan = `<span class="nb-likes">
             ${numberLikes > 0 ? numberLikes: ""} </span>`;
            thumbsUp.insertAdjacentHTML("afterend", numberLikesSpan);

            // the dislike comment button
            let thumbsDown = document.createElement("i");
            thumbsDown.classList.add("far", "fa-thumbs-down", "thumbs-button");
            // Add the a like when they click on the like button
            let dislikeValue = "dislike";
            // The number of dislikes
            let numberDislikes = rating.numberDislikes(commentRatings);
            thumbsDown.onclick = function() {rating.likeComment(dislikeValue); }
            // Add the like button to the comment likes div
            likesDiv.appendChild(thumbsDown);

            let numberDislikeSpan = `<span class="nb-dislikes">
             ${numberDislikes > 0 ? numberDislikes : ""} </span>`;
            thumbsDown.insertAdjacentHTML("afterend", numberDislikeSpan);

            //likesDiv.insertAdjacentHTML("afterbegin", '<i class="far fa-thumbs-up"></i> <span class="nb-likes"> </span> <i class="far fa-thumbs-down"></i> <span class="nb-dislikes"> </span>');
        }

        //let productItemWrapper = document.getElementById("productItemWrapper");

        let checkout = new Checkout(productItemModal);

        $('#productItemModal').modal('show');

        $('#productItemModal').on('show.bs.modal', function (e) {

            let productItemModalWrapper = productItemModal.querySelector('#productItemModalWrapper');
            productItemModalWrapper.querySelector(".checkout").style.display = "inline";
            //let productItemForm = productItemModal.querySelector("#payment-form");
            let paymentForm = productItemModal.querySelector(".payment-form");

            productItemModalWrapper.style.display = "block";
            paymentForm.querySelectorAll(".tab")[1].style.display = "none";
            paymentForm.style.display = "none";
            
          });

      });

    });

  /*function productSlideImg (imgContainer, productImages) {

      imgContainer.innerHTML = "";

    if(productImages) {
        if(productImages.length > 1) {

            for(let i = 0; i < productImages.length; i++) {

     let productImgSlide = document.createElement("div");
     productImgSlide.classList.add("product-img-slide");

     let productImg = document.createElement("img");
     productImg.src= productImages[i].finalPath;
     productImg.alt = productImages[i].imageName;
     productImgSlide.appendChild(productImg);

     imgContainer.appendChild(productImgSlide);

             }

     let prevButton = document.createElement("button");
     prevButton.classList.add("btn-prev");
     let leftArrow = document.createElement("i");
     leftArrow.classList.add("fa", "fa-arrow-circle-left");
     prevButton.appendChild(leftArrow);

     let nextButton = document.createElement("button");
     nextButton.classList.add("btn-next");
     let rightArrow = document.createElement("i");
     rightArrow.classList.add("fa", "fa-arrow-circle-right");
     nextButton.appendChild(rightArrow);

     imgContainer.appendChild(prevButton);
     imgContainer.appendChild(nextButton);

       let x = 0;

      $(".btn-next").click(function() {
          x = (x<=300)?(x+100):0;
          $(".product-img-slide").css('left', -x+"%");
      });

      $(".btn-prev").click(function() {
        x = (x>=100)?(x-100):400;
        $(".product-img-slide").css('left', -x+"%");
    });

        }else {
         let img = productImages[0];
         let singleProdImg = `<div> <img src="${img.finalPath}" alt="${img.originalName}" /> </div>`;
         imgContainer.insertAdjacentHTML("afterbegin", singleProdImg);
        } 
    }
     
} */

let slideIndex = 1;

function productSlideImg (imgContainer, productImages) {

    imgContainer.innerHTML = "";
    let oldDots = imgContainer.nextElementSibling;

    if(oldDots instanceof HTMLDivElement && oldDots.classList.contains("dots-container")) {
        oldDots.remove();
    }

  if(productImages) {
      if(productImages.length > 1) {

         //let imgSlideContainer = document.createElement("div");
         //imgSlideContainer.classList.add("slideshow-container");
        let dotsContainer = document.createElement("div");
        dotsContainer.classList.add("dots-container");
          for(let i = 0; i < productImages.length; i++) {

   let productImgSlide = document.createElement("div");
   //productImgSlide.classList.add("product-img-slide", "fade");
   productImgSlide.classList.add("product-img-slide", "fadeImg");
   let numberedText = document.createElement("div");
   numberedText.classList.add("numbertext");
   productImgSlide.appendChild(numberedText);

   let productImg = document.createElement("img");
   productImg.src= productImages[i].finalPath;
   productImg.alt = productImages[i].imageName;
   productImgSlide.appendChild(productImg);

   let textDiv = document.createElement("div");
   textDiv.classList.add("text");
   productImgSlide.appendChild(textDiv);
 
   imgContainer.appendChild(productImgSlide);

   let dotPos = i +1;
   let dot = document.createElement("span"); //`<span class="dot" onclick="currentSlide(${i})"> </span>`;
   dot.classList.add("dot");
   dot.onclick = function() {currentSlide(dotPos)};
   dotsContainer.appendChild(dot); //.insertAdjacentHTML("beforeend",dot);

        }
    imgContainer.parentNode.insertBefore(dotsContainer, imgContainer.nextSibling);

   let prevButton = document.createElement("button");
   prevButton.onclick = function() {plusSlides(-1)};
   prevButton.classList.add("btn-prev");
   prevButton.innerHTML = "&#10094";
   //let leftArrow = document.createElement("i");
   //leftArrow.classList.add("fa", "fa-arrow-circle-left");
   //prevButton.appendChild(leftArrow);

   let nextButton = document.createElement("button");
   nextButton.onclick = function() {plusSlides(1)};
   nextButton.classList.add("btn-next");
   nextButton.innerHTML = "&#10095";
   //let rightArrow = document.createElement("i");
   //rightArrow.classList.add("fa", "fa-arrow-circle-right");
   //nextButton.appendChild(rightArrow);

   imgContainer.appendChild(prevButton);
   imgContainer.appendChild(nextButton);

    /* let x = 0;

    $(".btn-next").click(function() {
        x = (x<=300)?(x+100):0;
        $(".product-img-slide").css('left', -x+"%");
    });

    $(".btn-prev").click(function() {
      x = (x>=100)?(x-100):400;
      $(".product-img-slide").css('left', -x+"%");
  }); */

      }else {
       let img = productImages[0];
       let singleProdImg = `<div> <img src="${img.finalPath}" alt="${img.originalName}" /> </div>`;
       imgContainer.insertAdjacentHTML("afterbegin", singleProdImg);
      } 
      //let slideIndex = 1;
      showSlides(slideIndex);
  }
   
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("product-img-slide");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
//})