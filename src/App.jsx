
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlaceholderPage from "./components/common/PlaceholderPage";

// Member Pages
import MemberDashboard from "./features/member/dashboard/MemberDashboard";
import MemberAttendance from "./features/member/attendance/MemberAttendance";
import MemberOvertime from "./features/member/overtime/MemberOvertime";
import MemberPayslip from "./features/member/payroll/MemberPayslip";
import MemberFinesRewards from "./features/member/cards-fines/MemberFinesRewards";
import MemberProjectsTasks from "./features/member/tasks/MemberProjectsTasks";
import MemberNotifications from "./features/member/notifications/MemberNotifications";

// Team Leader Pages
import TeamLeaderDashboard from "./features/team-leader/dashboard/TeamLeaderDashboard";
import TeamLeaderProjects from "./features/team-leader/projects/TeamLeaderProjects";
import TeamLeaderTeams from "./features/team-leader/teams/TeamLeaderTeams";
import TeamLeaderTasks from "./features/team-leader/tasks/TeamLeaderTasks";
import TeamLeaderPerformance from "./features/team-leader/performance/TeamLeaderPerformance";
import TeamLeaderReports from "./features/team-leader/reports/TeamLeaderReports";
import TeamLeaderOvertime from "./features/team-leader/overtime/TeamLeaderOvertime";


import {
  USER_ROLES,
  getNavigationByRole,
} from "./config/navigation";

// Temporary role until authentication is implemented
const CURRENT_ROLE = USER_ROLES.TEAM_LEADER;

function getPageByRole(role, path, label) {
  if (role === USER_ROLES.MEMBER) {
    switch (path) {
      case "/dashboard":
        return <MemberDashboard />;
      case "/attendance":
        return <MemberAttendance />;
      case "/overtime":
        return <MemberOvertime />;
      case "/payslip":
        return <MemberPayslip />;
      case "/fines-rewards":
        return <MemberFinesRewards />;
      case "/projects":
        return <MemberProjectsTasks />;
      case "/notifications":
        return <MemberNotifications />;
      default:
        return <PlaceholderPage title={label} />;
    }
  }

  if (role === USER_ROLES.TEAM_LEADER) {
    switch (path) {
      case "/dashboard":
        return <TeamLeaderDashboard />;

      case "/projects":
        return <TeamLeaderProjects />;

      case "/teams":
         return <TeamLeaderTeams />;  

      case "/tasks":
        return <TeamLeaderTasks />;   

      case "/performance":
        return <TeamLeaderPerformance />;

      case "/reports":
        return <TeamLeaderReports />;  

      case "/overtime":
        return <TeamLeaderOvertime />;  

      default:
        return <PlaceholderPage title={label} />;
    }
  }

    return <PlaceholderPage title={label} />;
  }

function App() {
  const navigationItems = getNavigationByRole(CURRENT_ROLE);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout role={CURRENT_ROLE} />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {navigationItems.map((item) => (
            <Route
              key={item.path}
              path={item.path.slice(1)}
              element={getPageByRole(
                CURRENT_ROLE,
                item.path,
                item.label
              )}
            />
          ))}

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
