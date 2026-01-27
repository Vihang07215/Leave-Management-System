const express = require('express');
const roleroute = require('./roleroute')
const userroute = require('./userroute')
const departmentroute = require('./departmentroute')
const employeeroute = require('./employeeroute')
const leaveroute = require('./leaverequestroute')
const router = express.Router();

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Check API status
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.send({ message: 'Leave Management API Running' });
});

router.use('/roles',roleroute)
router.use('/users',userroute)
router.use('/departments',departmentroute)
router.use('/employees',employeeroute)
router.use('/leave',leaveroute)


module.exports = router;
