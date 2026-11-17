import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Breadcrumbs,
  Link,
} from "@mui/material";

import {
  SearchRounded,
  NotificationsNoneRounded,
  NavigateNextRounded,
} from "@mui/icons-material";

function Topbar({
  pageTitle = "Dashboard",
  userName = "Sara Ahmed",
  userRole = "Member",
  userInitials = "SA",
}) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#172B4D",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Page Information */}
        <Box>
          <Breadcrumbs
            separator={<NavigateNextRounded fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ fontSize: 12 }}
            >
              Workspace
            </Link>

            <Typography fontSize={12} color="text.primary" fontWeight={600}>
              {pageTitle}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Right Actions */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, md: 2 }}>
          {/* Search */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              backgroundColor: "#F5F7FB",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              px: 1.5,
              width: { sm: 180, md: 240 },
              height: 40,
            }}
          >
            <SearchRounded sx={{ color: "#64748B", mr: 1 }} />

            <InputBase
              placeholder="Search..."
              sx={{ fontSize: 13, width: "100%" }}
            />
          </Box>

          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            sx={{ color: "#64748B" }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsNoneRounded />
            </Badge>
          </IconButton>

          {/* User Profile */}
          <Box display="flex" alignItems="center" gap={1.2}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: "#DBEAFE",
                color: "#2563EB",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {userInitials}
            </Avatar>

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography fontSize={13} fontWeight={600}>
                {userName}
              </Typography>

              <Typography fontSize={11} color="text.secondary">
                {userRole}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;