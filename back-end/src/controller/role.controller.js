const Role = require('../models/role.model');
const { sendResponse } = require('../utils/sendResponse');
const { responseStatus } = require('../utils/responseStatus');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        return res
            .status(responseStatus.code_200)
            .send(sendResponse(roles, false, 'Roles fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Role not found'));
        }
        return res
            .status(responseStatus.code_200)
            .send(sendResponse(role, false, 'Role fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.createRole = async (req, res) => {
    try {
        const { role, description } = req.body;

        // check if role already exists
        const existingRole = await Role.findOne({ role });
        if (existingRole) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Role already exists'));
        }

        const newRole = new Role({ role, description });
        await newRole.save();
        return res
            .status(responseStatus.code_201)
            .send(sendResponse(newRole, false, 'Role created successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.updateRole = async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRole) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Role not found'));
        }
        return res
            .status(responseStatus.code_200)
            .send(sendResponse(updatedRole, false, 'Role updated successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res
                .status(responseStatus.code_404)
                .send(sendResponse(null, true, 'Role not found'));
        }
        return res
            .status(responseStatus.code_200)
            .send(sendResponse(null, false, 'Role deleted successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};
