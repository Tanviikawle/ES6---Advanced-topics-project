const winston = require('winston');
require('winston-mongodb');
const error = require("./middleware/error");
const catchAsync = require("./middleware/async");
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({extended:true}));

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Database connection
mongoose.connect('mongodb://localhost:27017/trainingDB',{});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection error: "));
db.once("open",()=>{
    console.log("Database connected...");
});

process.on('uncaughtException',(ex)=>{
    console.log('WE GOT AN UNCAUGHT EXCEPTION.');
    winston.error(ex.message,ex);
    process.exit(1);
});

winston.handleExceptions(
    new winston.transports.File({filename : 'uncaughtExceptions.log'})
)

process.on('unhandledRejection',(ex)=>{
    throw ex;
})

winston.add(winston.transports.File({filename:'logfile.log'}));
winston.add(winston.transports.MongoDB({
    db: 'mongodb://localhost:27017/trainingDB',
    level: 'error',
}));

app.use(express.json());

app.get('/',catchAsync(async (req,res,next)=>{
    // throw new Error("Intentionally thrown error");
    res.render("index")
}));

app.use(error);

app.listen(3000,()=>{
    console.log("Serving on port 3000");
});
