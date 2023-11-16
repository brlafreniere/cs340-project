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

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_lafrenbl',
    password        : '2615',
    database        : 'cs340_lafrenbl'
})

// Export it for use in our application
export default pool