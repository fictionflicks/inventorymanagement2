const express = require('express');
const router = express.Router();

const userController = require('../controllers/usercontroller');

//define the routes
router.post('/createuser', userController.createUser);
router.post('/login', userController.loginUser);

//export the router to use it in other files
module.exports = router;
