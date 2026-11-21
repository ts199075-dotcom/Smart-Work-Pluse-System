
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import AccessTime from "@mui/icons-material/AccessTime";
import CheckCircle from "@mui/icons-material/CheckCircle";
import PendingActions from "@mui/icons-material/PendingActions";
import Search from "@mui/icons-material/Search";

const initialRequests = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    department: "IT",
    date: "2026-11-21",
    start: "05:00 PM",
    end: "08:00 PM",
    hours: 3,
    reason: "System maintenance",
    status: "Pending",
  },
  {
    id: 2,
    name: "Sara Hassan",
    department: "Finance",
    date: "2026-11-20",
    start: "04:30 PM",
    end: "06:30 PM",
    hours: 2,
    reason: "Monthly financial reports",
    status: "Approved",
  },
  {
    id: 3,
    name: "Omar Ali",
    department: "HR",
    date: "2026-11-19",
    start: "05:00 PM",
    end: "07:00 PM",
    hours: 2,
    reason: "Employee records update",
    status: "Rejected",
  },
  {
    id: 4,
    name: "Youssef Ibrahim",
    department: "IT",
    date: "2026-11-21",
    start: "06:00 PM",
    end: "09:00 PM",
    hours: 3,
    reason: "Project deadline",
    status: "Pending",
  },
  {
    id: 5,
    name: "Mariam Adel",
    department: "Marketing",
    date: "2026-11-18",
    start: "04:00 PM",
    end: "07:00 PM",
    hours: 3,
    reason: "Campaign preparation",
    status: "Approved",
  },
];

const statusColor = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

export default function HROvertime() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const pending = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  const approved = requests.filter(
    (r) => r.status === "Approved"
  ).length;

  const totalHours = requests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.hours, 0);

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const cards = [
    {
      title: "Total Requests",
      value: requests.length,
      icon: <AccessTime />,
      color: "#6366f1",
    },
    {
      title: "Pending Requests",
      value: pending,
      icon: <PendingActions />,
      color: "#f59e0b",
    },
    {
      title: "Approved Requests",
      value: approved,
      icon: <CheckCircle />,
      color: "#22c55e",
    },
    {
      title: "Approved Hours",
      value: `${totalHours} hrs`,
      icon: <AccessTime />,
      color: "#06b6d4",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Overtime Management
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Review and manage employee overtime requests
          </Typography>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} mb={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} mt={1}>
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
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Request Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Requests</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          p={2.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Overtime Requests
          </Typography>

          <Chip label={`${filtered.length} Requests`} variant="outlined" />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: "#6366f1",
                          fontSize: 12,
                        }}
                      >
                        {request.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </Avatar>

                      <Typography variant="body2" fontWeight={600}>
                        {request.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    {request.start} - {request.end}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${request.hours} hrs`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>

                  <TableCell>
                    <Chip
                      label={request.status}
                      color={statusColor[request.status]}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {request.status === "Pending" ? (
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() =>
                            updateStatus(request.id, "Approved")
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() =>
                            updateStatus(request.id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Reviewed
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    No overtime requests found.
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
