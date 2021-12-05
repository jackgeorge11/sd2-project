// Import express.js
const express = require("express");

// Create express app
var app = express();

// Declare file structure for pug
app.set('view engine', 'pug');
app.set('views', './views');

// Add static files location
app.use(express.static("static"));

// Routes

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/post/:id', (req, res) => {
    console.log(req.params)
    res.render("post", {'postId': req.params.id});
});

app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});