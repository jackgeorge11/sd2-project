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
const { User } = require("./models/user");

//PUG template enginge for JG. 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//Route to index.pug
app.get("/", function (req, res) {
    console.log(req.session)
    const feed = new Feed;
    const user = new User;
    feed.getPosts().then(
        Promise => {
            if (req?.session?.user_id) {
                user.findUserById(req.session.user_id).then(Promise => {
                    res.render("index", { posts: feed.posts, user_id: user.user_id });
                })
            } else {
                res.redirect("login");
            }
        }
    )
});

//Attempt to get post by Id JH
app.get("/post/:id", function (req, res) {
    const _id = req.params.id;
    const post = new Post;
    post.getPost(_id).then(
        Promise => {
            res.render("post", { post: [post] });
        }
    )
});

//Route for Login
app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', urlencodedParser, function (req, res) {
    const { email, password } = req.body;
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
})

//Route for Register
app.get("/register", function (req, res) {
    res.render("register");
});

app.post('/register', urlencodedParser, function (req, res) {
    const { email, username, password } = req.body;
    console.log('email is:', email, 'password is:', password);
    var user = new User;
    try {
        user.getIdFromEmail(email).then(uId => {
            if (uId) {
                console.log('user exists');
                res.send('A user with this email already exists');
                //if exising user is found then take them to the wellbeing page.

            }
            else {
                // If no existing user is found, add a new one
                console.log('user doesnt exist')
                user.addUser(email, username, password).then(Promise => {
                    console.log(user)
                    req.session.user_id = user.id;
                    req.session.loggedIn = true;
                    res.redirect('/');
                });
            }
        })
    } catch (err) {
        console.error(`Error while adding password `, err.message);
        res.send('Sorry, an error occurred');
    }
});

app.post('/authenticate', urlencodedParser, function (req, res) {
    const { email, password } = req.body;
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




app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
