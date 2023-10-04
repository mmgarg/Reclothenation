require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // middleware library in Node.js that is used to handle and parse incoming request bodies
const mongoose = require('mongoose'); // library for mongodb
const _ = require('lodash'); // helper functions for arrays, strings, objects

const app = express();
app.set('view engine', 'ejs'); // to use EJS (Embedded Javascript for rendering dynamic web pages)

app.use(bodyParser.urlencoded({ extended: true })); //used to parse incoming request bodies in a format called "URL-encoded". This format is typically used when submitting form data from HTML forms

app.use(express.static("public")); // It's used to serve static files (like HTML, CSS, JavaScript, images, etc.) from a directory on your server


// Connect to MongoDB Atlas
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }) // URI is the password for mongodb Atlas stores in dotenv file
    .then(() => {
        console.log(`CONNECTED TO MONGO!`);
    })
    .catch((err) => {
        console.log(`MONGO CONNECTION ERROR!`);
        console.log(err);
    });


// Building schema - ReUse Organisations
const Reuse_org = mongoose.model('resueorg', new mongoose.Schema({
    name: String,
    description: String,
    type: String, // pick-up or on-site
    location: String,
    link: String,
    contact: Number
}));


// Bilding Schema - ReCycle Organisations
const Recycle_org = mongoose.model('recycleorg', new mongoose.Schema({
    name: String,
    description: String,
    type: String, // pick-up or on-site
    location: String,
    link: String,
    contact: Number
}));

// Schema for Message Collection
const Messages = mongoose.model('message', new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
}));


// SETTING UP THE DIFFERENT ROUTES

// this is the homepage
app.get('/', function (req, res) {
    res.render('index');
});


// donate service route
app.get('/services/donate', function (req, res) {

    // all the items in reuse schema will b e displayed
    Reuse_org.find()
        .then(function (foundItems) {
            res.render('services/donate', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        });

});


// reycle service route
app.get('/services/recycle', function (req, res) {

    // all the items in recycle schema will be displayed
    Recycle_org.find()
        .then(function (foundItems) {
            res.render('services/recycle', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        })

});

// route for blog 1
app.get('/blog1', function (req, res) {
    res.render('blog1');
});

// route for blog 2
app.get('/blog2', function (req, res) {
    res.render('blog2');
});

// route for blog 3
app.get('/blog3', function (req, res) {
    res.render('blog3');
});


// For handling post request
app.post('/', function (req, res) {
    const msg = new Messages({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.subject
    })

    msg.save();
    res.redirect('/');
    console.log('Your response has been received.');
});


// Handling input city to find near the location
app.post('/services/donate', function (req, res) {

    const requestedLocation = _.startCase(req.body.location).trim(); // to format the string

    // OR operation between input city and 'PAN India' organizations
    Reuse_org.find({ $or: [{ location: requestedLocation }, { location: 'PAN India' }] })
        .then(function (foundItems) {
            res.render('services/donate', { items: foundItems });
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.post('/services/recycle', function (req, res) {
    // console.log(req.body);
    const requestedLocation = _.startCase(req.body.location).trim();

    Recycle_org.find({ $or: [{ location: requestedLocation }, { location: 'PAN India' }] })
        .then(function (foundItems) {
            // console.log(foundItems);
            res.render('services/recycle', { items: foundItems, });
        })
        .catch(function (err) {
            console.log(err);
        });
});


// to listen on the port
app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on Port ', process.env.PORT);
});