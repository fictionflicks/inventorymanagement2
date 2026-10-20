const express = require('express');
//
const upload = require('../Middleware/upload'); //import the upload middleware
const product = require('../models/product'); //import the product model
  //2
const sendEmail = require('../Middleware/emailcenter'); //import the email middleware
//import authentication middleware


//create a product

exports.createProduct = async (req, res) => {
    try {

        //check if all required fields are present
        if (!req.body.name || !req.body.size || !req.body.description || !req.body.price || !req.body.category || !req.body.stock || req.body.isAvailable === undefined || req.body.isAvailable === null) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        
        const { name, size, description, price, category, stock, isAvailable } = req.body;
        const newProduct = new product({ name, size, description, price, category, stock, isAvailable });
        await newProduct.save();
                   //2


        //generate otp
        const otp = Math.floor(100000 + Math.random() * 900000); //generate a 6-digit OTP


        //send email notification
        const emailSubject = 'New Product Created';
        const emailText = `A new product has been created: here is your OTP: ${otp}\n\nName: ${name}\nSize: ${size}\nDescription: ${description}\nPrice: ${price}\nCategory: ${category}\nStock: ${stock}\nAvailable: ${isAvailable}`;
        await sendEmail('fictionflicks313@gmail.com', emailSubject, emailText);


        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product id to be retrieved
        const productById = await product.findById(id);
        if (!productById) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product retrieved successfully', product: productById });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving product' });
    }
};

//get all products

exports.getAllProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving products' });
    }
};

//create a product with image upload

exports.createProductWithImage = async (req, res) => {
    // Run multer first so it parses the multipart body before we read req.body
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file', error: err.message });
        }

        try {
            //check if all required fields are present (req.body is now populated by multer)
            if (!req.body.name || !req.body.size || !req.body.description || !req.body.price || !req.body.category || !req.body.stock || !req.body.isAvailable) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const { name, size, description, price, category, stock, isAvailable } = req.body;



//check if the file is uploaded

if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
}

                const newProduct = new product({
                    name,
                    size,
                    description,
                    price,
                    category,
                    stock,
                    isAvailable,
                    image: req.file.path, // Store the file path in the image field
                });

                await newProduct.save();
                res.status(201).json({ message: 'Product created successfully', product: newProduct });
            } catch (error) {
                res.status(400).json({ message: 'Error creating product', error: error.message });
            }
        });
};


//update a product

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product id to be updated
        const updatedProduct = await product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error updating product' });
    }
};

//delete a product

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product id to be deleted
        const deletedProduct = await product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product' });
    }
};
