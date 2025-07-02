const express = require("express");
const multer = require("multer");
const { postUpload } = require("../middleware/upload");
const Post = require("../model/post.model");
const auth = require("../middleware/auth");
const Comment = require("../model/comment.model");
const { populate } = require("dotenv");
const User = require("../model/user.model");
const router = express.Router();

router.post('/upload',auth, postUpload.single('post'),async (req,res)=>{
    const {caption} = req.body ;
    try {
        const uploded = Post({caption, imageurl:req.file.path,userID:req.user._id, })
        await uploded.save()
        res.json({msg: 'post upload'})
    } catch (error) {
        console.log(error)
        res.json({msg: 'somthing went wrong'})
    }
})
router.delete('/upload/:id', auth, async (req,res) => {
    //post id 
    const postID =  req.params.id;
try {
    const post = await Post.findOne({_id:postID})
    
    if(!post) return res.json({msg:'psot not found'})
        console.log('post user', post.userID)
      console.log('post user', req.user._id)
          if(post.userID.toString() === req.user._id.toString()){
        await Post.findByIdAndDelete({_id:postID})
        res.status(200).json({msg:'post delted sucessfully'})
    }else{
       res.status(201).json({msg:"unauthrizeed"})
    }
    } catch (error) {
        console.log(error)
    }
   

 })

router.get('/user/post',auth , async(req,res)=>{
    const username = req.query.username
  try {
      const user =await User.findOne({username: username}) 
      if(!user) return res.json({msg: 'user does not exist'})
      const post = await Post.find({userID: user._id}).populate('userID' , 'username profilePic',)
      .populate({path:'comment', populate:{path:'user', select:"username profilePic"}})
      .populate('likes', 'username')
      res.json({post,user})
      
  } catch (error) {
    console.log(error)
  }
})

router.get('/allPost', auth, async(req,res)=>{
    try {
        const allpost = await Post.find({}).populate('userID', 'username profilePic',)
        .populate({path:'comment',populate:{path:'user',select:"username profilePic"}})
        .populate('likes','username')
        res.json({allpost})
    } catch (error) {
        console.log(error)
    }
})

router.post('/comment/:id', auth, async(req,res)=>{
    const {text} = req.body;
    const {id} = req.params;
    
    try {
       const comment = await Comment({text, post:id, user:req.user._id })
        await comment.save()
        await Post.findByIdAndUpdate(id, {
  $push: { comment: comment._id }} )
        res.json({msg: "comment sucessfull"})
    } catch (error) {
        console.log(error)
    }
})

router.post('/like/:id',auth, async(req,res)=>{
    const {id} = req.params;
    const userID = req.user._id
    try {
        const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(userID);
       if(!alreadyLiked) {
         const post =await Post.findByIdAndUpdate(id, {
            $push: {likes : userID}
         })
          res.json({msg: 'photo liked'})
       } else{
          const post = await Post.findByIdAndUpdate(id, {
            $pull: {likes: userID}
        })
          res.json({msg: 'photo disliked'})
       } 
       
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;