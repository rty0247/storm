// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const sequelize = require('../config/db');
// require('dotenv').config({ path: './src/.env' });

// const generateOtp = () => {
//     return crypto.randomInt(100000, 999999).toString();
// };

// const sendOtp = async (email, otp) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Storm Energy Login - OTP',
//         text: `Hello,

// Your OTP code is: ${otp}

// Please use this code for authentication.

// Thank you,
// Storm Energy`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`OTP ${otp} sent to ${email}`);
// };

// const updateOtpInDatabase = async (email, otp) => {
//     const otpCreatedAt = new Date(); // Current timestamp
//     const [result] = await sequelize.query(
//         'UPDATE users SET otp = ?, otp_created_at = ? WHERE email_id = ?',
//         { replacements: [otp, otpCreatedAt, email] }
//     );
//     return result;
// };

// const validateOtp = async (email, otp) => {
//     const [rows] = await sequelize.query('SELECT otp, otp_created_at FROM users WHERE email_id = ?', { replacements: [email] });
//     if (rows.length === 0) {
//         return { valid: false, message: 'Invalid email or OTP' };
//     }

//     const user = rows[0];

//     // Check if the OTP has expired (optional)
//     const otpValidityDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
//     const otpCreatedAt = new Date(user.otp_created_at).getTime();
//     const currentTime = new Date().getTime();

//     if (currentTime - otpCreatedAt > otpValidityDuration) {
//         return { valid: false, message: 'OTP has expired' };
//     }

//     // Validate OTP
//     if (user.otp !== otp) {
//         return { valid: false, message: 'Invalid OTP' };
//     }

//     return { valid: true, message: 'OTP is valid' };
// };

// module.exports = {
//     generateOtp,
//     sendOtp,
//     updateOtpInDatabase,
//     validateOtp,
// };
