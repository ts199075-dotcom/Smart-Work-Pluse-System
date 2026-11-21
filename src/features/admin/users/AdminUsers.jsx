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

const ROLES = [
  { value: "member", label: "Member" },
  { value: "team-leader", label: "Team Leader" },
  { value: "hr", label: "HR" },
  { value: "admin", label: "Admin" },
];

const initialUsers = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed@smartwork.com",
    role: "member",
    department: "Development",
    status: "Active",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara@smartwork.com",
    role: "team-leader",
    department: "Development",
    status: "Active",
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    email: "mohamed@smartwork.com",
    role: "admin",
    department: "Management",
    status: "Active",
  },
  {
    id: 4,
    name: "Mariam Adel",
    email: "mariam@smartwork.com",
    role: "hr",
    department: "Human Resources",
    status: "Active",
  },
  {
    id: 5,
    name: "Omar Khaled",
    email: "omar@smartwork.com",
    role: "member",
    department: "Development",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Sara Ali",
    email: "sara.ali@smartwork.com",
    role: "team-leader",
    department: "Marketing",
    status: "Active",
  },
  {
    id: 7,
    name: "Mona Ahmed",
    email: "mona@smartwork.com",
    role: "member",
    department: "Finance",
    status: "Active",
  },
  {
    id: 8,
    name: "Youssef Adel",
    email: "youssef@smartwork.com",
    role: "member",
    department: "Design",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  email: "",
  role: "member",
  department: "",
  status: "Active",
};

const getRoleLabel = (role) =>
  ROLES.find((item) => item.value === role)?.label || role;

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "error";
    case "hr":
      return "secondary";
    case "team-leader":
      return "info";
    default:
      return "default";
  }
};

function StatCard({ title, value, subtitle, icon, color, bgColor }) {
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
          <Typography color="text.secondary" fontSize={13} fontWeight={600}>
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

          <Typography fontSize={11} color="text.secondary" sx={{ mt: 0.8 }}>
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

function UserDialog({ open, onClose, onSave, editingUser, users }) {
  const [form, setForm] = useState(() =>
    editingUser ? { ...editingUser } : { ...emptyForm }
  );

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required";
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== editingUser?.id
    );

    if (emailExists) {
      newErrors.email = "This email is already registered";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      department: form.department.trim(),
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
            <Typography fontSize={19} fontWeight={800} color="#17365D">
              {editingUser ? "Edit User" : "Add New User"}
            </Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
              {editingUser
                ? "Update the user's information."
                : "Enter the details of the new user."}
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
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
          >
            {ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>

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
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
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

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const adminUsers = users.filter((user) => user.role === "admin").length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.department.toLowerCase().includes(search);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      setUsers((previous) => [
        {
          ...userData,
          id: Math.max(0, ...previous.map((user) => user.id)) + 1,
        },
        ...previous,
      ]);
    }

    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (userId) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers((previous) =>
      previous.filter((user) => user.id !== selectedUser.id)
    );

    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ pb: 4 }}>
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
            Users Management
          </Typography>

          <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.7 }}>
            Manage company accounts, roles, and user access status.
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
          subtitle="All registered accounts"
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
          subtitle="Disabled accounts"
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
            <Typography fontSize={17} fontWeight={700} color="#17365D">
              All Users
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={12}
              sx={{ mt: 0.5 }}
            >
              View and manage all company accounts.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
                    <SearchRounded fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
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
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
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

        <Typography fontSize={12} color="text.secondary" sx={{ mb: 1.5 }}>
          Showing {filteredUsers.length} of {totalUsers} users
        </Typography>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {["User", "Role", "Department", "Status", "Actions"].map(
                  (heading) => (
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
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
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
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </Avatar>

                        <Box>
                          <Typography
                            fontSize={13}
                            fontWeight={700}
                            color="#17365D"
                          >
                            {user.name}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
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
                      <Typography fontSize={12} color="text.secondary">
                        {user.department}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === "Active" ? "success" : "default"}
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
                            onClick={() => handleOpenEdit(user)}
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
                            onClick={() => handleToggleStatus(user.id)}
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

                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(user)}
                            sx={{ color: "#DC2626" }}
                          >
                            <DeleteOutlineRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <PeopleAltOutlined
                      sx={{
                        fontSize: 35,
                        color: "#CBD5E1",
                        mb: 1,
                      }}
                    />

                    <Typography fontSize={13} color="text.secondary">
                      No users found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <UserDialog
        key={`${editingUser?.id ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
        users={users}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography fontWeight={800} color="#17365D" fontSize={18}>
            Delete User
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography fontSize={14} color="text.secondary">
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.name}</strong>? This action cannot be undone.
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
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}