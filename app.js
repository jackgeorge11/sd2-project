// Import express.js
const express = require("express");

// Create express app
var app = express();

// Declare file structure for pug
app.set('view engine', 'pug');
app.set('views', './views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Routes

app.get('/', (req, res) => {

    // Make sure that the table name is correct otherwise it won't link to the web app JH.
    sql = 'select * from posts';

    db.query(sql).then(results => {
        console.log(results);
        res.render("index", {'posts': results});
    });
});

app.get('/post/:id', (req, res) => {
    const _id = req.params.id;
    sql = `select * from posts where id="${_id}"`;
    res.render("post", {'postId': req.params.id});
});


app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});