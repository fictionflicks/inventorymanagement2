//mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    gender: {
        type: String,
        required: true,
    },
    hasAdminAccess: {
        type: Boolean,
        default: false,
    },
    hasAtmCard: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'superadmin', 'storekeeper', 'salesgirl'],
        default: 'user',
    },
    timestamps: {
        type: Date,
        default: Date.now,
    },
});


//create model
const User = mongoose.model('User', userSchema);

module.exports = User; //export the model to use it in other files