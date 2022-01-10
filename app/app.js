const express = require("express");

var app = express();

app.use(express.static("static"));

const db = require('./services/db');

var path = require('path');

// CLASSES
const { Feed } = require("./models/feed");
const { Post } = require("./models/post");
const { user_info} = require("./models/user"); 

//PUG template enginge for JG. 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//Route for Register
app.get("/register", function (req, res) {
    res.render("register");
});

//Route for Login
app.get('/login', function (req, res) {
    res.render('login');
});

//Route to index.pug
app.get("/", function(req, res) {
    const feed = new Feed;
    feed.getPosts().then(
        Promise => {
            console.log(feed.posts)
            res.render("index", {posts: feed.posts});
        }
    )
});

//Attempt to get post by Id JH
app.get("/post/:id", function(req, res) {
    const _id = req.params.id;
    const post = new Post;
    post.getPost(_id).then(
        Promise => {
            res.render("post", {post: [post]});
        }
    )
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

app.post('/set-password', function (req, res) {
    params = req.body;
    var user = new user_info(params.email);
    try {
        user.getIdFromEmail().then( uId => {
            if(uId) {
                 //if exising user is found then take them to the wellbeing page.
                user.setUserPassword(params.password).then ( result => {
                    res.redirect('/' + uId);
                });
            }
            else {
                // If no existing user is found, add a new one
                user.addUser(params.email).then( Promise => {
                    res.send('user does not exist in database');
                });
            }
        })
     } catch (err) {
         console.error(`Error while adding password `, err.message);
     }
});

app.post('/authenticate', function (req, res) {
    params = req.body;
    var user = new user_info(params.email);
    try {
        user.getIdFromEmail().then(uId => {
            if (uId) {
                user.authenticate(params.password).then(match => {
                    if (match) {
                        res.redirect('/' + uId);
                    }
                    else {
                        res.send('invalid password');
                    }
                });
            }
            else {
                res.send('invalid email');
            }
        })
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

    


app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
