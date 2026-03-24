import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

// APPLY LEAVE
export const applyLeave = createAsyncThunk(
  "leave/applyLeave",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/leave/apply", formData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const getAllLeaves = createAsyncThunk(
  "leave/getAllLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/leave/getallleaves");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// ✅ APPROVE / REJECT
export const reviewLeave = createAsyncThunk(
  "leave/reviewLeave",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/leave/review/${id}`, {
        status,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leaves: [],
    loading: false,
    reviewLoading: false, // 🔥 separate loading
    success: null,
    error: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // APPLY
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
      })

      // GET ALL
      .addCase(getAllLeaves.fulfilled, (state, action) => {
        state.loading = false; // 🔥 MUST
        state.leaves = action.payload.data;
      })
      // REVIEW
      .addCase(reviewLeave.pending, (state) => {
        state.reviewLoading = true; // 🔥 separate
        state.error = null; // 🔥 add this
        state.success = null;
      })
      .addCase(reviewLeave.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.success = action.payload.message;

        const updatedLeave = action.payload.data;

        state.leaves = state.leaves.map((leave) =>
          leave._id === updatedLeave._id ? updatedLeave : leave,
        );
      })
      .addCase(reviewLeave.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = leaveSlice.actions;
export default leaveSlice.reducer;
