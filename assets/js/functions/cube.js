//const axios = require("axios");
export default class Rectangle {

    constructor(height, width) {
        //
        this.height = height;
        this.width = width;
    }

    coordonate() {
        alert(`The height is ${this.height} and the width is ${this.width}`);
    }

   get data() {
       axios.get('http://127.0.0.1:8001/cart/all')
       .then(function(response) {

         console.log(response);
       })
       .catch(function(error) {
           console.log(error);
       });
   }
}