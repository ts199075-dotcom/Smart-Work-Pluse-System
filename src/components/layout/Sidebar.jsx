
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
} from "@mui/material";

import {
  DashboardRounded,
  AccessTimeRounded,
  PaymentsRounded,
  AccountBalanceWalletRounded,
  WorkspacePremiumRounded,
  FolderRounded,
  NotificationsRounded,
  GroupsRounded,
  BusinessRounded,
  AssessmentRounded,
  SettingsRounded,
  AdminPanelSettingsRounded,
  EventNoteRounded,
  SecurityRounded,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";
import { getNavigationByRole, USER_ROLES } from "../../config/navigation";

const SIDEBAR_WIDTH = 248;

const iconMap = {
  Dashboard: DashboardRounded,
  "My Attendance": AccessTimeRounded,
  "My Overtime": EventNoteRounded,
  "My Payslip": PaymentsRounded,
  "Fines & Rewards": WorkspacePremiumRounded,
  "Projects & Tasks": FolderRounded,
  Notifications: NotificationsRounded,
  Projects: FolderRounded,
  Teams: GroupsRounded,
  Sprints: EventNoteRounded,
  Reports: AssessmentRounded,
  Employees: GroupsRounded,
  Attendance: AccessTimeRounded,
  Overtime: EventNoteRounded,
  Payroll: AccountBalanceWalletRounded,
  Leaves: EventNoteRounded,
  Users: GroupsRounded,
  "Roles & Permissions": SecurityRounded,
  "Company Settings": SettingsRounded,
  "Audit Logs": AdminPanelSettingsRounded,
};

const roleLabels = {
  [USER_ROLES.MEMBER]: "Member",
  [USER_ROLES.TEAM_LEADER]: "Team Leader",
  [USER_ROLES.HR]: "HR Officer",
  [USER_ROLES.ADMIN]: "Admin",
};

function Sidebar({
  role = USER_ROLES.MEMBER,
  variant = "permanent",
  mobileOpen = false,
  onClose = () => {},
}) {
  const navigationItems = getNavigationByRole(role);

  const isTemporary = variant === "temporary";

  return (
    <Drawer
      variant={variant}
      open={isTemporary ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#17365D",
          color: "#FFFFFF",
          border: "none",
          padding: "24px 16px",
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, px: 1 }}>
        <BusinessRounded
          sx={{ fontSize: 30, mr: 1.2, color: "#FFFFFF" }}
        />

        <Typography fontSize={17} fontWeight={700}>
          Smart WorkSpace
        </Typography>
      </Box>

      {/* Current Role */}
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "12px",
          mb: 3,
        }}
      >
        <Typography
          fontSize={10}
          color="rgba(255,255,255,0.65)"
          fontWeight={600}
          mb={0.5}
        >
          SIGNED IN AS
        </Typography>

        <Typography fontSize={13} fontWeight={600}>
          {roleLabels[role] || "Member"}
        </Typography>
      </Box>

      {/* Navigation */}
      <List disablePadding>
        {navigationItems.map((item) => {
          const Icon = iconMap[item.label] || DashboardRounded;

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={isTemporary ? onClose : undefined}
              sx={{
                borderRadius: "8px",
                mb: 0.7,
                minHeight: 40,
                color: "rgba(255,255,255,0.8)",
                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.16)",
                  color: "#FFFFFF",
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: "inherit",
                }}
              >
                {item.label === "Notifications" ? (
                  <Badge badgeContent={3} color="error">
                    <Icon fontSize="small" />
                  </Badge>
                ) : (
                  <Icon fontSize="small" />
                )}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography fontSize={13} fontWeight={500}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
