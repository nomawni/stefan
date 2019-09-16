
let whishlists = document.querySelector("#whishlists");

whishlists.addEventListener('click', function(e) {
    
    let url = window.whishlistAll;

    let response = fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin",
    })
    .then(response => response.json())
    .then(data => {

    //  console.log(data[0].id); 
   //  console.log(JSON.stringify(data))
      return data
    })
    .catch(error => console.error(error)
    );

    response.then(data => {
        
        console.log(data);
        console.log("****--------------*********");

        $('#whishlistModal').modal('show');
    })
});