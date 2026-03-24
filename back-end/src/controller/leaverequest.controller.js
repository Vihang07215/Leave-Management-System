const LeaveRequest = require('../models/leaverequest.model');
const User = require('../models/user.model')
const Role = require('../models/role.model')
const Employee = require('../models/employee.model');
const {responseStatus} = require('../utils/responseStatus');
const {sendResponse} = require('../utils/sendResponse');
const { notifyLeave } = require('../utils/nodemailer');
const emailQueue = require('../config/emailQueue');

exports.applyLeave = async (req, res) => {
    try {
         const employeeId = req.user.id;  
         console.log("Logged in user:", req.user);
        const {  startDate, endDate, type, reason } = req.body;

       
        const overlapping = await LeaveRequest.findOne({
            employee: employeeId,
            status: { $in: ['Pending', 'Approved'] },
            $or: [
                { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
                { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
                { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
            ]
        });

        if (overlapping) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Leave dates overlap with existing leave'));
        }

        const leave = new LeaveRequest({ employee: employeeId, startDate, endDate, type, reason });
        await leave.save();
        const populatedLeave = await LeaveRequest.findById(leave._id)
       .populate('employee', 'name email');
        const managerRole = await Role.findOne({ role: 'Manager' });
        let managers = [];
        if (managerRole) {
            // Fetch all users with Manager role
            managers = await User.find({ role: managerRole._id });
        }
        console.log("manger",managers)
        // await emailQueue.add({
        //     type: "new",
        //     leave,
        //     employee: populatedLeave.employee,
        //     managers,
        // });
        return res
            .status(responseStatus.code_201)
            .send(sendResponse(populatedLeave, false, 'Leave applied successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.reviewLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const reviewerId = req.user.id; 


        if (!['Approved', 'Rejected'].includes(status)) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Invalid status'));
        }

        const leave = await LeaveRequest.findById(id);
        if (!leave) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Leave request not found'));
        }
         if (leave.status === status) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, `Leave is already ${status.toLowerCase()}`));
        }
        leave.status = status;
        leave.reviewedBy = reviewerId;
        leave.reviewedAt = new Date();
        leave.auditTrail.push({
            action: status,
            by: reviewerId,
            at: new Date()
        });
        await leave.save();
        const populatedLeave = await LeaveRequest.findById(leave._id)
             .populate('employee', 'name email')
             .populate('reviewedBy', 'name email')
             .populate('auditTrail.by', 'name email');  
        //   await emailQueue.add({
        //     type: "review",
        //     leave: populatedLeave,
        //     employee: populatedLeave.employee,
        // });

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(populatedLeave, false, `Leave ${status.toLowerCase()} successfully`));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.getLeaves = async (req, res) => {
    try {
        const { employeeId } = req.query;
        const filter = {};
        if (employeeId) filter.employee = employeeId;

        const leaves = await LeaveRequest.find(filter)
            .populate('employee', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ appliedAt: -1 });

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(leaves, false, 'Leaves fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.getallleaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find()
            .populate('employee', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ appliedAt: -1 });

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(leaves, false, 'Leaves fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.getleavesbystatus = async(req,res) =>{
    try{
        const {status} = req.query;
          const filter = {};

        if (status) {
            filter.status = status; 
        }
        const leaves = await LeaveRequest.find(filter)
            .populate('employee', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ appliedAt: -1 });

         return res
            .status(responseStatus.code_200)
            .send(sendResponse(leaves, false, 'Leaves fetched successfully'));
    }
    catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
}

