const express = require('express');
const router = express.Router();
const leaveController = require('../controller/leaverequest.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave Request management
 */

/**
 * @swagger
 * /api/leave/apply:
 *   post:
 *     summary: Employee applies for leave
 *     tags: [Leave]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - type
 *               - reason
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave applied successfully
 */
router.post('/apply', authenticate, authorize('Employee'),leaveController.applyLeave);

/**
 * @swagger
 * /api/leave/review/{id}:
 *   patch:
 *     summary: Admin/Manager approves or rejects leave
 *     tags: [Leave]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - reviewerId
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ Approved, Rejected ]
 *     responses:
 *       200:
 *         description: Leave reviewed successfully
 */
router.patch('/review/:id', authenticate, authorize('Admin', 'Manager'), leaveController.reviewLeave);

/**
 * @swagger
 * /api/leave/getleavebyemplyoee:
 *   get:
 *     summary: Get all leaves, optionally filter by employee
 *     tags: [Leave]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Employee ID to filter
 *     responses:
 *       200:
 *         description: List of leaves
 */
router.get('/getleavebyemplyoee', authenticate, leaveController.getLeaves);
/**
 * @swagger
 * /api/leave/getallleaves:
 *   get:
 *     summary: Get all leaves, optionally filter by employee
 *     tags: [Leave]
 *     responses:
 *       200:
 *         description: List of leaves
 */
router.get('/getallleaves', authenticate, authorize('Admin', 'Manager'),leaveController.getallleaves);

/**
 * @swagger
 * /api/leave/getleavebystatus:
 *   get:
 *     summary: Get leaves filtered by status (Admin/Manager only)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         required: false
 *         description: Filter leaves by status
 *     responses:
 *       200:
 *         description: List of leaves filtered by status
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
 *                       id:
 *                         type: string
 *                         example: "64f0a1d2b7c2a"
 *                       employeeId:
 *                         type: string
 *                         example: "EMP12345"
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-20"
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-25"
 *                       type:
 *                         type: string
 *                         example: "Sick Leave"
 *                       reason:
 *                         type: string
 *                         example: "Fever and doctor visit"
 *                       status:
 *                         type: string
 *                         enum: [Pending, Approved, Rejected]
 *                         example: "Pending"
 *                       reviewerId:
 *                         type: string
 *                         example: "MGR67890"
 *                 is_error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (insufficient permissions)
 */

router.get('/getleavebystatus', authenticate, authorize('Admin', 'Manager'), leaveController.getleavesbystatus);

module.exports = router;
