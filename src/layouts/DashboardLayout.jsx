/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../contexts/AuthContext";

function DashboardLayout({ role }) {
  const isMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useAuth();

  const roleMapping = {
    member: "Member",
    "team-leader": "Team Leader",
    hr: "HR",
    admin: "Admin",
    finance: "Finance",
  };

  // Get authenticated user information
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userRole = roleMapping[role] || role;

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleOpenMenu = () => {
    setMobileOpen(true);
  };

  const handleCloseMenu = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        role={role}
        variant={isMobile ? "temporary" : "permanent"}
        mobileOpen={mobileOpen}
        onClose={handleCloseMenu}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F5F7FB",
          width: isMobile ? "100%" : "calc(100% - 248px)",
        }}
      >
        <Topbar
          role={role}
          userName={userName}
          userInitials={userInitials}
          userEmail={userEmail}
          onMenuClick={handleOpenMenu}
        />

        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
