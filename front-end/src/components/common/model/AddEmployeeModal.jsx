import { useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosConfig";
import { getAllRoles } from "../../../services/roleService";
import toast from "react-hot-toast";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  refreshEmployees,
  employeeId,
  employeeData,
}) => {

  const isEdit = Boolean(employeeId);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });

  // Load roles + departments
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;

      try {
        const roleRes = await getAllRoles();
        setRoles(roleRes.data);

        const deptRes = await axiosInstance.get("/departments/alldepartment");
        setDepartments(deptRes.data.data);

      } catch (err) {
        toast.error("Failed to load roles or departments");
      }
    };

    loadData();
  }, [isOpen]);

  // Prefill when editing
  useEffect(() => {

    if (employeeData) {
      setForm({
        name: employeeData.name || "",
        email: employeeData.email || "",
        password: "",
        role: employeeData.role || "",
        department: employeeData.department?._id || "",
      });

    } else {

      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        department: "",
      });

    }

  }, [employeeData]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      let payload = { ...form };

      if (isEdit) {
        delete payload.password;
        delete payload.role;
      }

      let res;

      if (isEdit) {

        res = await axiosInstance.put(
          `/employees/updateemployee/${employeeId}`,
          payload
        );

      } else {

        res = await axiosInstance.post(
          "/employees/addemployee",
          payload
        );

      }

      if (!res.data.is_error) {

        toast.success(res.data.message);

        refreshEmployees();
        onClose();

      }

    } catch (error) {

      toast.error(error.response?.data?.message || "Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-semibold">
            {isEdit ? "Update Employee" : "Add Employee"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* Password ONLY in Add */}
          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          )}

          {/* Role ONLY in Add */}
          {!isEdit && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >

              <option value="">Select Role</option>

              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.role}
                </option>
              ))}

            </select>
          )}

          {/* Department */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >

            <option value="">Select Department</option>

            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}

          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
          >

            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Employee"
              : "Create Employee"}

          </button>

        </form>

      </div>
    </div>
  );
};

export default AddEmployeeModal;