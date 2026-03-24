export const rolePermissions = {
  Admin: [
    "DASHBOARD_VIEW",
    "EMPLOYEE_VIEW",
    "ROLE_VIEW",
    "DEPARTMENT_VIEW",
  
    "LEAVE_APPROVE_VIEW",
  ],
  Manager: [
    "DASHBOARD_VIEW",
    "EMPLOYEE_VIEW",
    "LEAVE_APPROVE_VIEW",
  ],
  Employee: ["DASHBOARD_VIEW", "LEAVE_VIEW"],
};
