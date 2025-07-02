const { config } = require("dotenv");
const jwt = require("jsonwebtoken")
config();

module.exports = function auth(req,res, next) {
    // const authtoken = req.headers.authorization;
    const cookie = req.cookies.token;
    console.log(cookie)

    // if(!authtoken || !authtoken.startsWith('Bearer')) return res.json({msg:'please login again or token not provided'});
    if(!cookie) return res.status(401).json({msg:'please login again or token not provided'})
   try {
    //  const token = authtoken.split(" ")[1];
    const verify = jwt.verify(cookie, process.env.JWT_SECRET );
    req.user = verify;
    next()
   } catch (error) {
    res.status(401).json({ msg: 'Access token expired or invalid' });
    console.log(error)
     
   }

}