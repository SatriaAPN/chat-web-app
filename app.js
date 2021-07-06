const express = require('express');




//create the express application
const app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./src/config/database');

/**
 * MIDDLEWARE
 */
//express body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//import all routes from routes
app.use(require('./src/routes'));

//server listen on http://localhost:3000/
app.listen(3000, ()=>{
    console.log('server on');
});
