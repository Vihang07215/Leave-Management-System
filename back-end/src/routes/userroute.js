const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Signup new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roleId
 *             properties:
 *               name:
 *                 type: string
 *                 example: john
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: Tes@12
 *               roleId:
 *                 type: string
 *                 example: 68a5640d68b97d7365f36bb3
 *      
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/signup', usercontroller.signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: vihang@gmail.com
 *               password:
 *                 type: string
 *                 example: Vihang@123*
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Invalid email or password
 */
router.post('/login', usercontroller.login);

/**
 * @swagger
 * /api/users/all-users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       department:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 is_error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/all-users', authenticate, authorize('Admin'), usercontroller.getAllUsers);
// router.post('/approve-leave', authenticate, authorize('Manager'), approveLeave);

module.exports = router;
