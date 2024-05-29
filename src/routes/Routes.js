// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/Controller');

// Define routes
router.get('/hello', controller.hello);
//router.post('/', userController.createUser);
//router.get('/:id', userController.getUserById);
//router.put('/:id', userController.updateUser);
//router.delete('/:id', userController.deleteUser);

module.exports = router;
