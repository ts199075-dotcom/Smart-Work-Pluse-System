/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  PeopleAltOutlined,
  PersonAddAlt1Outlined,
  AdminPanelSettingsOutlined,
  PersonOffOutlined,
  SearchRounded,
  EditOutlined,
  DeleteOutlineRounded,
  CheckCircleOutlineRounded,
  BlockOutlined,
  CloseRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";


// ==============================
// Constants
// ==============================

const ROLES = [
  { value: "member", label: "Member" },
  { value: "team-leader", label: "Team Leader" },
  { value: "hr", label: "HR" },
  { value: "admin", label: "Admin" },
];

const ROLE_MAPPING = {
  member: "Member",
  "team-leader": "Team Leader",
  hr: "HR",
  admin: "Admin",
};

const ROLE_REVERSE_MAPPING = {
  Member: "member",
  "Team Leader": "team-leader",
  HR: "hr",
  Admin: "admin",
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  position: "",
  role: "member",
  department: "",
  status: "Active",
};

const getRoleLabel = (role) =>
  ROLES.find((item) => item.value === role)?.label ||
  ROLE_REVERSE_MAPPING[role] ||
  role;

const getRoleValue = (role) =>
  ROLE_REVERSE_MAPPING[role] || role || "member";

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
    case "Admin":
      return "error";

    case "hr":
    case "HR":
      return "secondary";

    case "team-leader":
    case "Team Leader":
      return "info";

    default:
      return "default";
  }
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const getLocalDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getProjectMemberIds = (project) => {
  const members =
    project.membersIds ??
    project.memberIds ??
    project.memberId ??
    [];

  if (Array.isArray(members)) return members;

  return members ? [members] : [];
};

// ==============================
// Statistics Card
// ==============================

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  bgColor,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #E8EDF5",
        height: "100%",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography
            color="text.secondary"
            fontSize={13}
            fontWeight={600}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            color="#17365D"
            sx={{ mt: 1 }}
          >
            {value}
          </Typography>

          <Typography
            fontSize={11}
            color="text.secondary"
            sx={{ mt: 0.8 }}
          >
            {subtitle}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: bgColor,
            color,
            width: 48,
            height: 48,
            borderRadius: 2.5,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

// ==============================
// User Dialog
// ==============================

function UserDialog({
  open,
  onClose,
  onSave,
  editingUser,
  users,
  isProjectLeader,
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(editingUser
      ? {
          ...editingUser,
          role: getRoleValue(editingUser.role),
          phone: editingUser.phone || "",
          position: editingUser.position || "",
        }
      : {}),
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
          form.email.trim().toLowerCase() &&
        user.id !== editingUser?.id
    );

    if (emailExists) {
      newErrors.email = "This email is already registered";
    }

    if (
      isProjectLeader &&
      form.role !== "team-leader"
    ) {
      newErrors.role =
        "A project leader must have the Team Leader role";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const selectedRole = ROLE_MAPPING[form.role];

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      role: selectedRole,
      position: form.position.trim() || selectedRole,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              fontSize={19}
              fontWeight={800}
              color="#17365D"
            >
              {editingUser ? "Edit User" : "Add New User"}
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {editingUser
                ? "Update the employee's information."
                : "Enter the details of the new employee."}
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small">
            <CloseRounded />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.2}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            disabled={isProjectLeader}
            error={Boolean(errors.role)}
            helperText={
              errors.role ||
              (isProjectLeader
                ? "This employee is currently leading a project."
                : "")
            }
          >
            {ROLES.map((role) => (
              <MenuItem
                key={role.value}
                value={role.value}
              >
                {role.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Job Position"
            name="position"
            value={form.position}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.department)}
            helperText={errors.department}
          />

          <TextField
            select
            label="Account Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {editingUser ? "Save Changes" : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================
// Main Component
// ==============================

export default function AdminUsers() {
  const {
    employees,
    setEmployees,
    projects,
    setProjects,
    attendance,
    setAttendance,
  } = useAppData();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ==============================
  // Statistics
  // ==============================

  const totalUsers = employees.length;

  const activeUsers = employees.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = employees.filter(
    (user) => user.status === "Inactive"
  ).length;

  const adminUsers = employees.filter(
    (user) => user.role === "Admin"
  ).length;

  // ==============================
  // Project Leader Check
  // ==============================

  const isProjectLeader = (userId) =>
    projects.some(
      (project) => project.leaderId === userId
    );

  // ==============================
  // Search and Filters
  // ==============================

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return employees.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.department || "")
          .toLowerCase()
          .includes(search) ||
        (user.position || "")
          .toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        getRoleValue(user.role) === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  // ==============================
  // Add User
  // ==============================

  const handleOpenAdd = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  // ==============================
  // Edit User
  // ==============================

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  // ==============================
  // Save User
  // ==============================

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingUser.id
            ? {
                ...employee,
                ...userData,
              }
            : employee
        )
      );

      setSnackbar({
        open: true,
        message: "Employee information updated successfully.",
        severity: "success",
      });
    } else {
      setEmployees((previous) => {
        const newId =
          Math.max(
            0,
            ...previous.map((employee) => employee.id)
          ) + 1;

        return [
          {
            ...userData,
            id: newId,
            joinDate: getLocalDate(),
          },
          ...previous,
        ];
      });

      setSnackbar({
        open: true,
        message: "New employee added successfully.",
        severity: "success",
      });
    }

    setDialogOpen(false);
    setEditingUser(null);
  };

  // ==============================
  // Toggle User Status
  // ==============================

  const handleToggleStatus = (userId) => {
    const user = employees.find(
      (employee) => employee.id === userId
    );

    if (!user) return;

    const newStatus =
      user.status === "Active" ? "Inactive" : "Active";

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === userId
          ? {
              ...employee,
              status: newStatus,
            }
          : employee
      )
    );

    setSnackbar({
      open: true,
      message: `${user.name} is now ${newStatus}.`,
      severity: "success",
    });
  };

  // ==============================
  // Delete User
  // ==============================

  const handleOpenDelete = (user) => {
    if (isProjectLeader(user.id)) {
      setSnackbar({
        open: true,
        message:
          "Reassign this employee's project leadership before deleting the account.",
        severity: "warning",
      });

      return;
    }

    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    const userId = selectedUser.id;

    // Remove employee
    setEmployees((previous) =>
      previous.filter(
        (employee) => employee.id !== userId
      )
    );

    // Remove employee from projects and task assignments
    setProjects((previous) =>
      previous.map((project) => {
        const updatedMembers =
          getProjectMemberIds(project).filter(
            (memberId) => memberId !== userId
          );

        return {
          ...project,
          membersIds: updatedMembers,
          memberId: updatedMembers,
          tasks: (project.tasks || []).map((task) =>
            task.assignedToId === userId
              ? {
                  ...task,
                  assignedToId: null,
                }
              : task
          ),
        };
      })
    );

    // Remove employee attendance records
    setAttendance((previous) =>
      previous.filter(
        (record) => record.employeeId !== userId
      )
    );

    setDeleteDialogOpen(false);
    setSelectedUser(null);

    setSnackbar({
      open: true,
      message: "Employee deleted successfully.",
      severity: "success",
    });
  };

  // ==============================
  // Render
  // ==============================

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
            sx={{
              fontSize: { xs: 24, md: 30 },
            }}
          >
            Users Management
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={14}
            sx={{ mt: 0.7 }}
          >
            Manage company employees, roles, and account status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Outlined />}
          onClick={handleOpenAdd}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          Add New User
        </Button>
      </Stack>

      {/* Statistics */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle="All registered employees"
          icon={<PeopleAltOutlined />}
          color="#2563EB"
          bgColor="#EFF6FF"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          subtitle="Currently active accounts"
          icon={<CheckCircleOutlineRounded />}
          color="#16A34A"
          bgColor="#F0FDF4"
        />

        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          subtitle="Inactive accounts"
          icon={<PersonOffOutlined />}
          color="#D97706"
          bgColor="#FFFBEB"
        />

        <StatCard
          title="Administrators"
          value={adminUsers}
          subtitle="Accounts with Admin role"
          icon={<AdminPanelSettingsOutlined />}
          color="#7C3AED"
          bgColor="#F5F3FF"
        />
      </Box>

      {/* Users Table */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: "1px solid #E8EDF5",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography
              fontSize={17}
              fontWeight={700}
              color="#17365D"
            >
              All Users
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={12}
              sx={{ mt: 0.5 }}
            >
              View and manage all company employees.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
          >
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              sx={{
                minWidth: { xs: "100%", sm: 210 },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              sx={{
                minWidth: 135,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="All">All Roles</MenuItem>

              {ROLES.map((role) => (
                <MenuItem
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              sx={{
                minWidth: 135,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Typography
          fontSize={12}
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Showing {filteredUsers.length} of {totalUsers} users
        </Typography>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {[
                  "User",
                  "Role",
                  "Department",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#64748B",
                      borderBottom: "none",
                      py: 1.8,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const projectLeader =
                    isProjectLeader(user.id);

                  return (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell sx={{ py: 1.8 }}>
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: "#EFF6FF",
                              color: "#2563EB",
                              fontSize: 14,
                              fontWeight: 700,
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>

                          <Box>
                            <Typography
                              fontSize={13}
                              fontWeight={700}
                              color="#17365D"
                            >
                              {user.name}
                            </Typography>

                            <Typography
                              fontSize={11}
                              color="text.secondary"
                            >
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          size="small"
                          color={getRoleColor(user.role)}
                          variant="outlined"
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                        >
                          {user.department || "Unassigned"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={
                            user.status === "Active"
                              ? "success"
                              : "default"
                          }
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            minWidth: 75,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <Tooltip title="Edit User">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleOpenEdit(user)
                              }
                              sx={{ color: "#2563EB" }}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              user.status === "Active"
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleToggleStatus(user.id)
                              }
                              sx={{
                                color:
                                  user.status === "Active"
                                    ? "#D97706"
                                    : "#16A34A",
                              }}
                            >
                              {user.status === "Active" ? (
                                <BlockOutlined fontSize="small" />
                              ) : (
                                <CheckCircleOutlineRounded fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              projectLeader
                                ? "Reassign project leadership before deleting"
                                : "Delete User"
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                disabled={projectLeader}
                                onClick={() =>
                                  handleOpenDelete(user)
                                }
                                sx={{
                                  color: "#DC2626",
                                  "&.Mui-disabled": {
                                    color: "#CBD5E1",
                                  },
                                }}
                              >
                                <DeleteOutlineRounded fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <PeopleAltOutlined
                      sx={{
                        fontSize: 35,
                        color: "#CBD5E1",
                        mb: 1,
                      }}
                    />

                    <Typography
                      fontSize={13}
                      color="text.secondary"
                    >
                      No users found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Dialog */}

      <UserDialog
        key={`${editingUser?.id ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
        users={employees}
        isProjectLeader={
          editingUser
            ? isProjectLeader(editingUser.id)
            : false
        }
      />

      {/* Delete Confirmation */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Typography
            fontWeight={800}
            color="#17365D"
            fontSize={18}
          >
            Delete Employee
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography
            fontSize={14}
            color="text.secondary"
          >
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.name}</strong>?

            <br />

            This will also remove their attendance records,
            project memberships, and task assignments.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            color="inherit"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteUser}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Delete Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}