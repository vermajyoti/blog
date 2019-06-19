const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post= require('./database/models/Post');
 
const app = new express();
 
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
 .then(() => 'You are now connected to Mongo!')
 .catch(err => console.error('Something went wrong', err))

app.use(express.static('public'));
app.use(expressEdge);
app.set('views',__dirname+'/views');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true

}));
app.get('/',(req,res)=>{
 res.render('index');
});
app.get('/posts/new',(req,res)=>{
    res.render('create');
});

app.post('/posts/store', (req, res) => {
    Post.create(req.body, (error, post) => {
        res.redirect('/')
    })
});
app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});
app.listen(8080,()=>{
    console.log('app listing on port 8080')
});
