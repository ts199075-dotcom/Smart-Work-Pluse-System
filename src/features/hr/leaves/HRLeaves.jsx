
import { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import EventAvailable from "@mui/icons-material/EventAvailable";
import PendingActions from "@mui/icons-material/PendingActions";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import Close from "@mui/icons-material/Close";
import StatCard from "../../../components/common/StatCard";
import StatusChip from "../../../components/common/StatusChip";

const initialLeaves = [
  {
    id: 1,
    employee: "Ahmed Mohamed",
    department: "IT",
    type: "Annual Leave",
    from: "2026-11-24",
    to: "2026-11-27",
    days: 4,
    reason: "Family vacation",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Sara Ali",
    department: "HR",
    type: "Sick Leave",
    from: "2026-11-20",
    to: "2026-11-21",
    days: 2,
    reason: "Medical condition",
    status: "Approved",
  },
  {
    id: 3,
    employee: "Omar Hassan",
    department: "Finance",
    type: "Annual Leave",
    from: "2026-11-25",
    to: "2026-11-29",
    days: 5,
    reason: "Travel",
    status: "Pending",
  },
  {
    id: 4,
    employee: "Mariam Samir",
    department: "Marketing",
    type: "Casual Leave",
    from: "2026-11-22",
    to: "2026-11-22",
    days: 1,
    reason: "Personal matters",
    status: "Rejected",
  },
  {
    id: 5,
    employee: "Youssef Adel",
    department: "IT",
    type: "Annual Leave",
    from: "2026-12-01",
    to: "2026-12-05",
    days: 5,
    reason: "Vacation",
    status: "Approved",
  },
  {
    id: 6,
    employee: "Nour Tarek",
    department: "Sales",
    type: "Sick Leave",
    from: "2026-11-21",
    to: "2026-11-23",
    days: 3,
    reason: "Medical appointment",
    status: "Pending",
  },
  {
    id: 7,
    employee: "Mahmoud Ibrahim",
    department: "Operations",
    type: "Casual Leave",
    from: "2026-11-26",
    to: "2026-11-26",
    days: 1,
    reason: "Personal reasons",
    status: "Approved",
  },
];


export default function HRLeaves() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null);

  const total = leaves.length;

  const pending = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approved = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejected = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  const departments = [
    "All",
    ...new Set(leaves.map((leave) => leave.department)),
  ];

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch =
        leave.employee.toLowerCase().includes(search.toLowerCase()) ||
        leave.department.toLowerCase().includes(search.toLowerCase()) ||
        leave.type.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "All" || leave.department === department;

      const matchesStatus =
        status === "All" || leave.status === status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [leaves, search, department, status]);

  const updateStatus = (id, newStatus) => {
    setLeaves((previous) =>
      previous.map((leave) =>
        leave.id === id
          ? { ...leave, status: newStatus }
          : leave
      )
    );

    if (selectedLeave?.id === id) {
      setSelectedLeave((previous) => ({
        ...previous,
        status: newStatus,
      }));
    }
  };


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Leave Management
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage employee leave requests and approvals
          </Typography>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={total}
            icon={<EventAvailable />}
            color="#6366f1"
            subtitle="All leave requests"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={pending}
            icon={<PendingActions />}
            color="#f59e0b"
            subtitle="Waiting for approval"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={approved}
            icon={<CheckCircle />}
            color="#10b981"
            subtitle="Approved requests"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rejected"
            value={rejected}
            icon={<Cancel />}
            color="#ef4444"
            subtitle="Rejected requests"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee, department or leave type..."
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

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box p={2}>
          <Typography variant="h6" fontWeight={700}>
            Leave Requests
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {filteredLeaves.length} requests found
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {leave.employee}
                      </Typography>
                    </TableCell>

                    <TableCell>{leave.department}</TableCell>

                    <TableCell>{leave.type}</TableCell>

                    <TableCell>{leave.from}</TableCell>

                    <TableCell>{leave.to}</TableCell>

                    <TableCell>
                      <Chip
                        label={`${leave.days} days`}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <StatusChip
                      status={leave.status}
                      sx={{ minWidth: 85 }}
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
                          onClick={() => setSelectedLeave(leave)}
                          title="View Details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        {leave.status === "Pending" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              title="Approve"
                              onClick={() =>
                                updateStatus(leave.id, "Approved")
                              }
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              title="Reject"
                              onClick={() =>
                                updateStatus(leave.id, "Rejected")
                              }
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Leave Details Dialog */}
      <Dialog
        open={Boolean(selectedLeave)}
        onClose={() => setSelectedLeave(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedLeave && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                Leave Request Details

                <IconButton onClick={() => setSelectedLeave(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Employee
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedLeave.employee}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Department
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedLeave.department}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Leave Type
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedLeave.type}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="text.secondary" variant="body2">
                      Start Date
                    </Typography>
                    <Typography fontWeight={600}>
                      {selectedLeave.from}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography color="text.secondary" variant="body2">
                      End Date
                    </Typography>
                    <Typography fontWeight={600}>
                      {selectedLeave.to}
                    </Typography>
                  </Grid>
                </Grid>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Duration
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedLeave.days} Days
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Reason
                  </Typography>
                  <Typography>
                    {selectedLeave.reason}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Current Status
                  </Typography>
                  <StatusChip
                    status={selectedLeave.status}
                    sx={{ minWidth: 85 }}
                  />
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              {selectedLeave.status === "Pending" && (
                <>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      updateStatus(selectedLeave.id, "Rejected");
                    }}
                  >
                    Reject Request
                  </Button>

                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => {
                      updateStatus(selectedLeave.id, "Approved");
                    }}
                  >
                    Approve Request
                  </Button>
                </>
              )}

              <Button onClick={() => setSelectedLeave(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
