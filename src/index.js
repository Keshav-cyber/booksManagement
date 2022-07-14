const express = require("express");
const bodyParser = require('body-parser');
const route = require('./routes/route');
const multer = require('multer')
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(multer().any())

const { AppConfig } = require('aws-sdk');

mongoose.connect("mongodb+srv://Keshav-cyber:7LizqrsG6tL39fuT@cluster0.ohm0bak.mongodb.net/group38Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});