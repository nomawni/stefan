import axios from 'axios';
import CommentUtilities from './comment_utilities.js';
import CommentHandler from './comment_handler.js';
export default class CommentComponent {

    constructor() {
        this.actionsOnComment = this.actionsOnComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }

    actionsOnComment (comment, editCommentUrl, deleteCommentUrl, isComment=false) {
        let self = this;
        console.log(self);
        console.log(comment);
        let commentId = comment.id;

        let commentActionsWrapper = document.createElement("div");
        commentActionsWrapper.classList.add("comment-actions-wrapper");
        let ellipsis =  document.createElement("i");  //`<i class="fas fa-ellipsis-v"></i>`;
        ellipsis.classList.add("fas", "fa-ellipsis-v");
        //commentContentWrapper.insertAdjacentHTML('beforeend', ellipsis);
        commentActionsWrapper.appendChild(ellipsis);

        let actionsButton = document.createElement("div");
        actionsButton.classList.add("btn-group-vertical", "actions-on-comment-btns-wrapper");
        commentActionsWrapper.appendChild(actionsButton);

        // We wanna toggle when the use clicks on the ellipsis we want to show the menu to 
        // either delete or update the comment or hide it
        ellipsis.onclick = function(e) {self.displayHideCommentActions(actionsButton, e.currentTarget)};
        
        // The edit button to edit a comment 
        let editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-secondary");
        //editButton.setAttribute("data-comment-id", commentId);
        editButton.innerHTML = "Edit";
        actionsButton.appendChild(editButton);
        editButton.addEventListener("click", function(e) {self.editComment(comment, editCommentUrl, e.target, isComment)});

        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("btn", "btn-secondary");
        //deleteButton.setAttribute("data-comment-id", commentId);
        deleteButton.innerHTML = "Delete";
        actionsButton.appendChild(deleteButton);
        deleteButton.onclick = function (e) { self.deleteComment(deleteCommentUrl, e.target) };
        
        return commentActionsWrapper;
   
    }

    displayHideCommentActions(actionsButton, ellipsis) {
        if(actionsButton.style.display === "none") {
            actionsButton.style.display = "block";
        }else {
            actionsButton.style.display = "none";
        }
    }

    editComment(comment, url, editButton, isComment=false) {

        let commentId = comment.id;
        let commentContent = comment.content;
        // To edit the comment 
        
        let listRepliesOrComments = editButton.closest(".list-comment-replies-container") || editButton.closest("#listComments");
        let replyOrComment = editButton.closest(".reply-wrapper") || editButton.closest(".comment-wrapper");
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        console.log(replyOrComment);
        console.log(listRepliesOrComments);

        if(isComment) {
            let commentHandler = new CommentHandler();
            commentHandler.editCommentHandler(listRepliesOrComments, commentId, true, commentContent, replyOrComment, url);
        }else {
         // To edit the comment replies
         let commentUtilities = new CommentUtilities(commentId);
        // We indicate that we want to edit the reply by the third parameter to true
        // And we need the content of the comment to serialize the textarea
        // And the commentwrapper to disable or replace it with edit form 
        commentUtilities.commentReply(listRepliesOrComments, commentId, true, commentContent, replyOrComment, url);
        }
        console.log(this);
        console.log(editButton);
        console.log(editButton.parentNode);
        console.log(editButton.closest(".list-comment-replies-container"));
        console.log(editButton.parentNode.closest(".reply-comment-btn"));

    }

    deleteComment(url, deleteButton) {
        
        let listCommentRepliesContainer = deleteButton.closest(".list-comment-replies-container");
        let replyWrapper = deleteButton.closest(".reply-wrapper") || deleteButton.closest(".comment-wrapper");
        let response = axios({
            method: "POST",
            url : url,
        })
        .then(response => {
            
            if(response.status === 200) {
                alert(response.data.message);
                replyWrapper.remove();
            }

        })
        .catch(e => {
            console.error(e);
        });

    }
}