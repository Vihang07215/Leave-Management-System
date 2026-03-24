import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import AddDepartmentModal from "../../components/common/model/DepartmentModel";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  getDepartment,
  getdepartmentbyid,
  clearSelectedDepartment,
  deleteDepartment,
} from "../../redux/slice/departmentSlice";

const Department = () => {

  const dispatch = useDispatch();

  const { departments, loading, selectedDepartment } = useSelector(
    (state) => state.department
  );

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getDepartment());
  }, [dispatch]);



  const handleEdit = async (id) => {

    const res = await dispatch(getdepartmentbyid(id));

    if (!res.error) {
      setOpenModal(true);
    } else {
      toast.error("Failed to fetch department");
    }

  };



  const handleDelete = async (id) => {

    if (!window.confirm("Delete this department?")) return;

    const res = await dispatch(deleteDepartment(id));

    if (!res.error) {

      toast.success(res.payload.message);

      dispatch(getDepartment());

    } else {

      toast.error("Delete failed");

    }

  };



  const openAddModal = () => {

    dispatch(clearSelectedDepartment());

    setOpenModal(true);

  };



  const closeModal = () => {

    setOpenModal(false);

    dispatch(clearSelectedDepartment());

  };



  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">

        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            Department Management
          </h1>

          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Department
          </button>

        </div>


        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-6 text-center">
              Loading departments...
            </div>

          ) : (

            <table className="min-w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-4 text-left">
                    Department
                  </th>

                  <th className="p-4 text-left">
                    Description
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {departments.length === 0 ? (

                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-6 text-gray-500"
                    >
                      No departments found
                    </td>
                  </tr>

                ) : (

                  departments.map((dept) => (

                    <tr
                      key={dept._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {dept.name}
                      </td>

                      <td className="p-4">
                        {dept.description}
                      </td>

                      <td className="p-4 text-center space-x-2">

                        <button
                          onClick={() => handleEdit(dept._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(dept._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>


      <AddDepartmentModal
        isOpen={openModal}
        onClose={closeModal}
        departmentData={selectedDepartment}
      />

    </>
  );
};

export default Department;