import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout({ role }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={role} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F5F7FB",
        }}
      >
        <Topbar />

        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;