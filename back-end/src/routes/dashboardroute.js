const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardController");
const { authenticate, authorize } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/dashboard/getdashboarddata:
 *   get:
 *     summary: Get Dashboard Data
 *     description: Returns total employees, total departments and department-wise employee count.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmployees:
 *                   type: integer
 *                   example: 50
 *                 totalDepartments:
 *                   type: integer
 *                   example: 5
 *                 departmentWiseEmployees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       departmentName:
 *                         type: string
 *                         example: IT
 *                       employeeCount:
 *                         type: integer
 *                         example: 20
 *       500:
 *         description: Server error
 */

router.get("/getdashboarddata", dashboardController.getDashboard);
/**
 * @swagger
 * /api/dashboard/getLeaveCount:
 *   get:
 *     summary: Get leave counts (Admin only)
 *     description: Returns total leave counts grouped by status (Pending, Approved, Rejected)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave counts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Leave count fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 10
 *                     pending:
 *                       type: number
 *                       example: 3
 *                     approved:
 *                       type: number
 *                       example: 5
 *                     rejected:
 *                       type: number
 *                       example: 2
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (Only Admin can access)
 */
router.get("/getLeaveCount",authenticate,authorize('Admin'), dashboardController.getLeaveCounts);

module.exports = router;