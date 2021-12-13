const express = require("express");

var app = express();

app.use(express.static("static"));

const db = require('./services/db');

var path = require('path');

//PUG template enginge for JG. 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//Route to index.pug
app.get("/", function(req, res) {
    sql = `
        SELECT p.post_date, p.postTitle, p.postBody, p.id, u.username
        FROM posts p
            JOIN users u WHERE p.authorId = u.id;
    `;
    db.query(sql).then(results => {
        res.render("index", {posts: results});
    });
});

//Attempt to get post by Id JH
app.get("/post/:id", function(req, res) {
    const _id = req.params.id;
    sql = `
        SELECT p.*, u.username
        FROM posts p
            JOIN users u ON p.authorId = u.id
            WHERE p.id = ${_id}
    `;
    db.query(sql).then(results => {
        res.render("post", {post: results});
    })
})



//Check that the Database name matches the database name in TP's Database JH.
app.get("/wellbeing-users", function(req, res) {
    // Make sure that the table name is correct otherwise it won't link to the web app JH.
    sql = 'select * from users';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

app.get("/wellbeing-posts", function(req, res) {
    // Make sure that the table name is correct otherwise it won't link to the web app JH.
    sql = 'select * from posts';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

    


app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
