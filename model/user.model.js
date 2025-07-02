const mongooes = require('mongoose');

const userShema = mongooes.Schema({
    username:String,
    lastname:String,
    fristname:String,
    email:String,
    password:String,
    profilePic:String,
    refreshToken:String
},{timestamp: true})

const User = mongooes.model('User', userShema);
module.exports = User
