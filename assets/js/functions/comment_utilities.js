import axios from 'axios';
import Routing from '../../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';
import Routes from '../../../public/js/fos_js_routes.json';

import Reply from './reply_comment.js';

export default class CommentUtilities {
    constructor(commentId) {
        this.commentId = commentId;
        Routing.setRoutingData(Routes);
       
    }

    // The function that handles when the user want to see the list of the replies to the comments
    listCommentReply (commentWrapper, commentId, numberRepliesContainer) {

        console.log(numberRepliesContainer);
        let listRepliesWrapper = numberRepliesContainer.parentNode.nextElementSibling;
        let arrow = numberRepliesContainer.querySelector("i");
        if(numberRepliesContainer.classList.contains("hide-list-replies")) {
            //let listRepliesWrapper = numberRepliesContainer.parentNode.nextElementSibling;
            console.log("********************************");
            console.log(listRepliesWrapper);
            //let arrow = numberRepliesContainer.querySelector("i");
            arrow.classList.replace("fa-sort-up", "fa-sort-down");
            numberRepliesContainer.classList.replace("hide-list-replies", "show-list-replies");
            listRepliesWrapper.style.display = "none";
            return;
        }
        // if(numberRepliesContainer.classList.contains("show-list-replies")) {
             //let arrow = numberRepliesContainer.querySelector("i");
             arrow.classList.replace("fa-sort-down", "fa-sort-up");
             numberRepliesContainer.classList.replace("show-list-replies", "hide-list-replies");
            if(listRepliesWrapper.hasChildNodes()) {
            listRepliesWrapper.style.display = "block";
            return;
        }
        // }
         
         let listRepliesUrl = Routing.generate("comment_list_replies", {id: commentId});
         let replyWrapper = commentWrapper.querySelector(".reply-comment-btn");

         let replyComment = new Reply(listRepliesUrl);

         let response = axios.get(listRepliesUrl);
         console.log(response);
         response.then(content => {
             console.log(content);
             console.log(content.data);
             let commentReplies = content.data.commentsReplies;
             console.log(commentReplies);
             commentReplies.map(reply => {
                 console.log("--------------- TEST ---------------");
                 console.log(commentWrapper);
                 console.log(replyWrapper);
                 console.log(reply);
                 console.log("---------------- END TEST -----------");
                 replyComment.serializeCommentReply(replyWrapper, reply);
             });
            // commentHandler.serializeComment(replyWrapper, commentReplies);
         })
    }

     commentReply(replyComment, commentId, isEdit=false, content = null, comment = null, Editurl =null) {
        if(replyComment.parentNode.querySelector(".reply-form-wrapper")) {
            return;
        }
        if(isEdit && !content && !comment && !Editurl) {
            return false;
        }
        // We check to see if the user want to create a new comment or edit an existing comment that he posted
        let url = isEdit ? Editurl : Routing.generate("comments_reply_new");
       // let url = Routing.generate("comments_reply_new");
        //let ratingReplyUrl = Routing.generate("comments_reply_rating_new", {id:})
        let reply = new Reply(url);
        let replyFormWrapper = document.createElement("div");
        replyFormWrapper.classList.add("reply-form-wrapper", "comment-and-reply-form-wrapper");
        //'<div class="reply-form-wrapper"> </div>';
        let replyForm = document.createElement("Form");
        replyForm.classList.add("reply-form", "comment-and-reply-form");
        // Adding the form in the reply form wrapper
        replyFormWrapper.appendChild(replyForm);
        let replyInput = `<textarea rows="1" class="reply-input comment-and-reply-input"> 
         ${isEdit ? content : ""}
        </textarea>`;
        // Setting the reply input 
        replyForm.insertAdjacentHTML("afterbegin",replyInput);//appendChild(replyInput);
        replyForm.onsubmit = function(e) {
            e.preventDefault();
            //let replyContent = replyInput.value;
            //alert(replyContent);
        
            reply.replyToComment(url,commentId, e.target, isEdit, comment);
        };
        // Adding the reply event 
        let editCancelBtnWrapper = document.createElement("div");
        replyForm.appendChild(editCancelBtnWrapper);
        // The cancel button to remove the form
        let cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel-reply");
        cancelBtn.innerHTML = "Cancel";
        cancelBtn.onclick = function(e) { 
            e.preventDefault();
             replyFormWrapper.remove();
             // if the user want to edit the comment we display the form and disable the comment 
             if(isEdit) comment.style.display ="grid";
             //comment.style.display = "grid";
            };
        //replyForm.appendChild(cancelBtn);
        editCancelBtnWrapper.appendChild(cancelBtn);
        // The submit button
        let replySubmitBtn = document.createElement("button");
        replySubmitBtn.setAttribute("type", "submit");
        replySubmitBtn.innerHTML = `${isEdit ? "Edit": "Reply"}`;//"Reply";
        // setting the submit button
        //replyForm.appendChild(replySubmitBtn);
        editCancelBtnWrapper.appendChild(replySubmitBtn);
        // Adding the rpely form wrapper after the reply button
        //replyComment.appendChild(replyFormWrapper);
        if(isEdit) {
            comment.parentNode.insertBefore(replyFormWrapper,comment);
            // if the user want to edit the comment we disable the comment and 
            // show the textare with comment content in it
            comment.style.display = "none";
        }else {
        replyComment.parentNode.insertBefore(replyFormWrapper, replyComment.nextSibling);
        }
        //replyComment.appendChild(replyFormWrapper);
    }
}

export function commentReplyInput() {

    $(document).on("input", ".comment-and-reply-input", function(e) {
        let elem = e.currentTarget;
        elem.style.height = 'auto';
        let elemHeight = elem.scrollHeight;
        if(elemHeight > 100) {
            elem.style.height = 100+'px';
            elem.style.overflowY = "scroll";
            return;
        }
        elem.style.overflowY = "hidden";
        elem.style.height = (elem.scrollHeight)+'px';
        console.log("******** HEIGHT ******");
        console.log(elem.scrollHeight);
        console.log(e.target);
        console.log(e.target.style.height);
    })
}

//export default CommentUtilities;