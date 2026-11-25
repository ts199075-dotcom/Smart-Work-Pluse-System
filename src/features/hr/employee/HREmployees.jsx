import { useMemo, useState } from "react";

import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import People from "@mui/icons-material/People";
import Close from "@mui/icons-material/Close";

import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { useAppData } from "../../../hooks/useAppData";

const emptyEmployee = {
  name: "",
  email: "",
  phone: "",
  position: "",
  department: "IT",
  status: "Active",
  joinDate: "",
  role: "Member",
};

export default function HREmployees() {
  const { employees, setEmployees } = useAppData();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.position.toLowerCase().includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const onLeaveCount = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({ ...emptyEmployee });
    setDialogOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      status: employee.status,
      joinDate: employee.joinDate || "",
      role: employee.role || "Member",
    });

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
    setFormData({ ...emptyEmployee });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveEmployee = () => {
    const trimmedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !formData.position.trim()) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }

    const emailAlreadyExists = employees.some(
      (employee) =>
        employee.email.toLowerCase() === normalizedEmail &&
        employee.id !== editingEmployee?.id
    );

    if (emailAlreadyExists) {
      showNotification("This email address is already registered.", "error");
      return;
    }

    const employeeData = {
      ...formData,
      name: trimmedName,
      email: normalizedEmail,
      position: formData.position.trim(),
    };

    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...employeeData }
            : employee
        )
      );

      showNotification("Employee updated successfully.");
    } else {
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
      };

      setEmployees((previous) => [...previous, newEmployee]);

      showNotification("Employee added successfully.");
    }

    handleCloseDialog();
  };

  const handleDeleteEmployee = (id) => {
    const employee = employees.find((item) => item.id === id);

    if (!employee) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== id)
    );

    showNotification("Employee deleted successfully.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "On Leave":
        return "warning";
      case "Inactive":
        return "default";
      default:
        return "default";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "HR":
        return "secondary";
      case "Team Leader":
        return "primary";
      default:
        return "default";
    }
  };

  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    height: "100%",
  };

  return (
    <Box
      sx={{ pb: 4 }}
    >
            <PageHeader
        title="Employees"
        subtitle="Manage your company employees and their information."
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: 2, px: 2.5, py: 1.1, textTransform: "none", fontWeight: 700, boxShadow: "none" }}
          >
            Add Employee
          </Button>
        }
      />

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
        {[
          { title: "Total Employees", value: employees.length, color: "#2563EB", bgColor: "#EFF6FF", description: "All registered employees" },
          { title: "Active Employees", value: activeCount, color: "#16A34A", bgColor: "#F0FDF4", description: "Currently working" },
          { title: "On Leave", value: onLeaveCount, color: "#D97706", bgColor: "#FFFBEB", description: "Currently on leave" },
          { title: "Inactive", value: inactiveCount, color: "#64748B", bgColor: "#F1F5F9", description: "Inactive employees" },
        ].map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.description}
            icon={<People />}
            color={item.color}
            bgColor={item.bgColor}
          />
        ))}
      </Box>

      {/* Employees Table */}
      <Paper
        sx={{
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={700} color="#172B4D">
            Employee Directory
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 2.5 }}
          >
            View and manage all employees in your organization.
          </Typography>

          {/* Filters */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email or position..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Department"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <MenuItem value="All">All Departments</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Divider />

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Join Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "#DBEAFE",
                            color: "#2563EB",
                            fontWeight: 700,
                          }}
                        >
                          {employee.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={600} color="#172B4D">
                            {employee.name}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {employee.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.phone || "—"}</TableCell>
                    <TableCell>{employee.joinDate || "—"}</TableCell>

                    <TableCell>
                      <Chip
                        label={employee.role || "Member"}
                        color={getRoleColor(employee.role || "Member")}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(employee)}
                          title="Edit employee"
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          title="Delete employee"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <People sx={{ fontSize: 42, color: "#94A3B8", mb: 1 }} />

                    <Typography color="text.secondary">
                      No employees found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredEmployees.length} of {employees.length} employees
          </Typography>
        </Box>
      </Paper>

      {/* Add / Edit Employee Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </Typography>

            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              required
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />

            <TextField
              select
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="System Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Team Leader">Team Leader</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Join Date"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveEmployee}
            sx={{
              backgroundColor: "#2563EB",
              textTransform: "none",
              px: 3,
            }}
          >
            {editingEmployee ? "Save Changes" : "Add Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          onClose={() =>
            setNotification((previous) => ({
              ...previous,
              open: false,
            }))
          }
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}