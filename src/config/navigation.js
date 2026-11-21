export const USER_ROLES = {
  MEMBER: "member",
  TEAM_LEADER: "team-leader",
  HR: "hr",
  ADMIN: "admin",
};

export const navigationConfig = {
  [USER_ROLES.MEMBER]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Attendance", path: "/attendance" },
    { label: "My Overtime", path: "/overtime" },
    { label: "My Payslip", path: "/payslip" },
    { label: "Fines & Rewards", path: "/fines-rewards" },
    { label: "Projects & Tasks", path: "/projects" },
    { label: "Notifications", path: "/notifications" },
  ],

  [USER_ROLES.TEAM_LEADER]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
    { label: "Performance", path: "/performance" },
    { label: "Teams", path: "/teams" },
    { label: "Sprints", path: "/sprints" },
    { label: "Overtime", path: "/overtime" },
    { label: "My Attendance", path: "/attendance" },
    { label: "Reports", path: "/reports" },
    { label: "Notifications", path: "/notifications" },
  ],

  [USER_ROLES.HR]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Employees", path: "/employees" },
    { label: "Attendance", path: "/attendance" },
    { label: "Overtime", path: "/overtime" },
    { label: "Payroll", path: "/payroll" },
    { label: "Leaves", path: "/leaves" },
    { label: "Fines & Rewards", path: "/fines-rewards" },
    { label: "Reports", path: "/reports" },
    { label: "Notifications", path: "/notifications" },
  ],

  [USER_ROLES.ADMIN]: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Users", path: "/users" },
    { label: "Roles & Permissions", path: "/roles" },
    { label: "Projects Overview", path: "/projects" },
    { label: "Company Analytics", path: "/analytics" },
    { label: "Company Settings", path: "/settings" },
    { label: "Audit Logs", path: "/audit-logs" },
    { label: "Notifications", path: "/notifications" },
  ],
};

export const getNavigationByRole = (role) => {
  return navigationConfig[role] || [];
};