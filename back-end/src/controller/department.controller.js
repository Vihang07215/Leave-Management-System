const Department = require('../models/department.model');
const { sendResponse } = require('../utils/sendResponse');
const { responseStatus } = require('../utils/responseStatus');

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res
      .status(responseStatus.code_200)
      .send(sendResponse(departments, false, 'Departments fetched successfully'));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};


exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, true, 'Department not found'));
    }
    return res
      .status(responseStatus.code_200)
      .send(sendResponse(department, false, 'Department fetched successfully'));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};


exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Department.findOne({ name });
    if (existing) {
      return res
        .status(responseStatus.code_400)
        .send(sendResponse(null, true, 'Department already exists'));
    }

    const department = new Department({ name, description });
    await department.save();

    return res
      .status(responseStatus.code_201)
      .send(sendResponse(department, false, 'Department created successfully'));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};


exports.updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDepartment) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, true, 'Department not found'));
    }
    return res
      .status(responseStatus.code_200)
      .send(sendResponse(updatedDepartment, false, 'Department updated successfully'));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};


exports.deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return res
        .status(responseStatus.code_404)
        .send(sendResponse(null, true, 'Department not found'));
    }
    return res
      .status(responseStatus.code_200)
      .send(sendResponse(null, false, 'Department deleted successfully'));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};
