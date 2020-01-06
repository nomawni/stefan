import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
 import Routes from '../../../public/js/fos_js_routes.json';
import axios from 'axios';
 import Rating from './rating.js';
 import CommentUtilities from './comment_utilities.js';
 import CommentComponent from './comment_components.js';

class CommentHandler {

    constructor() {
        Routing.setRoutingData(Routes);
    }

    editCommentHandler(replyComment, commentId, isEdit=false, content = null, comment = null, Editurl =null) {
      
        let self = this;
        if(replyComment.querySelector(".comment-form-wrapper")) {
            return;
        }

        if(isEdit && !content && !comment && !Editurl) {
            return false;
        }

        let commentFormWrapper = document.createElement("div");
        commentFormWrapper.classList.add("comment-form-wrapper", "comment-and-reply-form-wrapper");

        // We use a new form for the user to edit the comment 
        let commentForm = document.createElement("form");
        commentForm.classList.add('comment-form-edit', "comment-and-reply-form");
        commentFormWrapper.insertAdjacentElement('afterbegin', commentForm);

        let commentInput = `<textarea rows="1" class="comment-edit-input comment-and-reply-input"> 
        ${content ? content : ""}
        </textarea>`;

        commentForm.insertAdjacentHTML('afterbegin', commentInput);
        commentForm.onsubmit = function(e) {
            e.preventDefault();

            self.commentToProduct(Editurl, commentId, e.currentTarget, isEdit, comment);
        }

        let editCancelBtnWrapper = document.createElement("div");
        commentForm.appendChild(editCancelBtnWrapper);

        let cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-edit-comment");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.onclick = function(e){
                 e.preventDefault();
                 commentFormWrapper.remove();
                 comment.style.display = "grid";
        }
       // commentForm.appendChild(cancelBtn);
       editCancelBtnWrapper.appendChild(cancelBtn);

        let editCommentBtn = document.createElement("button");
        editCommentBtn.classList.add("submit-edit-comment");
        editCommentBtn.innerHTML = "Edit";

        //commentForm.appendChild(editCommentBtn);
        editCancelBtnWrapper.appendChild(editCommentBtn);

        comment.parentNode.insertBefore(commentFormWrapper, comment);
        comment.style.display = "none";
    }

    async commentToProduct(url,commentId, commentForm, isEdit=false, commentToEdit= null) {
        let comment = commentForm.querySelector(".comment-edit-input");
        let commentContent = comment.value;
        let listCommentWrapper = commentForm.closest("#listComments");
        let commentFormWrapper = commentForm.parentNode;

        if(!comment || !url || typeof comment !== "string" || typeof url !== "string") {
            alert(comment);
        }

        let content = {
            content: commentContent,
            commentId: commentId
        }

        try {
            let response = await axios({
                method: "post",
                url: url,
                data: content
            })
            .then(response => {
                console.log(response.data);
                if(response.status === 200) {
                    this.serializeComment(listCommentWrapper, response.data, isEdit, commentToEdit);
                    commentFormWrapper.remove();
                }
                return response.data;
            })
            .catch(e => {
                console.error(e);
            });
        }
        catch(e) {
            console.error(e);
        }
    }

    serializeComment(listCommentWrapper, comment, isEdit=false, commentToEdit=null) {

                    // We need the comment components to edit and delete a comment
                    let commentComponent = new CommentComponent();

                    // The container of the whole single comment
                    let commentWrapper = document.createElement("div");
                    commentWrapper.classList.add("comment-wrapper","comment-and-reply-wrappers");
                    //listCommentWrapper.appendChild(commentWrapper);
        
                    //let comment = allComments[i];
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

                    let commentContentWrapper = document.createElement("div");
                     commentContentWrapper.classList.add("comment-content-wrapper");
        
                    let p = document.createElement("p");
                    p.innerHTML = comment.content;
                    //listComments.appendChild(p);
                    //commentWrapper.appendChild(p);
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

                    // The reply comment is contained in the comment utilities 
                    let commentUtilities = new CommentUtilities(commentId);
        
                    let replyCommentBtn = document.createElement("a");
                    replyCommentBtn.classList.add("reply-comment-btn");
                    replyCommentBtn.innerHTML = "Reply";
                    replyCommentBtn.onclick = function() {commentUtilities.commentReply(replyCommentBtn, commentId)};
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
                }

                  let listCommentReplies = document.createElement("div");
                  listCommentReplies.classList.add("list-comment-replies-container");
                  likesDiv.appendChild(listCommentReplies);
                 //  }
            
            if(isEdit) {
                //let wrapper = listCommentWrapper.parentNode;
                listCommentWrapper.insertBefore(commentWrapper, commentToEdit);
                listCommentWrapper.removeChild(commentToEdit);
            }else {
                listCommentWrapper.appendChild(commentWrapper);
            }
        
    }
}

export default CommentHandler;