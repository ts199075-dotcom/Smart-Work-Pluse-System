import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlaceholderPage from "./components/common/PlaceholderPage";

import MemberDashboard from "./features/member/dashboard/MemberDashboard";
import MemberAttendance from "./features/member/attendance/MemberAttendance";
import MemberOvertime from "./features/member/overtime/MemberOvertime";
import MemberPayslip from "./features/member/payroll/MemberPayslip";
import MemberFinesRewards from "./features/member/cards-fines/MemberFinesRewards";
import MemberProjectsTasks from "./features/member/tasks/MemberProjectsTasks";
import MemberNotifications from "./features/member/notifications/MemberNotifications";


import {
  USER_ROLES,
  getNavigationByRole,
} from "./config/navigation";

// Temporary role until authentication is implemented
const CURRENT_ROLE = USER_ROLES.MEMBER;

function App() {
  const navigationItems = getNavigationByRole(CURRENT_ROLE);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout role={CURRENT_ROLE} />}>
          {/* Redirect root to Dashboard */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Generate routes from role navigation */}
          {navigationItems.map((item) => (
            <Route
              key={item.path}
              path={item.path.slice(1)}
              element={
                CURRENT_ROLE === USER_ROLES.MEMBER ? (
                  item.path === "/dashboard" ? (
                    <MemberDashboard />
                  ) : item.path === "/attendance" ? (
                    <MemberAttendance />
                  ) : item.path === "/overtime" ? (
                    <MemberOvertime />
                  ) : item.path === "/payslip" ? (
                    <MemberPayslip />
                  ) : item.path === "/fines-rewards" ? (
                    <MemberFinesRewards />
                  ): item.path === "/projects" ? (
                    <MemberProjectsTasks />
                  ): item.path === "/notifications" ? (
                    <MemberNotifications />
                  ) : (
                    <PlaceholderPage title={item.label} />
                  )
                ) : (
                  <PlaceholderPage title={item.label} />
                )
              }
            />
          ))}

          {/* Fallback route */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;