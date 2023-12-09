// Code Citation
// =============
// URL: https://canvas.oregonstate.edu/courses/1933532/assignments/9297492
// Date Retrieved: 2023-09-29
// Application: Activity 2 - Node.js App
// Type: Code Snippet, Database Connector
// Author: Professor Michael Curry
// Description: Database connector code copied from Activity 2 instructions.

// Get an instance of mysql we can use in the app
import mysql from 'mysql-await'
import 'dotenv/config'

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME
})

// Export it for use in our application
export default pool