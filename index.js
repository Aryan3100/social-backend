const express = require('express');
const port = process.env.PORT || 3000;
const connectdb = require('./config/connectDb');
const user = require('./routes/user');
const post = require('./routes/post');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors(
    {
       origin: process.env.frontendURL, // frontend URL
    credentials: true,
    }
))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
connectdb(process.env.DB_URL);


app.use('/user', user)
app.use('/post', post)

app.listen(port, ()=>console.log('app is runing'))