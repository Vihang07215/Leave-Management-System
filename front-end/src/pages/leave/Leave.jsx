import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import ApplyLeaveModal from "../../components/common/model/ApplyLeaveModel";
import axiosInstance from "../../config/axiosConfig";

const Leave = () => {
  const [openModal, setOpenModal] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/leave/getleavebyemplyoee?employeeId=${user?.id}`,
      );

      if (!res.data.is_error) {
        setLeaves(res.data.data);
      }
    } catch (error) {
      console.error("Leave Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">My Leaves</h1>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow"
          >
            + Apply Leave
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading leaves...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">From</th>
                  <th className="p-4 text-left">To</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{leave.type}</td>

                    <td className="p-4">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>

                    <td className="p-4">{leave.reason}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          leave.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No Leaves Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        <ApplyLeaveModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchLeaves} // 🔥 THIS IS REQUIRED
        />
      </div>
    </>
  );
};

export default Leave;
