
const mongooes = require('mongoose');

const postSchema = mongooes.Schema({
    imageurl:String,
    caption:String,
    userID:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"User"
    },
    likes: [{ type: mongooes.Schema.Types.ObjectId, ref: 'User' }],
    comment: [{type : mongooes.Schema.Types.ObjectId, ref: 'Comment'}],
})

 const Post = mongooes.model('Post', postSchema);

module.exports = Post;