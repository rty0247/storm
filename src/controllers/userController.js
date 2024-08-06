const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sequelize = require('../config/db');
const nodemailer = require('nodemailer');
const { CLIENT_RENEG_LIMIT } = require('tls');
require('dotenv').config({ path: './src/.env' });
// const {
//     generateOtp,
//     sendOtp,
//     updateOtpInDatabase,
//     validateOtp,
// } = require('./OtpUtils');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const [existingUsers] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
        if (existingUsers.length > 0) {
            return res.status(409).send({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertQuery = `
          INSERT INTO users (name, email_id, hashed_password) VALUES (?, ?, ?)
        `;
        await sequelize.query(insertQuery, { replacements: [name, email, hashedPassword] });

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // const otp = generateOtp();

        // // Send OTP and update database
        // await Promise.all([
        //     sendOtp(email, otp),
        //     updateOtpInDatabase(email, otp)
        // ]);
        res.status(200).send({ message: 'Login successful' });
        // res.status(200).send({ message: 'Login successful. OTP has been sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};

// exports.requestOtpForPasswordReset = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if user exists
//         const [rows] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });
//         if (rows.length === 0) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         const otp = generateOtp();

//         // Send OTP and update database
//         await Promise.all([
//             sendOtp(email, otp),
//             updateOtpInDatabase(email, otp)
//         ]);

//         res.status(200).send({ message: 'OTP has been sent to your email.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const validation = await validateOtp(email, otp);
//         if (!validation.valid) {
//             return res.status(400).send({ message: validation.message });
//         }

//         res.status(200).send({ message: 'OTP is valid' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };

// exports.resetPassword = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Update the password in the database
//         await sequelize.query(
//             'UPDATE users SET hashed_password = ?, otp = NULL, otp_created_at = NULL WHERE email_id = ?',
//             { replacements: [hashedPassword, email] }
//         );

//         res.status(200).send({ message: 'Password has been reset successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Server error' });
//     }
// };
