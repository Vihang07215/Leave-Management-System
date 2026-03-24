import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slice/employeeSlice";
import roleReducer from "./slice/roleSlice";
import departmentReducer from "./slice/departmentSlice";
import leaveReducer from "./slice/leaveSlice";

const store = configureStore({
  reducer: {
    employee: employeeReducer,
    role:roleReducer,
    department:departmentReducer,
    leave:leaveReducer
  },
});

export default store;