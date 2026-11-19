/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  MenuItem,
  LinearProgress,
} from "@mui/material";

import {
  AccessTimeRounded,
  GroupsRounded,
  CheckCircleRounded,
  CancelRounded,
  PendingActionsRounded,
  SearchRounded,
  VisibilityRounded,
  CloseRounded,
  CalendarTodayRounded,
  WorkOutlined,
  PersonOutlined,
} from "@mui/icons-material";

const initialRequests = [
  {
    id: 1,
    employee: "Ahmed Mohamed",
    role: "Frontend Developer",
    project: "Website Redesign",
    date: "18 Nov 2026",
    hours: 3,
    reason: "Completing the homepage and responsive layout.",
    status: "Pending",
    avatar: "AM",
  },
  {
    id: 2,
    employee: "Sara Ali",
    role: "UI/UX Designer",
    project: "Mobile Application",
    date: "17 Nov 2026",
    hours: 2,
    reason: "Finishing the application screens before the deadline.",
    status: "Approved",
    avatar: "SA",
  },
  {
    id: 3,
    employee: "Mohamed Hassan",
    role: "Backend Developer",
    project: "HR System",
    date: "16 Nov 2026",
    hours: 4,
    reason: "Fixing critical API issues and completing pending tasks.",
    status: "Pending",
    avatar: "MH",
  },
  {
    id: 4,
    employee: "Mona Ahmed",
    role: "Frontend Developer",
    project: "Internal Dashboard",
    date: "15 Nov 2026",
    hours: 2,
    reason: "Working on the dashboard integration.",
    status: "Rejected",
    avatar: "MA",
  },
  {
    id: 5,
    employee: "Omar Khaled",
    role: "QA Engineer",
    project: "Attendance System",
    date: "14 Nov 2026",
    hours: 3,
    reason: "Running additional tests before delivery.",
    status: "Approved",
    avatar: "OK",
  },
  {
    id: 6,
    employee: "Youssef Adel",
    role: "Backend Developer",
    project: "Website Redesign",
    date: "13 Nov 2026",
    hours: 2,
    reason: "Completing database integration.",
    status: "Pending",
    avatar: "YA",
  },
];

const statusStyles = {
  Pending: {
    color: "#D97706",
    backgroundColor: "#FEF3C7",
  },
  Approved: {
    color: "#15803D",
    backgroundColor: "#DCFCE7",
  },
  Rejected: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
};

function SummaryCard({ title, value, subtitle, icon, color, background }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500}>
            {title}
          </Typography>

          <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
            {value}
          </Typography>

          <Typography color="text.secondary" fontSize={12} sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            backgroundColor: background,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  );
}

function StatusChip({ status }) {
  const style = statusStyles[status];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontWeight: 600,
        fontSize: 12,
        borderRadius: 2,
        minWidth: 85,
      }}
    />
  );
}

function TeamLeaderOvertime() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const summary = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((request) => request.status === "Pending").length,
      approved: requests.filter((request) => request.status === "Approved").length,
      rejected: requests.filter((request) => request.status === "Rejected").length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesTab =
        activeTab === "All" || request.status === activeTab;

      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        request.employee.toLowerCase().includes(searchValue) ||
        request.project.toLowerCase().includes(searchValue) ||
        request.role.toLowerCase().includes(searchValue);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchTerm]);

  const updateRequestStatus = (id, status) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );

    setSelectedRequest((currentRequest) =>
      currentRequest?.id === id
        ? { ...currentRequest, status }
        : currentRequest
    );
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  const totalHours = requests.reduce(
    (total, request) => total + request.hours,
    0
  );

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Overtime Requests
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            Review and manage your team members' overtime requests.
          </Typography>
        </Box>

        <Chip
          icon={<AccessTimeRounded />}
          label={`${totalHours} Total Requested Hours`}
          sx={{
            backgroundColor: "#DBEAFE",
            color: "#1D4ED8",
            fontWeight: 600,
            borderRadius: 2,
          }}
        />
      </Stack>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <SummaryCard
          title="Total Requests"
          value={summary.total}
          subtitle="All overtime requests"
          icon={<GroupsRounded />}
          color="#2563EB"
          background="#DBEAFE"
        />

        <SummaryCard
          title="Pending Requests"
          value={summary.pending}
          subtitle="Waiting for your review"
          icon={<PendingActionsRounded />}
          color="#D97706"
          background="#FEF3C7"
        />

        <SummaryCard
          title="Approved Requests"
          value={summary.approved}
          subtitle="Successfully approved"
          icon={<CheckCircleRounded />}
          color="#16A34A"
          background="#DCFCE7"
        />

        <SummaryCard
          title="Rejected Requests"
          value={summary.rejected}
          subtitle="Requests not approved"
          icon={<CancelRounded />}
          color="#DC2626"
          background="#FEE2E2"
        />
      </Box>

      {/* Requests Section */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Team Overtime Requests
              </Typography>

              <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
                Track and review overtime requests from your team.
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search employee or project..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              sx={{ width: { xs: "100%", md: 290 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={`All (${summary.total})`} value="All" />
              <Tab label={`Pending (${summary.pending})`} value="Pending" />
              <Tab label={`Approved (${summary.approved})`} value="Approved" />
              <Tab label={`Rejected (${summary.rejected})`} value="Rejected" />
            </Tabs>
          </Box>
        </Box>

        {/* Requests Table */}
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow
                    key={request.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: 13,
                            fontWeight: 600,
                            backgroundColor: "#E0E7FF",
                            color: "#3730A3",
                          }}
                        >
                          {request.avatar}
                        </Avatar>

                        <Box>
                          <Typography fontSize={13} fontWeight={600}>
                            {request.employee}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            {request.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13} fontWeight={500}>
                        {request.project}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13} color="text.secondary">
                        {request.date}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13} fontWeight={600}>
                        {request.hours} hrs
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip status={request.status} />
                    </TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={0.5}
                      >
                        <IconButton
                          size="small"
                          onClick={() => setSelectedRequest(request)}
                          title="View details"
                        >
                          <VisibilityRounded fontSize="small" />
                        </IconButton>

                        {request.status === "Pending" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                updateRequestStatus(request.id, "Approved")
                              }
                              title="Approve request"
                            >
                              <CheckCircleRounded fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                updateRequestStatus(request.id, "Rejected")
                              }
                              title="Reject request"
                            >
                              <CancelRounded fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 6, textAlign: "center" }}>
                      <AccessTimeRounded
                        sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                      />

                      <Typography fontWeight={600}>
                        No requests found
                      </Typography>

                      <Typography color="text.secondary" fontSize={13}>
                        Try changing your search or selected filter.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <Box sx={{ p: 2, backgroundColor: "#FAFBFC" }}>
          <Typography fontSize={12} color="text.secondary">
            Showing {filteredRequests.length} of {requests.length} requests
          </Typography>
        </Box>
      </Card>

      {/* Request Details Dialog */}
      <Dialog
        open={Boolean(selectedRequest)}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
      >
        {selectedRequest && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={700} variant="h6">
                  Overtime Request Details
                </Typography>

                <IconButton onClick={handleCloseDetails} size="small">
                  <CloseRounded />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      backgroundColor: "#E0E7FF",
                      color: "#3730A3",
                    }}
                  >
                    {selectedRequest.avatar}
                  </Avatar>

                  <Box>
                    <Typography fontWeight={700}>
                      {selectedRequest.employee}
                    </Typography>

                    <Typography color="text.secondary" fontSize={13}>
                      {selectedRequest.role}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <WorkOutlined color="action" />

                  <Box>
                    <Typography color="text.secondary" fontSize={12}>
                      Project
                    </Typography>

                    <Typography fontWeight={600} fontSize={14}>
                      {selectedRequest.project}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CalendarTodayRounded color="action" />

                  <Box>
                    <Typography color="text.secondary" fontSize={12}>
                      Overtime Date
                    </Typography>

                    <Typography fontWeight={600} fontSize={14}>
                      {selectedRequest.date}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <AccessTimeRounded color="action" />

                  <Box>
                    <Typography color="text.secondary" fontSize={12}>
                      Requested Hours
                    </Typography>

                    <Typography fontWeight={600} fontSize={14}>
                      {selectedRequest.hours} Hours
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography color="text.secondary" fontSize={12} mb={1}>
                    Reason
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <Typography fontSize={13}>
                      {selectedRequest.reason}
                    </Typography>
                  </Box>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography color="text.secondary" fontSize={13}>
                    Request Status
                  </Typography>

                  <StatusChip status={selectedRequest.status} />
                </Stack>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              {selectedRequest.status === "Pending" ? (
                <>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      updateRequestStatus(selectedRequest.id, "Rejected");
                    }}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      updateRequestStatus(selectedRequest.id, "Approved");
                    }}
                  >
                    Approve Request
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleCloseDetails}>
                  Close
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default TeamLeaderOvertime;