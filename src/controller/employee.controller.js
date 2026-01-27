const bcrypt = require('bcrypt'); 
const Employee = require('../models/employee.model');
const User = require('../models/user.model')
const { sendResponse } = require('../utils/sendResponse');
const { responseStatus } = require('../utils/responseStatus');
const { default: mongoose } = require('mongoose');


exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('department', 'name');

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(employees, false, 'Employees fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('department', 'name');

        if (!employee) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Employee not found'));
        }

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(employee, false, 'Employee fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        if (!name) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Name is required'));
        }
        if (!email) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Email is required'));
        }
        if (!password) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Password is required'));
        }
        if (!department) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Department is required'));
        }
         if (!mongoose.Types.ObjectId.isValid(department)) {
            return res.status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Invalid department ID'));
        }
        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Email already exists'));
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create employee with hashed password
        const employee = new Employee({ name, email, password: hashedPassword, department });
        await employee.save();

        // Create user entry with hashed password
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: '68a5640d68b97d7365f36bb3', // fixed role ID
            });
            await user.save();
        }

        return res
            .status(responseStatus.code_201)
            .send(sendResponse(employee, false, 'Employee created successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.updateEmployee = async (req, res) => {
    try {
                const { id } = req.params;

        const updateData = { ...req.body };
        if (updateData.email) {
            const existingEmployee = await Employee.findOne({
                email: updateData.email,
                _id: { $ne: id }, // exclude current employee
            });

            if (existingEmployee) {
                return res
                    .status(responseStatus.code_400)
                    .send(sendResponse(null, true, 'Email already exists for another employee'));
            }
        }

        // If password is being updated, hash it
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        // Update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedEmployee) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Employee not found'));
        }

        // Also update corresponding user entry if exists
        const user = await User.findOne({ email: updatedEmployee.email });
        if (user) {
            const userUpdate = { ...updateData };
            await User.findByIdAndUpdate(user._id, userUpdate, { new: true });
        }

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(updatedEmployee, false, 'Employee updated successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};


exports.deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Employee not found'));
        }

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(null, false, 'Employee deleted successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};
