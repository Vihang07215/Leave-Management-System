import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { rolePermissions } from "../../utils/permission";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = rolePermissions[user?.role] || [];
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/dashboard/getdashboarddata");

      if (!res.data.is_error) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchLeaveData = async () => {
    try {
      const res = await axiosInstance.get("/dashboard/getLeaveCount");

      if (!res.data.is_error) {
        setLeaveData(res.data.data);
      }
    } catch (error) {
      console.error("Leave Count Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (permissions.includes("LEAVE_APPROVE_VIEW")) {
      fetchLeaveData();
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[70vh] text-xl font-semibold text-gray-600">
          Loading Dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-10">
          Dashboard Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Employees */}
          <div
            onClick={() => navigate("/employee")}
            className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-700 hover:scale-105 transition duration-300"
          >
            <h2 className="text-sm uppercase opacity-80 mb-2">
              Total Employees
            </h2>

            <p className="text-5xl font-bold">{data?.totalEmployees || 0}</p>
          </div>

          {/* Departments */}
          <div onClick={()=>navigate("/department")} className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition duration-300">
            <h2 className="text-sm uppercase opacity-80 mb-2">
              Total Departments
            </h2>

            <p className="text-5xl font-bold">{data?.totalDepartments || 0}</p>
          </div>
        </div>

        {/* Department Cards */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Department Wise Employees
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.departmentWiseEmployees?.map((dept, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 bg-white/70 backdrop-blur-lg shadow-lg border border-white/40 hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {dept.departmentName}
              </h3>

              <p className="text-4xl font-bold text-indigo-600">
                {dept.employeeCount}
              </p>

              <p className="text-sm text-gray-500 mt-1">Employees</p>
            </div>
          ))}
        </div>
        {/* Leave Summary Cards */}
        {permissions.includes("LEAVE_APPROVE_VIEW") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-5">
            {/* Total Leaves */}
            <div
              onClick={() => navigate("/leave_approve")}
              className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:scale-105 transition duration-300"
            >
              <h2 className="text-sm uppercase opacity-80 mb-2">
                Total Leaves
              </h2>
              <p className="text-4xl font-bold">{leaveData?.total || 0}</p>
            </div>

            {/* Pending */}
            <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transition duration-300">
              <h2 className="text-sm uppercase opacity-80 mb-2">Pending</h2>
              <p className="text-4xl font-bold">{leaveData?.pending || 0}</p>
            </div>

            {/* Approved */}
            <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 transition duration-300">
              <h2 className="text-sm uppercase opacity-80 mb-2">Approved</h2>
              <p className="text-4xl font-bold">{leaveData?.approved || 0}</p>
            </div>

            {/* Rejected */}
            <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 transition duration-300">
              <h2 className="text-sm uppercase opacity-80 mb-2">Rejected</h2>
              <p className="text-4xl font-bold">{leaveData?.rejected || 0}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
