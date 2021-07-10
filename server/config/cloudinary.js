const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.CLOUD_API_SECRET,
    api_key: process.env.CLOUD_API_KEY
});

module.exports = {cloudinary};