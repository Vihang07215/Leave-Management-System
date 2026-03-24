const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    // employee12: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, enum: ['Sick', 'Casual', 'Paid', 'Other'], required: true },
    reason: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    auditTrail: [
        {
           action: { type: String, enum: ['Approved', 'Rejected'], required: true },
           by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
           at: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
