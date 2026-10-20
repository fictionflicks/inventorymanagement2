const express = require('express');
const router = express.Router();

const { protect } = require('../Middleware/auth'); //import authentication middleware
const upload = require('../Middleware/upload'); //import the upload middleware


//import authorization middleware
const { authorize } = require('../Middleware/role');

//import the product controller
const productController = require('../controllers/ProductController');



//define the routes
router.post('/createproduct', productController.createProduct);
router.post('/createproductwithimage', productController.createProductWithImage);
router.get('/getproduct/:id', protect, authorize(['storekeeper']), productController.getProductById);
router.get('/getallproducts', protect, productController.getAllProducts);
router.put('/updateproduct/:id', protect, productController.updateProduct);
router.delete('/deleteproduct/:id', protect, productController.deleteProduct);

//export the router to use it in other files
module.exports = router;