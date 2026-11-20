
import { useState } from "react";
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

import { initialProjects } from "./features/team-leader/projects/projectsData";

import {
  USER_ROLES,
  getNavigationByRole,
} from "./config/navigation";

// Temporary user until authentication is implemented
const CURRENT_ROLE = USER_ROLES.TEAM_LEADER;
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
      case "/notifications":
        return <Notifications role={role} />;

      default:
        return <PlaceholderPage title={label} />;
    }
  }

  return <PlaceholderPage title={label} />;
}

function App() {
  const navigationItems = getNavigationByRole(CURRENT_ROLE);

  const [projects, setProjects] = useState(initialProjects);

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
                  projects={projects}
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

export default App;
