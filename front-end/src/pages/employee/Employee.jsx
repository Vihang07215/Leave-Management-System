import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import Navbar from "../../components/navbar/navbar";
import AddEmployeeModal from "../../components/common/model/AddEmployeeModal";
import toast from "react-hot-toast";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/employees/allemployee");

      if (!res.data.is_error) {
        setEmployees(res.data.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      const res = await axiosInstance.delete(`/employees/deleteemplyoee/${id}`);

      if (!res.data.is_error) {
        toast.success(res.data.message);
        fetchEmployees();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axiosInstance.get(
        `/employees/getemplyoeebyid/${id}`
      );

      if (!res.data.is_error) {
        setEditEmployeeId(id);
        setSelectedEmployee(res.data.data);
        setOpenModal(true);
      }
    } catch (error) {
      toast.error("Failed to load employee");
    }
  };

  const openAddModal = () => {
    setSelectedEmployee(null);
    setEditEmployeeId(null);
    setOpenModal(true);
  };

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Management
          </h1>

          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md"
          >
            + Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading employees...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Date Of Joining</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="border-b hover:bg-gray-50">

                      <td className="px-6 py-4">{emp.name}</td>
                      <td className="px-6 py-4">{emp.email}</td>
                      <td className="px-6 py-4">{emp.department?.name}</td>
                      <td className="px-6 py-4">
                        {new Date(emp.dateOfJoining).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-center space-x-3">

                        <button
                          onClick={() => handleEdit(emp._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}

                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-500">
                        No Employees Found
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <AddEmployeeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        employeeId={editEmployeeId}
        employeeData={selectedEmployee}
        refreshEmployees={fetchEmployees}
      />
    </>
  );
};

export default Employee;