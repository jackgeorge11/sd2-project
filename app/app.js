const express = require("express");

var app = express();

var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static("static"));

const db = require('./services/db');

var path = require('path');

var bodyParser = require('body-parser');
 
// create application/json parser
var jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
    console.log(req.session)
    const feed = new Feed;
    feed.getPosts().then(
        Promise => {
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

app.post('/set-password', urlencodedParser, function (req, res) {
    const {email, password} = req.body;
    console.log('email is:', email, 'password is:', password);
    var user = new user_info(email);
    try {
        user.getIdFromEmail().then( uId => {
            if(uId) {
                console.log('user exists');
                 //if exising user is found then take them to the wellbeing page.
                user.setUserPassword(password).then ( result => {
                    req.session.uid = uId;
                    req.session.loggedIn = true;
                    res.redirect('/');
                });
            }
            else {
                // If no existing user is found, add a new one
                console.log('user doesnt exist')
                user.addUser(email).then( Promise => {
                    res.send('user does not exist in database');
                });
            }
        })
     } catch (err) {
         console.error(`Error while adding password `, err.message);
     }
});

app.post('/authenticate', urlencodedParser, function (req, res) {
    const {email, password} = req.body;
    console.log('email is:', email, 'password is:', password);
    var user = new user_info(email);
    try {
        user.getIdFromEmail().then(uId => {
            if (uId) {
                user.authenticate(password).then(match => {
                    if (match) {
                        req.session.uid = uId;
                        req.session.loggedIn = true;
                        res.redirect('/');
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
