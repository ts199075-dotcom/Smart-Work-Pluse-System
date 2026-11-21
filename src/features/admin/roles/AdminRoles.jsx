import { useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  AdminPanelSettingsOutlined,
  GroupsOutlined,
  PersonOutlineRounded,
  BadgeOutlined,
  SecurityOutlined,
  SaveOutlined,
  RestartAltRounded,
  LockOutlined,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";

const roles = [
  {
    id: "member",
    name: "Member",
    description: "Access personal information, tasks, and attendance.",
    icon: <PersonOutlineRounded />,
    color: "#2563EB",
    bg: "#EFF6FF",
    users: 120,
  },
  {
    id: "team-leader",
    name: "Team Leader",
    description: "Manage projects, teams, tasks, and performance.",
    icon: <GroupsOutlined />,
    color: "#0891B2",
    bg: "#ECFEFF",
    users: 12,
  },
  {
    id: "hr",
    name: "HR",
    description: "Manage employees, attendance, payroll, and leaves.",
    icon: <BadgeOutlined />,
    color: "#7C3AED",
    bg: "#F5F3FF",
    users: 5,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Full access to company system management.",
    icon: <AdminPanelSettingsOutlined />,
    color: "#DC2626",
    bg: "#FEF2F2",
    users: 2,
  },
];

const permissionGroups = [
  {
    title: "Dashboard & General",
    permissions: [
      { id: "view-dashboard", label: "View Dashboard" },
      { id: "view-notifications", label: "View Notifications" },
    ],
  },
  {
    title: "Projects & Tasks",
    permissions: [
      { id: "view-projects", label: "View Projects" },
      { id: "manage-projects", label: "Manage Projects" },
      { id: "view-tasks", label: "View Tasks" },
      { id: "manage-tasks", label: "Manage Tasks" },
      { id: "view-reports", label: "View Reports" },
    ],
  },
  {
    title: "Employees & Attendance",
    permissions: [
      { id: "view-employees", label: "View Employees" },
      { id: "manage-employees", label: "Manage Employees" },
      { id: "view-attendance", label: "View Attendance" },
      { id: "manage-attendance", label: "Manage Attendance" },
      { id: "manage-leaves", label: "Manage Leaves" },
    ],
  },
  {
    title: "Payroll & Finance",
    permissions: [
      { id: "view-payroll", label: "View Payroll" },
      { id: "manage-payroll", label: "Manage Payroll" },
      { id: "manage-fines-rewards", label: "Manage Fines & Rewards" },
    ],
  },
  {
    title: "System Administration",
    permissions: [
      { id: "manage-users", label: "Manage Users" },
      { id: "manage-roles", label: "Manage Roles & Permissions" },
      { id: "manage-settings", label: "Manage Company Settings" },
      { id: "view-audit-logs", label: "View Audit Logs" },
    ],
  },
];

const createInitialPermissions = () => ({
  member: {
    "view-dashboard": true,
    "view-notifications": true,
    "view-projects": true,
    "manage-projects": false,
    "view-tasks": true,
    "manage-tasks": false,
    "view-reports": false,
    "view-employees": false,
    "manage-employees": false,
    "view-attendance": true,
    "manage-attendance": false,
    "manage-leaves": false,
    "view-payroll": true,
    "manage-payroll": false,
    "manage-fines-rewards": false,
    "manage-users": false,
    "manage-roles": false,
    "manage-settings": false,
    "view-audit-logs": false,
  },
  "team-leader": {
    "view-dashboard": true,
    "view-notifications": true,
    "view-projects": true,
    "manage-projects": true,
    "view-tasks": true,
    "manage-tasks": true,
    "view-reports": true,
    "view-employees": true,
    "manage-employees": false,
    "view-attendance": true,
    "manage-attendance": false,
    "manage-leaves": false,
    "view-payroll": false,
    "manage-payroll": false,
    "manage-fines-rewards": false,
    "manage-users": false,
    "manage-roles": false,
    "manage-settings": false,
    "view-audit-logs": false,
  },
  hr: {
    "view-dashboard": true,
    "view-notifications": true,
    "view-projects": false,
    "manage-projects": false,
    "view-tasks": false,
    "manage-tasks": false,
    "view-reports": true,
    "view-employees": true,
    "manage-employees": true,
    "view-attendance": true,
    "manage-attendance": true,
    "manage-leaves": true,
    "view-payroll": true,
    "manage-payroll": true,
    "manage-fines-rewards": true,
    "manage-users": false,
    "manage-roles": false,
    "manage-settings": false,
    "view-audit-logs": false,
  },
  admin: Object.fromEntries(
    permissionGroups
      .flatMap((group) => group.permissions)
      .map((permission) => [permission.id, true])
  ),
});

const initialPermissions = createInitialPermissions();

function RoleCard({ role, selected, onClick }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2.2,
        borderRadius: 3,
        border: selected
          ? `2px solid ${role.color}`
          : "1px solid #E8EDF5",
        cursor: "pointer",
        transition: "all 0.2s ease",
        bgcolor: selected ? role.bg : "#FFFFFF",
        "&:hover": {
          borderColor: role.color,
          transform: "translateY(-3px)",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          sx={{
            bgcolor: role.bg,
            color: role.color,
            width: 46,
            height: 46,
            borderRadius: 2.5,
          }}
        >
          {role.icon}
        </Avatar>

        {selected && (
          <CheckCircleOutlineRounded
            sx={{ color: role.color, fontSize: 21 }}
          />
        )}
      </Stack>

      <Typography
        fontWeight={800}
        fontSize={16}
        color="#17365D"
        sx={{ mt: 2 }}
      >
        {role.name}
      </Typography>

      <Typography
        fontSize={12}
        color="text.secondary"
        sx={{ mt: 0.7, minHeight: 38 }}
      >
        {role.description}
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      <Typography fontSize={12} color="text.secondary">
        <strong>{role.users}</strong> assigned users
      </Typography>
    </Paper>
  );
}

export default function AdminRoles() {
  const [selectedRole, setSelectedRole] = useState("member");

  const [permissions, setPermissions] = useState(initialPermissions);

  const [savedPermissions, setSavedPermissions] = useState(
    initialPermissions
  );

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentRole = roles.find((role) => role.id === selectedRole);

  const isAdmin = selectedRole === "admin";

  const enabledCount = Object.values(
    permissions[selectedRole]
  ).filter(Boolean).length;

  const totalCount = Object.keys(
    permissions[selectedRole]
  ).length;

  const handleTogglePermission = (permissionId) => {
    if (isAdmin) return;

    setPermissions((previous) => ({
      ...previous,
      [selectedRole]: {
        ...previous[selectedRole],
        [permissionId]: !previous[selectedRole][permissionId],
      },
    }));
  };

  const handleSave = () => {
    setSavedPermissions((previous) => ({
      ...previous,
      [selectedRole]: { ...permissions[selectedRole] },
    }));

    setNotification({
      open: true,
      message: `${currentRole.name} permissions saved successfully.`,
      severity: "success",
    });
  };

  const handleReset = () => {
    setPermissions((previous) => ({
      ...previous,
      [selectedRole]: { ...savedPermissions[selectedRole] },
    }));

    setNotification({
      open: true,
      message: "Changes have been reset.",
      severity: "info",
    });
  };

  const handleCloseNotification = () => {
    setNotification((previous) => ({
      ...previous,
      open: false,
    }));
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            color="#17365D"
            sx={{ fontSize: { xs: 24, md: 30 } }}
          >
            Roles & Permissions
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={14}
            sx={{ mt: 0.7 }}
          >
            Control what each role can access and manage in the system.
          </Typography>
        </Box>

        <Chip
          icon={<SecurityOutlined />}
          label="Access Control"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 2 }}
        />
      </Stack>

      {/* Roles */}
      <Typography
        fontSize={17}
        fontWeight={800}
        color="#17365D"
        sx={{ mb: 1.8 }}
      >
        System Roles
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3.5,
        }}
      >
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            selected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
          />
        ))}
      </Box>

      {/* Permissions */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E8EDF5",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor: currentRole.bg,
                    color: currentRole.color,
                    width: 38,
                    height: 38,
                  }}
                >
                  {currentRole.icon}
                </Avatar>

                <Box>
                  <Typography
                    fontSize={17}
                    fontWeight={800}
                    color="#17365D"
                  >
                    {currentRole.name} Permissions
                  </Typography>

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                  >
                    Configure access for this role.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Chip
              label={`${enabledCount} / ${totalCount} Permissions Enabled`}
              color={isAdmin ? "error" : "primary"}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          {isAdmin && (
            <Alert
              severity="info"
              icon={<LockOutlined />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Admin has full system access. These permissions are locked
              to protect system administration.
            </Alert>
          )}
        </Box>

        <Divider />

        {permissionGroups.map((group, groupIndex) => (
          <Box key={group.title}>
            <Box
              sx={{
                px: { xs: 2, md: 2.5 },
                py: 1.7,
                bgcolor: "#F8FAFC",
              }}
            >
              <Typography
                fontSize={13}
                fontWeight={800}
                color="#17365D"
              >
                {group.title}
              </Typography>
            </Box>

            {group.permissions.map((permission) => {
              const enabled =
                permissions[selectedRole][permission.id];

              return (
                <Box
                  key={permission.id}
                  sx={{
                    px: { xs: 2, md: 2.5 },
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <Box>
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                      color="#334155"
                    >
                      {permission.label}
                    </Typography>

                    <Typography
                      fontSize={11}
                      color="text.secondary"
                      sx={{ mt: 0.3 }}
                    >
                      {enabled ? "Access enabled" : "Access disabled"}
                    </Typography>
                  </Box>

                  <Switch
                    checked={Boolean(enabled)}
                    onChange={() =>
                      handleTogglePermission(permission.id)
                    }
                    disabled={isAdmin}
                    color="primary"
                  />
                </Box>
              );
            })}

            {groupIndex < permissionGroups.length - 1 && <Divider />}
          </Box>
        ))}

        {/* Actions */}
        <Divider />

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="flex-end"
          spacing={1.5}
          sx={{ p: 2.5, bgcolor: "#FCFDFF" }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltRounded />}
            onClick={handleReset}
            disabled={isAdmin}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Reset Changes
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={handleSave}
            disabled={isAdmin}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}