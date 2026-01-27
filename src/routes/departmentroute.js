const express = require('express');
const router = express.Router();
const departmentController  = require('../controller/department.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /api/departments/alldepartment:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 *       401:
 *         description: Unauthorized
 */
router.get('/alldepartment', authenticate, authorize('Admin'),departmentController.getAllDepartments);

/**
 * @swagger
 * /api/departments/getdepartmentbyid/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Department not found
 */
router.get('/getdepartmentbyid/:id', authenticate, authorize('Admin'), departmentController.getDepartmentById);

/**
 * @swagger
 * /api/departments/adddepartment:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: HR
 *               description:
 *                 type: string
 *                 example: Human Resources Department
 *     responses:
 *       201:
 *         description: Department created
 *       400:
 *         description: Department already exists
 *       401:
 *         description: Unauthorized
 */

router.post('/adddepartment', authenticate, authorize('Admin'), departmentController.createDepartment);

/**
 * @swagger
 * /api/departments/updatedepartment/{id}:
 *   put:
 *     summary: Update a department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
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
 *                 example: HR
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Department updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Department not found
 */
router.put('/updatedepartment/:id', authenticate, authorize('Admin'), departmentController.updateDepartment);

/**
 * @swagger
 * /api/departments/deletedepartment/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Department not found
 */
router.delete('/deletedepartment/:id', authenticate, authorize('Admin'), departmentController.deleteDepartment);
module.exports = router;
