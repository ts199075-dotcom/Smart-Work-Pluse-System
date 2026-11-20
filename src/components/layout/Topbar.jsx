
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
  MenuRounded,
} from "@mui/icons-material";

import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getNavigationByRole } from "../../config/navigation";

const ROLE_LABELS = {
  member: "Member",
  "team-leader": "Team Leader",
  hr: "HR",
  admin: "Admin",
};

function Topbar({
  userName = "Sara Ahmed",
  role = "member",
  userInitials = "SA",
  onMenuClick,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = ROLE_LABELS[role] || role;

  const navigationItems = getNavigationByRole(role);

  const currentPage = navigationItems.find(
    (item) => item.path === location.pathname
  );

  const isProjectDetails =
    role === "team-leader" &&
    /^\/projects\/[^/]+$/.test(location.pathname);

  const pageTitle = isProjectDetails
    ? "Project Details"
    : currentPage?.label || "Dashboard";

  const hasNotifications = navigationItems.some(
    (item) => item.path === "/notifications"
  );

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

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
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Mobile Menu */}
          <IconButton
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#17365D",
              flexShrink: 0,
            }}
          >
            <MenuRounded />
          </IconButton>

          {/* Breadcrumbs */}
          <Box sx={{ minWidth: 0 }}>
            <Breadcrumbs
              separator={<NavigateNextRounded fontSize="small" />}
              sx={{
                "& .MuiBreadcrumbs-ol": {
                  flexWrap: "nowrap",
                },
              }}
            >
              <Link
                component={RouterLink}
                to="/dashboard"
                underline="hover"
                color="inherit"
                sx={{
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Workspace
              </Link>

              <Typography
                fontSize={12}
                fontWeight={600}
                color="text.primary"
                noWrap
              >
                {pageTitle}
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: { xs: 0.5, sm: 1, md: 2 },
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
              width: { sm: 150, md: 240 },
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
          {hasNotifications && (
            <IconButton
              onClick={handleNotificationsClick}
              aria-label="Open notifications"
              sx={{
                color: "#64748B",
                flexShrink: 0,
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsNoneRounded />
              </Badge>
            </IconButton>
          )}

          {/* Profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0, md: 1.2 },
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
