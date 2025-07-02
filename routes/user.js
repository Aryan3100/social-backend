const express = require("express");
const { profileUpload } = require("../middleware/upload");
const User = require("../model/user.model");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");



router.post('/singUp', profileUpload.single('profilePhoto'),async(req,res)=>{
   const {username,fristname,lastname,email,password} = req.body;
   const exist = await User.findOne({username})
   if(exist) return res.json({msg:'user already exist'})

    const hashpass = await bcrypt.hash(password, 10)

   try {
       const user = User({username,fristname,lastname,email,password:hashpass,profilePic:req.file.path})
       await user.save()
       res.status(200).json({msg: "Sucess"})
   } catch (error) {
      console.log(error)
      res.status(500).json({msg: 'somthing went wrong'})
   }
})

router.post('/login', async(req,res)=>{
    const {username, password}= req.body
   
    try {
        const user =await User.findOne({username})
        if(!user)return res.json({msg: 'user does not exist please singUp'}) 
        const verify =await bcrypt.compare(password, user.password)
        if(!verify)return res.json({msg: 'invalid password'})
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET ,  { expiresIn: '15m' })
        const refreshToken = jwt.sign({_id:user._id}, process.env.REFRESH_JWT, {expiresIn: '7d'})
        res.cookie('token',token, {
            httpOnly: true,
            sameSite: "None", 
  secure: true,   
        maxAge: 1000 * 60 * 15, // mile * second * mint
        }).cookie('refresh', refreshToken, {
            httpOnly: true,
            sameSite: "None",
  secure: true,   
            maxAge:1000* 60 * 60 * 24 * 7
        })
        res.json({msg: 'sucessfull',user:user})

    } catch (error) {
        console.log(error)
    }

})

router.get('/refresh', async(req,res)=> {
    const refresh = req.cookies.refresh;
    if(!refresh) return res.json('please login agian ');
    const token = jwt.verify(refresh, process.env.REFRESH_JWT)
   try {
     const user = await User.findById(token._id);
     res.json({user:user})
   } catch (error) {
     res.json({msg:'please login'})
   }
    // const acesstoken = jwt.sign({_id:user._id}, process.env.JWT_SECRET , {expiresIn: '15m'})
    // res.cookie('token', acesstoken, {
    //     httpOnly: true,
    //     sameSite: true
    // })
   
})

router.get('/auth/refresh', async(req,res)=> {
    const refresh = req.cookies.refresh;
    console.log(refresh)
    if(!refresh) return res.json('please login agian ');

    try {
        const token = jwt.verify(refresh, process.env.REFRESH_JWT) 
     const user = await User.findById(token._id);
    const acesstoken = jwt.sign({_id:user._id}, process.env.JWT_SECRET , {expiresIn: '15m'})
    res.cookie('token', acesstoken, {
        httpOnly: true,
        sameSite: true
    })
    res.json({msg:'cookie send'})
    } catch (error) {
        console.log(error)
    }
   
})

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refresh');
  res.json({ message: 'Logged out successfully' });
});

router.put('/update',auth, profileUpload.single('profilePhoto'), async(req,res)=>{
      try {
          const {username,email,password} = req.body;
        const userobj={}
        if(username) userobj.username = username
        if(email) userobj.email = email;
        if(password) {
             const saltRounds = 10;
  const hased = await bcrypt.hash(password, saltRounds);
          userobj.password = hased
        }
        if(req.file){
            userobj.profilePic = req.file.path;
        }

        const userID = req.user;
    
        const user = await User.findOneAndUpdate({_id:userID._id}, userobj,{new:true});
        console.log(user)
        res.status(200).json({msg: 'suceesfull',user})

      } catch (error) {
        res.status(500).json({msg:'somthing went wrong'})
      }
        
})

module.exports = router;