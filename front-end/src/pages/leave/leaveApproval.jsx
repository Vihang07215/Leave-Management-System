import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLeaves,
  reviewLeave,
  clearMessage,
} from "../../redux/slice/leaveSlice";
import Navbar from "../../components/navbar/navbar";
import { toast } from "react-toastify";

const LeaveApproval = () => {
  const dispatch = useDispatch();
  const { leaves, loading, success, error } = useSelector(
    (state) => state.leave,
  );

  useEffect(() => {
    dispatch(getAllLeaves());
  }, []);

  // ✅ HANDLE SUCCESS / ERROR
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(getAllLeaves()); // 🔥 refresh list
      dispatch(clearMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [success, error]);

  const handleReview = (id, status) => {
    dispatch(reviewLeave({ id, status }));
  };

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Leave Approval</h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">From</th>
                  <th className="p-4">To</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="border-t text-center">
                    <td className="p-4">{leave.employee?.name}</td>

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
                        className={`px-3 py-1 rounded-full text-sm
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

                    <td className="p-4 space-x-2">
                    
                      {/* Approve Button */}
                      <button
                        onClick={() => handleReview(leave._id, "Approved")}
                        disabled={leave.status === "Approved"}
                        className={`px-3 py-1 rounded text-white
      ${
        leave.status === "Approved"
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }
    `}
                      >
                        Approve
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleReview(leave._id, "Rejected")}
                        disabled={leave.status === "Rejected"}
                        className={`px-3 py-1 rounded text-white
      ${
        leave.status === "Rejected"
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }
    `}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}

                {leaves.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-6">
                      No Leaves Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveApproval;
