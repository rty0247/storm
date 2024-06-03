const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

exports.createUser = async (req, res) => {
    try {
        // Extract user data from request body
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database using Sequelize raw query
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

// Function to handle user login
exports.loginUser = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Retrieve user from database using Sequelize raw query
        const [rows] = await sequelize.query('SELECT * FROM users WHERE email_id = ?', { replacements: [email] });

        if (rows.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
};
