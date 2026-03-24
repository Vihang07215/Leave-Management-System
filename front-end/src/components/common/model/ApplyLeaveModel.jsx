import { useState ,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyLeave, clearMessage } from "../../../redux/slice/leaveSlice";
import toast from "react-hot-toast";

const ApplyLeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "Sick",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(applyLeave(formData));
  };

  // 🔥 MAIN FIX HERE
  useEffect(() => {
    if (success) {
      toast.success(success);

      dispatch(clearMessage());

      onClose();        // close modal
      onSuccess();      // 🔥 refresh list immediately

      // reset form
      setFormData({
        startDate: "",
        endDate: "",
        type: "Sick",
        reason: "",
      });
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [success, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

        {success && (
          <div className="bg-green-100 text-green-700 p-2 mb-2 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="type"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Sick</option>
            <option>Casual</option>
            <option>Paid</option>
            <option>Other</option>
          </select>

          <textarea
            name="reason"
            placeholder="Reason"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;