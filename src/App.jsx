import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlaceholderPage from "./components/common/PlaceholderPage";

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
        <Route
          element={<DashboardLayout role={CURRENT_ROLE} />}
        >
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
              element={<PlaceholderPage title={item.label} />}
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