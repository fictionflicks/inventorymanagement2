const multer = require('multer');

// Set up multer storage configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');


//
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "inventory_management", // Specify the folder in Cloudinary where files will be stored
        allowed_formats: ["jpg", "jpeg", "png"], // Specify allowed file formats
        transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: Resize images to a maximum of 800x800 pixels
    },
});

const upload = multer({ storage: storage });   //

module.exports = upload;  //