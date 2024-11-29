// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const sequelize = require('../config/db');
// const nodemailer = require('nodemailer');
// const { CLIENT_RENEG_LIMIT } = require('tls');
// require('dotenv').config({ path: './src/.env' });


// exports.createUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if the user already exists
//         const [existingUsers] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
//         if (existingUsers.length > 0) {
//             return res.status(409).send({ message: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert the new user into the database
//         const insertQuery = `
//           INSERT INTO users (name, email_id, hashed_password) VALUES (?, ?, ?)
//         `;
//         await sequelize.query(insertQuery, { replacements: [name, email, hashedPassword] });

//         res.status(201).send({ message: 'User created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };

// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const [rows] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
//         if (rows.length === 0) {
//             return res.status(401).send({ message: 'Invalid email or password' });
//         }
//         const user = rows[0];
//         const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
//         if (!isPasswordValid) {
//             return res.status(401).send({ message: 'Invalid email or password' });
//         }
//         res.status(200).send({ message: 'Login successful' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };

// Import necessary modules
const bcrypt = require('bcrypt');  // For hashing and comparing passwords
const crypto = require('crypto');  // For generating cryptographic values (not used in this code, but might be useful for token generation, etc.)
const sequelize = require('../config/db');  // Database connection
const nodemailer = require('nodemailer');  // For sending emails (though not used here, might be useful for user verification)
const { CLIENT_RENEG_LIMIT } = require('tls');  // Not used in this code, possibly included for future purposes
require('dotenv').config({ path: './src/.env' });  // Load environment variables from .env file

// Endpoint to create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;  // Destructure the user data from the request body

        // Check if a user already exists with the provided email
        const [existingUsers] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
        if (existingUsers.length > 0) {
            return res.status(409).send({ message: 'User already exists' });  // If the email already exists, return a conflict error
        }

        // Hash the password before storing it in the database for security
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password with a salt rounds of 10

        // Insert the new user into the 'users' table
        const insertQuery = `
          INSERT INTO users (name, email_id, hashed_password) VALUES (?, ?, ?)
        `;
        await sequelize.query(insertQuery, { replacements: [name, email, hashedPassword] });  // Execute the insert query

        // Send a response indicating the user was created successfully
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);  // Log any errors for debugging
        res.status(500).send({ message: 'Server error' });  // Return a 500 server error if something goes wrong
    }
};

// Endpoint to log in an existing user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;  // Destructure the login credentials from the request body

        // Query the database to find the user by email
        const [rows] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });  // If no user is found, return an unauthorized error
        }
        const user = rows[0];  // Get the user data from the result set

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });  // If the password doesn't match, return an unauthorized error
        }

        // If login is successful, return a success message
        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        console.error(error);  // Log any errors for debugging
        res.status(500).send({ message: 'Server error' });  // Return a 500 server error if something goes wrong
    }
};
