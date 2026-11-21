
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AccessTime from "@mui/icons-material/AccessTime";
import People from "@mui/icons-material/People";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";

const initialAttendance = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    department: "IT",
    position: "Software Developer",
    checkIn: "08:45 AM",
    checkOut: "05:00 PM",
    hours: "8h 15m",
    status: "Present",
  },
  {
    id: 2,
    name: "Omar Ali",
    department: "HR",
    position: "HR Specialist",
    checkIn: "09:20 AM",
    checkOut: "05:00 PM",
    hours: "7h 40m",
    status: "Late",
  },
  {
    id: 3,
    name: "Sara Hassan",
    department: "Finance",
    position: "Accountant",
    checkIn: "08:30 AM",
    checkOut: "04:30 PM",
    hours: "8h",
    status: "Present",
  },
  {
    id: 4,
    name: "Mahmoud Samir",
    department: "Sales",
    position: "Sales Representative",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "Absent",
  },
  {
    id: 5,
    name: "Mariam Adel",
    department: "Marketing",
    position: "Marketing Specialist",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "On Leave",
  },
  {
    id: 6,
    name: "Youssef Ibrahim",
    department: "IT",
    position: "UI/UX Designer",
    checkIn: "08:55 AM",
    checkOut: "05:10 PM",
    hours: "8h 15m",
    status: "Present",
  },
  {
    id: 7,
    name: "Nour Tarek",
    department: "Operations",
    position: "Operations Officer",
    checkIn: "09:15 AM",
    checkOut: "05:00 PM",
    hours: "7h 45m",
    status: "Late",
  },
];

const statusColors = {
  Present: { color: "success", label: "Present" },
  Late: { color: "warning", label: "Late" },
  Absent: { color: "error", label: "Absent" },
  "On Leave": { color: "info", label: "On Leave" },
};

export default function HRAttendance() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter(
      (item) => item.status === "Present"
    ).length;
    const late = attendance.filter(
      (item) => item.status === "Late"
    ).length;
    const absent = attendance.filter(
      (item) => item.status === "Absent"
    ).length;
    const onLeave = attendance.filter(
      (item) => item.status === "On Leave"
    ).length;

    return { total, present, late, absent, onLeave };
  }, [attendance]);

  const filteredAttendance = attendance.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All" ||
      item.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleStatusChange = (id, newStatus) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const statCards = [
    {
      title: "Total Employees",
      value: stats.total,
      icon: <People />,
      color: "#6366f1",
    },
    {
      title: "Present",
      value: stats.present,
      icon: <CheckCircle />,
      color: "#22c55e",
    },
    {
      title: "Late",
      value: stats.late,
      icon: <AccessTime />,
      color: "#f59e0b",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: <Cancel />,
      color: "#ef4444",
    },
    {
      title: "On Leave",
      value: stats.onLeave,
      icon: <CalendarMonth />,
      color: "#06b6d4",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Attendance
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Manage employee attendance and working hours
          </Typography>
        </Box>

        <TextField
          type="date"
          size="small"
          defaultValue={today}
          sx={{ minWidth: 180 }}
        />
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {card.value}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: `${card.color}18`,
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="All">All Departments</MenuItem>
                {[...new Set(attendance.map((item) => item.department))].map(
                  (department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Attendance Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Attendance Records
          </Typography>

          <Chip
            label={`${filteredAttendance.length} Employees`}
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAttendance.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#6366f1",
                          fontSize: 13,
                        }}
                      >
                        {employee.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </Avatar>

                      <Box>
                        <Typography fontWeight={600} variant="body2">
                          {employee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.position}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.checkIn}</TableCell>
                  <TableCell>{employee.checkOut}</TableCell>
                  <TableCell>{employee.hours}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={statusColors[employee.status].label}
                      color={statusColors[employee.status].color}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      title="Change attendance status"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>

                    <TextField
                      select
                      size="small"
                      value={employee.status}
                      onChange={(e) =>
                        handleStatusChange(employee.id, e.target.value)
                      }
                      sx={{ width: 115, ml: 1 }}
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Late">Late</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                      <MenuItem value="On Leave">On Leave</MenuItem>
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}

              {filteredAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No attendance records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
