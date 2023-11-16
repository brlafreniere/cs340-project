// Code Citation
// =============
// URL: https://canvas.oregonstate.edu/courses/1933532/assignments/9297492
// Date Retrieved: 2023-09-29
// Application: Activity 2 - Node.js App
// Type: Code Snippet, Database Connector
// Author: Professor Michael Curry
// Description: starter code for the app.js sections copied from Activity 2
// instructions.

/*
  SETUP
*/
// Express
// var express = require('express');   // We are using the express library for the web server
import express from 'express';
var app     = express();            // We need to instantiate an express object to interact with the server in our code
var PORT        = 8075;                 // Set a port number at the top so it's easy to change in the future

// Code Citation
// =============
// URL: https://expressjs.com/en/guide/using-template-engines.html
// Date Retrieved: 2023-11-15
// Application: Project Step 4 - Node.js App
// Type: App Configuration
// Author: Express Framework Documentation
// Description: Configuration parameter for defining the views folder in express.
app.set('views', './views')
app.set('view engine', 'ejs')

// Database
import db from './db-connector.mjs'

/*
  ROUTES
*/
import planes_controller from "./controllers/planes.mjs"
planes_controller(app)

app.get('/', async (req, res) => {
  res.send("hello from /")
});

/*
  LISTENER
*/
app.listen(PORT, '0.0.0.0', function() {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
