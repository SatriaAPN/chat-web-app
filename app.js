const express = require('express');
const cookieParser = require('cookie-parser');



//create the express application
const app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./src/config/database');


//register view engine
app.set('view engine', 'ejs');
app.set('views', 'public');

//adding express static files
app.use(express.static(__dirname + '/public'));

/**
 * MIDDLEWARE
 */
//express body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//import all routes from routes
app.use(require('./src/routes'));

//server listen on http://localhost:3000/
app.listen(3000, ()=>{
    console.log('server on');
});
