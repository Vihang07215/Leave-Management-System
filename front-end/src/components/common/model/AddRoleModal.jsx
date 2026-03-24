import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  addRole,
  updateRole,
  getRoles,
} from "../../../redux/slice/roleSlice";

const AddRoleModal = ({ isOpen, onClose, roleData }) => {

  const dispatch = useDispatch();

  const defaultForm = {
    role: "",
    description: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(roleData?._id);

  // Populate form when modal opens
  useEffect(() => {

    if (!isOpen) {
      setForm(defaultForm);
      return;
    }

    if (roleData?._id) {
      setForm({
        role: roleData.role || "",
        description: roleData.description || "",
      });
    } else {
      setForm(defaultForm);
    }

  }, [isOpen, roleData]);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    let res;

    if (isEdit) {

      res = await dispatch(
        updateRole({
          id: roleData._id,
          data: form,
        })
      );

    } else {

      res = await dispatch(addRole(form));

    }

    setLoading(false);  

    if (!res.error) {

      toast.success(res.payload.message);

      dispatch(getRoles());

      setForm(defaultForm);

      onClose();

    } else {

      toast.error(res.payload || "Something went wrong");

    }

  };



  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Update Role" : "Add Role"}
          </h2>

          <button
            onClick={() => {
              setForm(defaultForm);
              onClose();
            }}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            ✕
          </button>

        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>

            <label className="text-sm text-gray-600">
              Role Name
            </label>

            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Enter role name"
              className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

          </div>


          <div>

            <label className="text-sm text-gray-600">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full border border-gray-300 p-2 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows="3"
              required
            />

          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Role"
              : "Create Role"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddRoleModal;