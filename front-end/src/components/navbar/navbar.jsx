import { Link, useLocation } from "react-router-dom";
import { rolePermissions } from "../../utils/permission";
import { LayoutDashboard, Users, Shield, Building2, CalendarDays, CheckCircle } from "lucide-react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const permissions = rolePermissions[user?.role] || [];
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const modules = [
    { name: "Dashboard", path: "/dashboard", permission: "DASHBOARD_VIEW", icon: LayoutDashboard },
    { name: "Employee", path: "/employee", permission: "EMPLOYEE_VIEW", icon: Users },
    { name: "Role", path: "/role", permission: "ROLE_VIEW", icon: Shield },
    { name: "Department", path: "/department", permission: "DEPARTMENT_VIEW", icon: Building2 },
    { name: "Leave", path: "/leave", permission: "LEAVE_VIEW", icon: CalendarDays },
    { name: "Leave Approval", path: "/leave_Approve", permission: "LEAVE_APPROVE_VIEW", icon: CheckCircle },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg px-6 py-3 flex justify-between items-center">



      {/* Center - Navigation */}
      <div className="flex space-x-6">
        {modules
          .filter((module) => permissions.includes(module.permission))
          .map((module) => {
            const Icon = module.icon;
            const isActive = location.pathname === module.path;

            return (
              <Link
                key={module.path}
                to={module.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-white text-indigo-600 font-semibold shadow"
                      : "hover:bg-white/20"
                  }
                `}
              >
                <Icon size={18} />
                {module.name}
              </Link>
            );
          })}
      </div>

      {/* Right - User + Logout */}
      <div className="flex items-center gap-4">
        
        {/* User Info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs opacity-80">{user?.role}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;