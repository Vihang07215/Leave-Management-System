import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  addDepartment,
  updateDepartment,
  getDepartment,
} from "../../../redux/slice/departmentSlice";

const AddDepartmentModal = ({ isOpen, onClose, departmentData }) => {

  const dispatch = useDispatch();

  const defaultForm = {
    name: "",
    description: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(departmentData?._id);

  useEffect(() => {

    if (!isOpen) {
      setForm(defaultForm);
      return;
    }

    if (departmentData?._id) {
      setForm({
        name: departmentData.name || "",
        description: departmentData.description || "",
      });
    } else {
      setForm(defaultForm);
    }

  }, [isOpen, departmentData]);


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
        updateDepartment({
          id: departmentData._id,
          data: form,
        })
      );

    } else {

      res = await dispatch(addDepartment(form));

    }

    setLoading(false);

    if (!res.error) {

      toast.success(res.payload.message);

      dispatch(getDepartment());

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
            {isEdit ? "Update Department" : "Add Department"}
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
              Department Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter department name"
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


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Department"
              : "Create Department"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddDepartmentModal;