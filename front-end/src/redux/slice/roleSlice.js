import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

const initialState = {
  roles: [],
  selectedRole: null,
  loading: false,
};

export const getRoles = createAsyncThunk("roles/getRoles", async () => {
  const res = await axiosInstance.get("/roles/getallrole");
  return res.data;
});

export const getRoleById = createAsyncThunk(
  "roles/getbyid",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/roles/getbyid/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const addRole = createAsyncThunk("roles/addRole", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/roles/addrole", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/roles/updaterole/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/roles/deleterole/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const roleSlice = createSlice({
  name: "roles",

  initialState,

  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // get all roles
      .addCase(getRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
      })
      .addCase(getRoles.rejected, (state) => {
        state.loading = false;
      })

      // get role by id
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.selectedRole = action.payload.data;
      });
  },
});

export const { clearSelectedRole } = roleSlice.actions;


export default roleSlice.reducer;