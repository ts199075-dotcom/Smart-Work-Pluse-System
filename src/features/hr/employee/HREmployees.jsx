
import { useMemo, useState } from "react";

import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import People from "@mui/icons-material/People";
import Close from "@mui/icons-material/Close";

import {
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

const initialEmployees = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed@smartwork.com",
    phone: "01012345678",
    position: "Frontend Developer",
    department: "IT",
    status: "Active",
    joinDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Sara Ali",
    email: "sara@smartwork.com",
    phone: "01112345678",
    position: "HR Specialist",
    department: "HR",
    status: "Active",
    joinDate: "2025-03-10",
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar@smartwork.com",
    phone: "01212345678",
    position: "Backend Developer",
    department: "IT",
    status: "Active",
    joinDate: "2025-04-20",
  },
  {
    id: 4,
    name: "Mariam Samir",
    email: "mariam@smartwork.com",
    phone: "01512345678",
    position: "Accountant",
    department: "Finance",
    status: "On Leave",
    joinDate: "2024-11-05",
  },
  {
    id: 5,
    name: "Youssef Adel",
    email: "youssef@smartwork.com",
    phone: "01098765432",
    position: "UI/UX Designer",
    department: "Design",
    status: "Inactive",
    joinDate: "2024-08-12",
  },
];

const emptyEmployee = {
  name: "",
  email: "",
  phone: "",
  position: "",
  department: "IT",
  status: "Active",
  joinDate: "",
};

export default function HREmployees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);

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
      joinDate: employee.joinDate,
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
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.position.trim()
    ) {
      return;
    }

    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...formData }
            : employee
        )
      );
    } else {
      const newEmployee = {
        ...formData,
        id: Date.now(),
      };

      setEmployees((previous) => [...previous, newEmployee]);
    }

    handleCloseDialog();
  };

  const handleDeleteEmployee = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmed) {
      setEmployees((previous) =>
        previous.filter((employee) => employee.id !== id)
      );
    }
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

  const cardStyle = {
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    height: "100%",
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#172B4D">
            Employees
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your company employees and their information.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: "#2563EB",
            borderRadius: "10px",
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          Add Employee
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
        {[
          {
            title: "Total Employees",
            value: employees.length,
            color: "#2563EB",
            description: "All registered employees",
          },
          {
            title: "Active Employees",
            value: activeCount,
            color: "#16A34A",
            description: "Currently working",
          },
          {
            title: "On Leave",
            value: onLeaveCount,
            color: "#D97706",
            description: "Currently on leave",
          },
          {
            title: "Inactive",
            value: inactiveCount,
            color: "#64748B",
            description: "Inactive employees",
          },
        ].map((item) => (
          <Card key={item.title} sx={cardStyle}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography color="text.secondary" fontWeight={600}>
                  {item.title}
                </Typography>
                <People sx={{ color: item.color, fontSize: 26 }} />
              </Stack>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: item.color, my: 1 }}
              >
                {item.value}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
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
          <Table sx={{ minWidth: 850 }}>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Join Date</TableCell>
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
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.joinDate || "—"}</TableCell>

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
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
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
    </Box>
  );
}
