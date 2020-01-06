import Routing from '../../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router';

import Routes from '../../public/js/fos_js_routes.json';
import CommentHandler from './functions/comment_handler.js';

window.addEventListener("load", function(e) {

    let commentForm = document.getElementById("commentForm");

    //let url = window.commentNew;

    commentForm.addEventListener("submit", e => {

        e.preventDefault();

        Routing.setRoutingData(Routes);

        let url = Routing.generate("comment_new");

        let comment = commentForm.querySelector("#commentText");

        let commentValue = comment.value;

        let productItemModal = commentForm.closest("#productItemModal");

        let productId = productItemModal.dataset.productId;

        console.log(comment);

        if(!productId || !commentValue) {

            alert(commentValue);

            return;
        }

        let data = {
            productId: productId,
            comment: commentValue
        }

        let response = fetch(url, {
            method: "POST",
            credentials: "same-origin", 
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data));

            return data;
        })
        .catch(error => console.error(error)
        );

        response.then(data => {

            console.log(data);
            let productItemModalWrapper = commentForm.closest("#productItemModalWrapper");
            let listCommentSection = productItemModalWrapper.querySelector("#listComments");
            let formTextArea = commentForm.querySelector("textarea");
            console.log("**********************");
            console.log(commentForm);
            console.log(commentForm.parentElement);
            console.log(commentForm.parentElement.parentElement);
            console.log(listCommentSection);
            console.log(productItemModalWrapper);
            formTextArea.value = "";

           /* if(!listCommentSection instanceof HTMLDivElement || !listCommentSection.classList.contains(".listComments")) {
               alert("The list is not a div");
               return;
            } */
            // Inserting the newly created comment into the list comments section
            let commentHandler = new CommentHandler();
            commentHandler.serializeComment(listCommentSection, data);

        });
    })
})