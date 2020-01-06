import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../public/js/fos_js_routes.json';

 import Checkout from './functions/checkout_list.js';
 import Rating from './functions/rating.js';
 import Reply from './functions/reply_comment.js';
 import CommentUtilities from './functions/comment_utilities.js';
 import CommentComponent from './functions/comment_components.js';

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

        let orderType = productItemModalBody.querySelector("input[name='orderType']");
        orderType.dataset.orderId = productId;
        console.log("oooooooooooooooooooooooooooooooooooooooo");
        console.log(orderType);

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
        if(productImages.length > 1) {
            productSlideImg(productImagesContainer, productImages); 
        }else {
            let productImagesContainer = productItemModal.querySelector(".product-images-container");
             if(productItemModalBody.querySelector(".dots-container")) {
                productItemModalBody.querySelector(".dots-container").remove();
             }
            productImagesContainer.innerHTML = ""; // Clear the container for the next images
            let productImg = document.createElement("img");
            productImg.src = productImages[0].finalPath;
            productImg.alt = productImages[0].originalName;
            productImagesContainer.appendChild(productImg);
        }

        //let productDetail = productItemModal.querySelector("#productDetail");

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
        // We serialize the star rating using the function defined below and the argument contained 
        // in the product item

        let starRating = starRatings(data.stars);
        productItemDescription.insertAdjacentHTML('afterend', starRating);

        if(!productItemModal.querySelector("input[name='selectQt']")) {

        let selectQt =`<div class="input-group mb-3 selectQtWrapper">
         <div class="input-group-prepend">
         <span class="input-group-text"> Quantity </span>
         </div>
        <input type="number" name="selectQt" min="1" max="${data.quantity}" value="1" class="form-control col-md-3" />
        
        </div>`;
        productItemDescription.nextElementSibling.insertAdjacentHTML('afterend', selectQt);
        }

        let listComments = productItemModal.querySelector("#listComments");
        // We insert the the select quantity input before the list comments
        //listComments.insertAdjacentHTML('beforebegin', selectQt);
        listComments.innerHTML = "";

        let allComments = data.comments;
        console.log(allComments);

        // We need the comment components to edit and delete a comment
        let commentComponent = new CommentComponent();

        for(let i = 0; i < allComments.length; i++) {

            // The container of the whole single comment
            let commentWrapper = document.createElement("div");
            commentWrapper.classList.add("comment-wrapper","comment-and-reply-wrappers");
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

            commentWrapper.appendChild(commentedAt);
            //listComments.appendChild(span);
            let commentContentWrapper = document.createElement("div");
            commentContentWrapper.classList.add("comment-content-wrapper");

            let p = document.createElement("p");

            p.innerHTML = comment.content;
            //listComments.appendChild(p);
            commentContentWrapper.appendChild(p);

            /**
             * The edit and delete comment section 
             */

            let editCommentUrl = Routing.generate("comment_edit", {id: commentId});
            let deleteCommentUrl = Routing.generate("comment_delete", {id: commentId});
            commentContentWrapper.appendChild(commentComponent.actionsOnComment(comment, editCommentUrl, deleteCommentUrl, true ));
          
            commentWrapper.appendChild(commentContentWrapper);

             /**
              * End of Edit And Delete comment Section
              */

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

            // The comment reply function is contained in the comment utilities
            let commentUtilities = new CommentUtilities(commentId);

            let replyCommentBtn = document.createElement("a");
            replyCommentBtn.classList.add("reply-comment-btn");
            replyCommentBtn.innerHTML = "Reply";
            replyCommentBtn.onclick = function() {commentUtilities.commentReply(replyCommentBtn, commentId)};
            //replyCommentBtn.onclick = function() {commentUtilities.commentReply(commentWrapper, commentId)};
            // Adding the reply bottom to every div
            likesDiv.appendChild(replyCommentBtn);
            // The number of replies
            let numberReplies = comment.commentsReplies.length;
            // We only show the number of replies if there's a minimum of one
            if(numberReplies > 0) {
            // The paragraph indicating the nomber of replies
            let numberRepliesWrapper = document.createElement("div");
            numberRepliesWrapper.classList.add("number-replies-wrapper");

            let numberRepliesContainer = document.createElement("a");
            numberRepliesContainer.classList.add("show-list-replies", "show-hide-replies-comment");
            numberRepliesWrapper.appendChild(numberRepliesContainer);

            let showListRepliesArrow = `<i class="fas fa-sort-down"></i>`;
            numberRepliesContainer.insertAdjacentHTML("afterbegin", showListRepliesArrow);

            let showListRepliesText = `<span> ${numberReplies} ${numberReplies == 1 ? "Reply" : "Replies"} </span>`;
            numberRepliesContainer.insertAdjacentHTML('beforeend', showListRepliesText);

            //document.createElement("p");//`<p> ${numberReplies} Replies </p>`;
            // numberRepliesContainer.innerHTML = `${numberReplies} Replies`;
            // When the user clicks we show the list of the replies to the comment
            numberRepliesContainer.addEventListener("click", function(e) {
                e.stopPropagation();
                commentUtilities.listCommentReply(commentWrapper,commentId, e.currentTarget)
            });
            likesDiv.appendChild(numberRepliesWrapper);
            let listCommentReplies = document.createElement("div");
            listCommentReplies.classList.add("list-comment-replies-container");
            likesDiv.appendChild(listCommentReplies);
            //likesDiv.insertAdjacentHTML('beforeend', numberRepliesContainer);
            //commentWrapper.insertAdjacentHTML('beforeend', numberReplies);
            }

         }

        let checkout = new Checkout(productItemModal);

        $('#productItemModal').modal('show');

        $('#productItemModal').on('show.bs.modal', function (e) {

            let productItemModalWrapper = productItemModal.querySelector('#productItemModalWrapper');
            productItemModalWrapper.querySelector(".checkout").style.display = "inline";
            let paymentForm = productItemModal.querySelector(".payment-form");

            productItemModalWrapper.style.display = "block";
           // paymentForm.querySelectorAll(".tab")[1].style.display = "none";
            paymentForm.style.display = "none";
            
          });
          /// When we close the modal we want to remove the star rating ul because it has been 
          // dynamically created

          $("#productItemModal").on("hidden.bs.modal", function(e) {
             let starRating = productItemModal.querySelector(".rating");
             let transactionSucceeded = productItemModal.querySelector(".transaction-succeeded");
             starRating ? starRating.remove() : null;
             transactionSucceeded ? transactionSucceeded.style.display= "none" : null;
          });

      });

    });

    function starRatings(stars) {
        let ratings = `<ul class="nav rating">`;

            for(var i =1; i <= 5; i++) {
                if(stars.length > 0) {
                    stars.map(star => {
                       ratings +=`<li class="star-product" data-star-id="${star.id}" data-star="${i}">`;
                    
                    if(star.value >= i) {
                      ratings += `<i class="fas fa-star cursor-pointer"></i> `;
                    }else {
                        ratings += `<i class="far fa-star cursor-pointer"></i></li>`;
                    }
                    });
                }else {
                    ratings += `<i class="far fa-star cursor-pointer"></i></li>`;
                }
            }
            ratings += '</ul>';

            return ratings;
    }
//});

let slideIndex = 1;

function productSlideImg (imgContainer, productImages) {

    imgContainer.innerHTML = "";
    let oldDots = imgContainer.nextElementSibling;

    if(oldDots instanceof HTMLDivElement && oldDots.classList.contains("dots-container")) {
        oldDots.remove();
    }

  if(productImages) {
      if(productImages.length > 1) {

        let dotsContainer = document.createElement("div");
        dotsContainer.classList.add("dots-container");
          for(let i = 0; i < productImages.length; i++) {

   let productImgSlide = document.createElement("div");
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

   let nextButton = document.createElement("button");
   nextButton.onclick = function() {plusSlides(1)};
   nextButton.classList.add("btn-next");
   nextButton.innerHTML = "&#10095";

   imgContainer.appendChild(prevButton);
   imgContainer.appendChild(nextButton);

      }else {
       let img = productImages[0];
       let singleProdImg = `<div> <img src="${img ? img.finalPath: null}" alt="${img.originalName}" /> </div>`;
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

/*function commentReply(replyComment, commentId) {
    if(replyComment.parentNode.querySelector(".reply-form-wrapper")) {
        return;
    }
    let url = Routing.generate("comments_reply_new");
    //let ratingReplyUrl = Routing.generate("comments_reply_rating_new", {id:})
    let reply = new Reply(url);
    let replyFormWrapper = document.createElement("div");
    replyFormWrapper.classList.add("reply-form-wrapper");
    //'<div class="reply-form-wrapper"> </div>';
    let replyForm = document.createElement("Form");
    replyForm.classList.add("reply-form");
    // Adding the form in the reply form wrapper
    replyFormWrapper.appendChild(replyForm);
    let replyInput = `<textarea col="5" class="reply-input comment-and-reply-input"> </textarea>`;
    // Setting the reply input 
    replyForm.insertAdjacentHTML("afterbegin",replyInput);//appendChild(replyInput);
    replyForm.onsubmit = function(e) {
        e.preventDefault();
        //let replyContent = replyInput.value;
        //alert(replyContent);
        reply.replyToComment(url,commentId, e.target);
    };
    // Adding the reply event 
    // The cancel button to remove the form
    let cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel-reply");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = function(e) { e.preventDefault(); replyFormWrapper.remove();};
    replyForm.appendChild(cancelBtn);
    // The submit button
    let replySubmitBtn = document.createElement("button");
    replySubmitBtn.setAttribute("type", "submit");
    replySubmitBtn.innerHTML = "Reply";
    // setting the submit button
    replyForm.appendChild(replySubmitBtn);
    // Adding the rpely form wrapper after the reply button
    //replyComment.appendChild(replyFormWrapper);
    replyComment.parentNode.insertBefore(replyFormWrapper, replyComment.nextSibling);
} */
//})