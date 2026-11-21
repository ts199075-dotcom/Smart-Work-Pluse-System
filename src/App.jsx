import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlaceholderPage from "./components/common/PlaceholderPage";

// Shared Features
import Notifications from "./features/notifications/Notifications";

// Member Pages
import MemberDashboard from "./features/member/dashboard/MemberDashboard";
import MemberAttendance from "./features/member/attendance/MemberAttendance";
import MemberOvertime from "./features/member/overtime/MemberOvertime";
import MemberPayslip from "./features/member/payroll/MemberPayslip";
import MemberFinesRewards from "./features/member/cards-fines/MemberFinesRewards";
import MemberProjectsTasks from "./features/member/tasks/MemberProjectsTasks";
import MemberProfile from "./features/member/profile/MemberProfile";
import MemberSettings from "./features/member/settings/MemberSettings";

// Team Leader Pages
import TeamLeaderDashboard from "./features/team-leader/dashboard/TeamLeaderDashboard";
import TeamLeaderProjects from "./features/team-leader/projects/TeamLeaderProjects";
import TeamLeaderProjectDetails from "./features/team-leader/projects/TeamLeaderProjectDetails";
import TeamLeaderTeams from "./features/team-leader/teams/TeamLeaderTeams";
import TeamLeaderTasks from "./features/team-leader/tasks/TeamLeaderTasks";
import TeamLeaderPerformance from "./features/team-leader/performance/TeamLeaderPerformance";
import TeamLeaderReports from "./features/team-leader/reports/TeamLeaderReports";
import TeamLeaderOvertime from "./features/team-leader/overtime/TeamLeaderOvertime";
import TeamLeaderAttendance from "./features/team-leader/attendance/TeamLeaderAttendance";
import TeamLeaderSprints from "./features/team-leader/sprints/TeamLeaderSprints";

// HR Pages
import HRDashboard from "./features/hr/dashboard/HRDashboard";
import HREmployees from "./features/hr/employee/HREmployees";

// Admin Pages
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import AdminUsers from "./features/admin/users/AdminUsers";
import AdminRoles from "./features/admin/roles/AdminRoles";
import AdminProjects from "./features/admin/projects/AdminProjects";
import CompanyAnalytics from "./features/admin/analytics/CompanyAnalytics";
import CompanySettings from "./features/admin/settings/CompanySettings";
import AuditLogs from "./features/admin/audit-logs/AuditLogs";

// Shared Context
import { AppDataProvider } from "./contexts/AppDataContext.jsx";
import { useAppData } from "./hooks/useAppData";

// Navigation
import {
  USER_ROLES,
  getNavigationByRole,
} from "./config/navigation";

// Temporary role until authentication is implemented
const CURRENT_ROLE = USER_ROLES.ADMIN;
const CURRENT_TEAM_LEADER = "Sara Ahmed";

function getPageByRole(
  role,
  path,
  label,
  projects,
  setProjects,
  currentTeamLeader
) {
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
      case "/profile":
        return <MemberProfile />;

      case "/member-settings":
        return <MemberSettings />;  

      case "/notifications":
        return <Notifications role={role} />;

      default:
        return <PlaceholderPage title={label} />;
    }
  }

  if (role === USER_ROLES.TEAM_LEADER) {
    switch (path) {
      case "/dashboard":
        return <TeamLeaderDashboard />;

      case "/projects":
        return (
          <TeamLeaderProjects
            projects={projects}
            setProjects={setProjects}
            currentTeamLeader={currentTeamLeader}
          />
        );

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

      case "/attendance":
        return <TeamLeaderAttendance />;

      case "/sprints":
        return <TeamLeaderSprints />;

      case "/notifications":
        return <Notifications role={role} />;

      default:
        return <PlaceholderPage title={label} />;
    }
  }

  if (role === USER_ROLES.HR) {
    switch (path) {
      case "/dashboard":
        return <HRDashboard />;

      case "/employees":
        return <HREmployees />;

      case "/notifications":
        return <Notifications role={role} />;

      default:
        return <PlaceholderPage title={label} />;
    }
  }

  if (role === USER_ROLES.ADMIN) {
    switch (path) {
      case "/dashboard":
        return <AdminDashboard projects={projects} />;

      case "/users":
        return <AdminUsers />;

      case "/roles":
        return <AdminRoles />;

      case "/projects":
        return <AdminProjects projects={projects} />;

      case "/analytics":
        return <CompanyAnalytics projects={projects} />;

      case "/settings":
        return <CompanySettings />;

      case "/notifications":
        return <Notifications role={role} />;

      case "/audit-logs":
        return <AuditLogs />;

      default:
        return <PlaceholderPage title={label} />;
    }
  }

  return <PlaceholderPage title={label} />;
}

// Main application content
function AppContent() {
  const { projects, setProjects } = useAppData();

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
                item.label,
                projects,
                setProjects,
                CURRENT_TEAM_LEADER
              )}
            />
          ))}

          {CURRENT_ROLE === USER_ROLES.TEAM_LEADER && (
            <Route
              path="projects/:projectId"
              element={
                <TeamLeaderProjectDetails
                  currentTeamLeader={CURRENT_TEAM_LEADER}
                />
              }
            />
          )}

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Application root
function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;