import axios from 'axios';

export default class Rating {

    constructor(url, commentContainer) {
        this.url = url;
        this.commentContainer = commentContainer;
    }

    numberLikes(commentRatings) {

        if(!Array.isArray(commentRatings)) {
            return;
        }

        if(commentRatings.length === 0) {
            return 0;
        }

       /* if(commentRatings.length === 1) {
            return 1;
        } */

        let i = 0;
        commentRatings.map(rating => {

            if(rating.action == "like" || rating.action == "Like") {
                i++;
            }
        });

        return i;
    }

    numberDislikes(commentRatings) {

        if(!Array.isArray(commentRatings)) {
            return;
        }

        if(commentRatings.length === 0) {
            return 0;
        }

       /* if(commentRatings.length === 1) {
            return 1;
        } */

        let i = 0;
        commentRatings.map(rating => {

            if(rating.action == "dislike" || rating.action == "Dislike") {
                i++;
            }
        });

        return i;
    }

    async likeComment(ratingValue) {

        if(typeof ratingValue !== "string" ) {
           return false;
        }
       // this.likeBtn.addEventListener("click", function(e) {
           try{

              /*let response = await fetch(this.url, {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json",
                },
                body: JSON.stringify(ratingValue)
            }) */
           
            let response = axios({
                method: "post",
                url: this.url,
                data: ratingValue
            }) 
          
            .then(response => {
                //console.log(response);
                this.responseRating = response.data;
                console.log(this.responseRating.action);
                return response.data;
            })
            .catch(function(error) {
                console.error(error);
               
            });
            
            console.log("************************************");
            console.log(response);
            response.then(data => {
                console.log(data);
                //let amountLikes = data.amountLikes.amountRating;
                //let amountDislikes = data.amountDislikes.amountRating;
                let amountLikes = data.amountLikes.amountRating || data.amountLikes.amountReplyRating;
                let amountDislikes = data.amountDislikes.amountRating || data.amountDislikes.amountReplyRating;
                console.log(amountLikes);
                console.log(amountDislikes);
                this.serializeRating(data.action, data.rating, amountLikes, amountDislikes);
            });

            }catch(error) {
                return error;
            }
      //  });
    }

    serializeRating(action, rating, ratingLikes, ratingDislikes) {
        let numberLikes = this.commentContainer.querySelector(".nb-likes");
        let numberDislikes = this.commentContainer.querySelector(".nb-dislikes");
        let thumbsUp = numberLikes.previousElementSibling;
        let thumbsDown = numberDislikes.previousElementSibling;
        let amountLikes = ratingLikes > 0 ? ratingLikes : ""; //this.amountRating(commentRating, "like");
        let amountDislikes = ratingDislikes > 0 ? ratingDislikes : ""; //this.amountRating(commentRating, "dislike");

        if(rating == "like" && action == "created") {
            numberLikes.innerHTML = amountLikes;
            thumbsUp.style.color = "blue";
        }else if( rating == "like" && action == "removed") {
            thumbsUp.style.color = "#000";
            numberLikes.innerHTML = amountLikes;
            // TODO remove the color of the number of likes container because the user dislikes it
        }else if (action == "updated" && rating == "like") {
            thumbsDown.style.color = "#000";
            thumbsUp.style.color = "blue";
            numberLikes.innerHTML = amountLikes;
            numberDislikes.innerHTML = amountDislikes;
            // TODO remove the color of the number of dislikes container and increasing the number of likes
            // Because the user clicked on the like button and color it
        }else if (rating == "dislike" && action =="created") {
            numberDislikes.innerHTML = amountDislikes
            thumbsDown.style.color = "blue";

        }else if (rating == "dislike" && action == "removed") {
            numberDislikes.innerHTML = amountDislikes;
            thumbsDown.style.color = "#000";

        }else if (action == "updated" && rating =="dislike") {
            numberDislikes.innerHTML = amountDislikes;
            numberLikes.innerHTML = amountLikes;
            thumbsUp.style.color = "#000";
            thumbsDown.style.color = "blue";

        }else {

        }
    }

    amountRating(commentRating, rating) {
        
        if(!Array.isArray(commentRating)) {
           return "Not Array !";
        }
        
        if(typeof rating != "string") {
            return "not string !";
        }

        let i = 0;
        commentRating.map(rating => {
            if(rating.action == rating) {
               i++;
            }
        });
        return i;
    }


}