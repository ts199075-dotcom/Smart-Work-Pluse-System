import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAppData } from "../hooks/useAppData";

function DashboardLayout({ role }) {
  const isMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const { employees } = useAppData();

  const roleMapping = {
    member: "Member",
    "team-leader": "Team Leader",
    hr: "HR",
    admin: "Admin",
  };

  const currentEmployee = employees.find(
    (employee) => employee.role === roleMapping[role]
  );

  const userName = currentEmployee?.name || "User";

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