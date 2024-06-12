const winston = require('winston');
require('winston-mongodb');
const error = require("./middleware/error");
const catchAsync = require("./middleware/async");
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require('mongoose');
const containsObj = require('./utils/containsObj');
const _ = require('lodash');
const hashing = require('./utils/hash')

const app = express();
const users =[];

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

//winston code

// process.on('uncaughtException',(ex)=>{
//     console.log('WE GOT AN UNCAUGHT EXCEPTION.');
//     winston.error(ex.message,ex);
//     process.exit(1);
// });

// winston.handleExceptions(
//     new winston.transports.File({filename : 'uncaughtExceptions.log'})
// )

// process.on('unhandledRejection',(ex)=>{
//     throw ex;
// })

// winston.add(winston.transports.File({filename:'logfile.log'}));
// winston.add(winston.transports.MongoDB({
//     db: 'mongodb://localhost:27017/trainingDB',
//     level: 'error',
// }));

app.use(express.json());

app.get('/',catchAsync(async (req,res,next)=>{
    // throw new Error("Intentionally thrown error");
    res.render("index")
}));

app.post('/',catchAsync(async(req,res)=>{
    const {username , password} = req.body;
    console.log(password)
    let user = {
        username: username,
        password: await hashing(password)
    }
    users.push(user);
    // console.log(_.pick(user,['username']))
    console.log(users);
    res.redirect('/');
}))

app.use(error);

app.listen(3000,()=>{
    console.log("Serving on port 3000");
});
