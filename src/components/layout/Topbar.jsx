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
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ minWidth: 0 }}>
          <Breadcrumbs
            separator={<NavigateNextRounded fontSize="small" />}
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ fontSize: 12 }}
            >
              Workspace
            </Link>

            <Typography fontSize={12} fontWeight={600} color="text.primary">
              {pageTitle}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: { xs: 1, md: 2 },
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              backgroundColor: "#F5F7FB",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              px: 1.5,
              width: { sm: 160, md: 240 },
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
            sx={{ color: "#64748B", flexShrink: 0 }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsNoneRounded />
            </Badge>
          </IconButton>

          {/* Profile */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.2,
              whiteSpace: "nowrap",
            }}
          >
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