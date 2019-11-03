/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (app.css in this case)
//require('react');
import react from 'react';
import ReactDom from 'react-dom';
//require('react-dom');
require('../css/app.css');
require('../css/product.css');
require('../css/list.css');
require("../css/stripe.css");
require("../css/tables.css");
require("../css/search.css");
require('../css/slides.css');
require("./my_orders.js");

//require('../../react-src/cart.js');

require('./add_cart.js');
require('./whish_list.js');
require('./product_item.js');
require('./list_cart.js');
require('./user_whish_lists.js');
require('./search.js');
require('./star_product.js');
require("./stripe.js");
require('./product_new.js');

require('./delete_product.js');
require('./edit_product.js');
require('./share_product.js');
require('./registration.js');
require("./login.js");
require('./user_profile.js');
require('./shop-link.js');

require("./add_comment.js");

require("./remove_product_from_cart.js");

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');
