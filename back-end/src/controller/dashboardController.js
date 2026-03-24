const Employee = require("../models/employee.model");
const Department = require("../models/department.model");
const { sendResponse } = require("../utils/sendResponse");
const { responseStatus } = require("../utils/responseStatus");
const leaverequestModel = require("../models/leaverequest.model");

exports.getDashboard = async (req, res) => {
  try {
    // 1️⃣ Total Employee Count
    const totalEmployees = await Employee.countDocuments();

    // 2️⃣ Total Department Count
    const totalDepartments = await Department.countDocuments();

    // 3️⃣ Department-wise Employee Count
    const departmentWiseEmployees = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentDetails",
        },
      },
      { $unwind: "$departmentDetails" },
      {
        $project: {
          _id: 0,
          departmentName: "$departmentDetails.name",
          employeeCount: "$count",
        },
      },
    ]);

    return res
      .status(200)
      .send(
        sendResponse(
          { totalEmployees, totalDepartments, departmentWiseEmployees },
          false,
          "Data fetched Succesfully",
        ),
      );
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};
 exports.getLeaveCounts = async (req, res) => {
  try {
    const result = await leaverequestModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let data = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    result.forEach((item) => {
      data.total += item.count;

      if (item._id === "Pending") data.pending = item.count;
      if (item._id === "Approved") data.approved = item.count;
      if (item._id === "Rejected") data.rejected = item.count;
    });

    return res
      .status(responseStatus.code_200)
      .send(sendResponse(data, false, "Leave counts fetched successfully"));
  } catch (err) {
    return res
      .status(responseStatus.code_500)
      .send(sendResponse(null, true, err.message));
  }
};