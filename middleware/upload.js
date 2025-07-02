const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const profileStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'avtar',
        allowed_format: [ 'jpg', 'png']
    }
})
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'post_images',
    allowed_formats: ['jpg', 'png','webp',],
  },
});

const profileUpload = multer({storage: profileStorage})
const postUpload = multer({storage: postStorage});

module.exports = {profileUpload, postUpload}