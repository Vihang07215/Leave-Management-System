const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    dateOfJoining: { type: Date, default: Date.now },
},{timestamps:true});

module.exports = mongoose.model('Employee',EmployeeSchema);