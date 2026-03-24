import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import AddRoleModal from "../../components/common/model/AddRoleModal";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  getRoles,
  getRoleById,
  deleteRole,
  clearSelectedRole,
} from "../../redux/slice/roleSlice";

const Role = () => {

  const dispatch = useDispatch();

const { roles, loading, selectedRole } = useSelector(
  (state) => state.role
);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);



  const handleEdit = async (id) => {

    const res = await dispatch(getRoleById(id));

    if (!res.error) {
      setOpenModal(true);
    } else {
      toast.error("Failed to fetch role");
    }

  };



  const handleDelete = async (id) => {

    if (!window.confirm("Delete this role?")) return;

    const res = await dispatch(deleteRole(id));

    if (!res.error) {

      toast.success(res.payload.message);

      dispatch(getRoles());

    } else {

      toast.error("Delete failed");

    }

  };



  const openAddModal = () => {

    dispatch(clearSelectedRole());

    setOpenModal(true);

  };



  const closeModal = () => {

    setOpenModal(false);

    dispatch(clearSelectedRole());

  };



  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">

        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            Role Management
          </h1>

          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Role
          </button>

        </div>


        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-6 text-center">
              Loading roles...
            </div>

          ) : (

            <table className="min-w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="p-4 text-left">
                    Role
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

                {roles.length === 0 ? (

                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-6 text-gray-500"
                    >
                      No roles found
                    </td>
                  </tr>

                ) : (

                  roles.map((role) => (

                    <tr
                      key={role._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {role.role}
                      </td>

                      <td className="p-4">
                        {role.description}
                      </td>

                      <td className="p-4 text-center space-x-2">

                        <button
                          onClick={() => handleEdit(role._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(role._id)}
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


      <AddRoleModal
        isOpen={openModal}
        onClose={closeModal}
        roleData={selectedRole}
      />
    </>
  );
};

export default Role;