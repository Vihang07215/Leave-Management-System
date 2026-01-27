const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employee.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /api/employees/allemployee:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 *       401:
 *         description: Unauthorized
 */
router.get('/allemployee', authenticate, employeeController.getAllEmployees);

/**
 * @swagger
 * /api/employees/getemplyoeebyid/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.get('/getemplyoeebyid/:id', authenticate, authorize('Admin'), employeeController.getEmployeeById);

/**
 * @swagger
 * /api/employees/addemployee:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Role ID
 *                 example: 64f123abcde4567890
 *               department:
 *                 type: string
 *                 description: Department ID
 *                 example: 64f12abcd123456789
 *     responses:
 *       201:
 *         description: Employee created
 *       400:
 *         description: Email already exists
 *       401:
 *         description: Unauthorized
 */
router.post('/addemployee', authenticate, authorize('Admin'), employeeController.createEmployee);

/**
 * @swagger
 * /api/employees/updateemployee/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Role ID
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.put('/updateemployee/:id', authenticate, authorize('Admin'), employeeController.updateEmployee);

/**
 * @swagger
 * /api/employees/deleteemplyoee/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/deleteemplyoee/:id', authenticate, authorize('Admin'), employeeController.deleteEmployee);

module.exports = router;
