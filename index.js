const logoutController = require("./controllers/logout");
const edge = require("edge.js");	
const connectFlash = require("connect-flash");
const auth = require("./middleware/auth");
const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const storePost = require('./middleware/storePost'); 
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
 
const app = new express();
app.use(connectFlash());

mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))
 
    const mongoStore = connectMongo(expressSession);
 
app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set('views', __dirname + '/views');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
 
app.use('/posts/store', storePost)
app.use('*', (req, res, next) => {
  edge.global('auth', req.session.userId)
  next()
});

app.get("/auth/logout", logoutController);


app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/store", storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);

app.listen(8080, () => {
  console.log("App listening on port 8080");
});
