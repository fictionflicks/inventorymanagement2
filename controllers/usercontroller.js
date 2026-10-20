const user = require('../models/users'); //import the user model

//create a user

exports.createUser = async (req, res) => {
    try { 

            //request body validation
            const { name, email, password, gender, phone, role, hasAdminAccess } = req.body;

            
        //check if all required fields are present
        if (!name || !email || !password || !gender || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }  

        //email check if user already exists
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
       
        //phone number check if user already exists
        const existingPhone = await user.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        //encrypt the password before saving it to the database
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create a new user
        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            gender: req.body.gender,
            phone: req.body.phone,
            role: req.body.role || 'user', //default role is user
            hasAdminAccess: req.body.hasAdminAccess || false //default is false
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user' });
    }
       
};

//login user

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if all required fields are present
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //check if user exists
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        //check if password is correct
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //generate a token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: existingUser._id, email: existingUser.email, name: existingUser.name, role: existingUser.role, hasAdminAccess: existingUser.hasAdminAccess }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'User logged in successfully', token , role: existingUser.role, hasAdminAccess: existingUser.hasAdminAccess });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in user' });
    }
};
