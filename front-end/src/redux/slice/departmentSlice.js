import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

const initialState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
};

export const getDepartment = createAsyncThunk("departments/alldepartment" ,async () =>{
    const res = await axiosInstance.get("/departments/alldepartment");
    return res.data;

})

export const getdepartmentbyid = createAsyncThunk(
  "departments/getdepartmentbyid",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/departments/getdepartmentbyid/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const addDepartment = createAsyncThunk("departments/adddepartment" ,async (data,rejectWithValue) =>{
    try{
    const res = await axiosInstance.post("/departments/adddepartment",data);
    return res.data;
    }
    catch(err){
        return rejectWithValue(err.response.data.message);
    }
    
}) 

export const updateDepartment = createAsyncThunk("departments/updatedepartment" ,
    async ({id,data},{rejectWithValue}) =>{
    try{
    const res = await axiosInstance.put(`/departments/updatedepartment/${id}`,data);
    return res.data;
    }
    catch(err){
        return rejectWithValue(err.response.data.message);
    }
    
}) 

export const deleteDepartment = createAsyncThunk("departments/deletedepartment" ,
    async (id,{rejectWithValue}) =>{
    try{
    const res = await axiosInstance.delete(`/departments/deletedepartment/${id}`);
    return res.data;
    }
    catch(err){
        return rejectWithValue(err.response.data.message);
    }
    
}) 

const delpartmentSlice = createSlice({
  name: "departments",

  initialState,

  reducers: {
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // get all roles
      .addCase(getDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.data;
      })
      .addCase(getDepartment.rejected, (state) => {
        state.loading = false;
      })

      // get role by id
      .addCase(getdepartmentbyid.fulfilled, (state, action) => {
        state.selectedDepartment = action.payload.data;
      });
  },
});

export const { clearSelectedDepartment } = delpartmentSlice.actions;


export default delpartmentSlice.reducer;