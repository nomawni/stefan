
import axios from 'axios';
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';
import Rating from './rating.js';
import CommentComponent from './comment_components.js';

export default class Reply {

  constructor(url) {
     this.url = url;
     Routing.setRoutingData(Routes);
  }

  async replyToComment(url,commentId, commentForm, isEdit=false, commentToEdit= null ) {
      let comment = commentForm.querySelector(".reply-input").value;
      let replyCommentWrapper = commentForm.parentNode;
      
      if(!comment || !url || typeof comment !== "string" || typeof url !== "string") {
          alert(comment);
      }
      let content = {
          content: comment,
          commentId: commentId
      }

      try {
      let response = await axios({
          method: "post",
          url: this.url,
          data: content
      })
      .then(response => {
          console.log(response.data);
          if(response.status === 200) {
              console.log(replyCommentWrapper);
              this.serializeCommentReply(replyCommentWrapper, response.data, isEdit, commentToEdit);
              replyCommentWrapper.remove();
          }
          this.responseReply = response.data;
          return response.data;
      })
      .catch(function(error) {
          console.error(error);
      });

    } catch(e) {
        console.error(e);
    }
  }

  serializeCommentReply(commentContainer, comment, isEdit=false, commentToEdit=null) {
                
                console.log("-------------------- SIBLINGS ----------------");
                console.log(commentContainer.parentNode);
                console.log(commentContainer.nextSibling);
                console.log(this);
                console.log("--------------------- END OF SIBLINGS ---------------");
                console.log("ccccccccccccccccccccccccccccccccc");
                console.log(commentContainer);
                console.log(commentContainer.parentNode);
                console.log(commentContainer.parentNode.closest(".list-comment-replies-container"));
                console.log(commentContainer.parentNode.parentNode.querySelector(".list-comment-replies-container"));
                console.log(commentContainer.closest(".list-comment-replies-container"));
                
                // The container of the whole single comment
                let replyCommentWrapper = document.createElement("div");
                replyCommentWrapper.classList.add("reply-wrapper", "comment-and-reply-wrappers");
                listComments.appendChild(replyCommentWrapper);
                // The comment Id that we need for the comment ratings
                let commentId = comment.id;
                // The url for the comment likes or dislike 
                let ratingUrl = Routing.generate("comments_reply_rating_new", {id: commentId});
                // The rating imported from './functions/rating' containing the class 
                // That handles the comment rating
                let rating = new Rating(ratingUrl, replyCommentWrapper);
                // The comment ratings to indicate the number likes and dislikes
                let commentRatings = comment.commentRatings;
    
                let img = document.createElement("img");
                img.src = comment.client.avatar ? comment.client.avatar.finalPath : "/images/default_avatar/default_avatar.png";
                img.alt = comment.client.avatar ? comment.client.avatar.originalName : "";
                img.style = "width:30px;height:30px;";
    
                //listComments.appendChild(img);
                replyCommentWrapper.appendChild(img);
                let commentAuthor = document.createElement("small");
                commentAuthor.innerHTML = comment.client.username;
                replyCommentWrapper.appendChild(commentAuthor);
    
                let commentedAt = document.createElement("time");
                let timeStamp = comment.repliedAt.timestamp;
    
                let dateTime = new Date(timeStamp * 1000);
                let parsedDate = dateTime.getDate() + '-' + dateTime.getMonth() + '-' + dateTime.getFullYear();
                commentedAt.setAttribute("datetime", parsedDate);
                commentedAt.innerHTML = parsedDate;
                
                replyCommentWrapper.appendChild(commentedAt);
                // The comment content section 
                let commentContentWrapper = document.createElement("div");
                commentContentWrapper.classList.add("comment-content-wrapper");
                let p = document.createElement("p");
    
                p.innerHTML = comment.content;
                //listComments.appendChild(p);
                //replyCommentWrapper.appendChild(p);
                commentContentWrapper.appendChild(p);
                // The submenu to edit and delete the comment 
                // <i class="fas fa-ellipsis-v"></i>
                let commentComponent = new CommentComponent();
                let editCommentUrl = Routing.generate("comments_reply_edit", {id: commentId});
                let deleteCommentUrl = Routing.generate("comments_reply_delete", {id: commentId});
                commentContentWrapper.appendChild(commentComponent.actionsOnComment(comment, editCommentUrl, deleteCommentUrl ));
              
                replyCommentWrapper.appendChild(commentContentWrapper);
    
                let likesDiv = document.createElement("div");
                likesDiv.className = "likes-buttons-wrapper";
    
                replyCommentWrapper.appendChild(likesDiv);
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
    
                let replyCommentBtn = document.createElement("a");
                replyCommentBtn.classList.add("reply-comment-btn");
                replyCommentBtn.innerHTML = "Reply";
                replyCommentBtn.onclick = function() {commentReply(replyCommentBtn)};
                // Adding the reply bottom to every div
                likesDiv.appendChild(replyCommentBtn);
               
                // Inserting the reply content after the textarea form 
                //commentContainer.parentNode.insertBefore(replyCommentWrapper, commentContainer.nextSibling);
               // let wrapper = commentContainer.parentNode.querySelector(".list-comment-replies-container");
                 // We check first to see if the user want to edit the comment if so , we insert the edited
                // comment after the comment itself and remove the the old comment 
                if(isEdit) {
                    let wrapper = commentContainer.parentNode;
                    wrapper.insertBefore(replyCommentWrapper, commentToEdit);
                    wrapper.removeChild(commentToEdit);
                }else {
                    let wrapper = commentContainer.parentNode.querySelector(".list-comment-replies-container");
                    wrapper.appendChild(replyCommentWrapper);
                }
  }

}