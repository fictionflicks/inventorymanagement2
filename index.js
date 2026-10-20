require('dotenv').config(); //load environment variables from .env file
const express = require('express');

const connectdb = require('./config/databaseconfig');
const app = express();
const productRoute = require('./routes/ProductRoute');
const userRoute = require('./routes/userRoute');


connectdb(); //connect to the database



app.use(express.json()); //middleware to parse JSON request bodies
app.use('/users', userRoute); //use the user route for all user-related endpoints


app.use('/products', productRoute); //use the product route for all product-related endpoints

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
