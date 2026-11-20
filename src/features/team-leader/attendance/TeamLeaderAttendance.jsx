/* eslint-disable no-unused-vars */

import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  LinearProgress,
} from "@mui/material";

import {
  AccessTimeRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  CancelRounded,
  ScheduleRounded,
  TrendingUpRounded,
  DownloadRounded,
  SearchRounded,
  LoginRounded,
  LogoutRounded,
} from "@mui/icons-material";

const attendanceRecords = [
  { id: 1, date: "19 Nov 2026", day: "Thursday", checkIn: "07:45 AM", checkOut: "04:30 PM", hours: "8h 45m", status: "Present" },
  { id: 2, date: "18 Nov 2026", day: "Wednesday", checkIn: "08:20 AM", checkOut: "05:10 PM", hours: "8h 50m", status: "Present" },
  { id: 3, date: "17 Nov 2026", day: "Tuesday", checkIn: "09:15 AM", checkOut: "05:30 PM", hours: "8h 15m", status: "Late" },
  { id: 4, date: "16 Nov 2026", day: "Monday", checkIn: "07:50 AM", checkOut: "04:45 PM", hours: "8h 55m", status: "Present" },
  { id: 5, date: "15 Nov 2026", day: "Sunday", checkIn: "--", checkOut: "--", hours: "--", status: "Absent" },
  { id: 6, date: "12 Nov 2026", day: "Thursday", checkIn: "08:10 AM", checkOut: "05:00 PM", hours: "8h 50m", status: "Present" },
  { id: 7, date: "11 Nov 2026", day: "Wednesday", checkIn: "07:55 AM", checkOut: "04:40 PM", hours: "8h 45m", status: "Present" },
  { id: 8, date: "10 Nov 2026", day: "Tuesday", checkIn: "09:25 AM", checkOut: "05:15 PM", hours: "7h 50m", status: "Late" },
];

const statusStyles = {
  Present: { color: "#15803D", background: "#DCFCE7" },
  Late: { color: "#1D4ED8", background: "#DBEAFE" },
  Absent: { color: "#DC2626", background: "#FEE2E2" },
};

function SummaryCard({ title, value, subtitle, icon, color, background }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
        }}
     >
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
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
        backgroundColor: style.background,
        fontWeight: 600,
        minWidth: 82,
        borderRadius: 2,
      }}
    />
  );
}

function TeamLeaderAttendance() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const summary = useMemo(() => {
    const total = attendanceRecords.length;

    const present = attendanceRecords.filter(
        (record) => record.status === "Present"
    ).length;

    const late = attendanceRecords.filter(
        (record) => record.status === "Late"
    ).length;

    const absent = attendanceRecords.filter(
        (record) => record.status === "Absent"
    ).length;

    const attended = present + late;

    const attendanceRate =
        total > 0 ? ((attended / total) * 100).toFixed(1) : "0.0";

    return {
        total,
        present,
        late,
        absent,
        attendanceRate,
    };
    }, []);

  const filteredRecords = useMemo(() => {
  return attendanceRecords.filter((record) => {
    const matchesStatus =
      selectedStatus === "All" || record.status === selectedStatus;

    const matchesSearch =
      `${record.date} ${record.day} ${record.status}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesMonth =
      selectedMonth === "All" ||
      record.date.includes(selectedMonth);

    return matchesStatus && matchesSearch && matchesMonth;
  });
}, [selectedStatus, selectedMonth, searchTerm]);

const todayRecord = attendanceRecords.find(
  (record) => record.id === 1
);

const handleExportCSV = () => {
  const headers = [
    "Date",
    "Day",
    "Check In",
    "Check Out",
    "Working Hours",
    "Status",
  ];

  const rows = filteredRecords.map((record) => [
    record.date,
    record.day,
    record.checkIn,
    record.checkOut,
    record.hours,
    record.status,
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `attendance-report-${selectedMonth === "All" ? "all-months" : selectedMonth}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            My Attendance
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            Track your attendance, check-in and check-out records.
          </Typography>
        </Box>

        <Chip
          icon={<CalendarMonthRounded />}
          label="November 2026"
          sx={{
            backgroundColor: "#DBEAFE",
            color: "#1D4ED8",
            fontWeight: 600,
            borderRadius: 2,
          }}
        />
      </Stack>

      {/* Employee Information */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
                alignItems: { xs: "flex-start", sm: "center" },
            }}
        >
          <Avatar
            sx={{
              width: 54,
              height: 54,
              backgroundColor: "#E0E7FF",
              color: "#3730A3",
              fontWeight: 700,
            }}
          >
            SA
          </Avatar>

          <Box>
            <Typography fontWeight={700}>Sara Ahmed</Typography>
            <Typography color="text.secondary" fontSize={13}>
              Team Leader · Product Development
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            icon={<CheckCircleRounded />}
            label="Attendance Active"
            color="success"
            variant="outlined"
          />
        </Stack>
      </Card>

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
          mb: 3,
        }}
      >
        <SummaryCard
            title="Present Days"
            value={summary.present}
            subtitle={`Out of ${summary.total} recorded days`}
            icon={<CheckCircleRounded />}
            color="#16A34A"
            background="#DCFCE7"
        />

        <SummaryCard
          title="Late Days"
          value={summary.late}
          subtitle="Arrivals after 9:00 AM"
          icon={<ScheduleRounded />}
          color="#2563EB"
          background="#DBEAFE"
        />

        <SummaryCard
          title="Absent Days"
          value={summary.absent}
          subtitle="Days not attended"
          icon={<CancelRounded />}
          color="#DC2626"
          background="#FEE2E2"
        />

        <Card
            elevation={0}
            sx={{
                p: 2.5,
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
            }}
            >
            <Stack
                direction="row"
                sx={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                }}
            >
                <Box sx={{ width: "100%" }}>
                <Typography color="text.secondary" fontSize={13} fontWeight={500}>
                    Attendance Rate
                </Typography>

                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                    {summary.attendanceRate}%
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={Number(summary.attendanceRate)}
                    sx={{
                    mt: 2,
                    height: 7,
                    borderRadius: 5,
                    backgroundColor: "#EDE9FE",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: "#7C3AED",
                        borderRadius: 5,
                    },
                    }}
                />

                <Typography color="text.secondary" fontSize={12} sx={{ mt: 1 }}>
                    Based on recorded attendance
                </Typography>
                </Box>
            </Stack>
        </Card>
      </Box>

      {/* Today's Attendance */}
      <Card
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 3,
            }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Today's Attendance
            </Typography>
            <Typography color="text.secondary" fontSize={13}>
              Your check-in and check-out information for today.
            </Typography>
          </Box>

          <Chip
            label={todayRecord?.status || "No Attendance"}
            color={
                todayRecord?.status === "Present"
                ? "success"
                : todayRecord?.status === "Late"
                ? "warning"
                : "default"
            }
         />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: "#F0FDF4",
            }}
          >
            <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
            >
              <LoginRounded sx={{ color: "#16A34A", fontSize: 28 }} />
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  Check In
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {todayRecord?.checkIn || "--"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: "#EFF6FF",
            }}
          >
            <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
            >
              <LogoutRounded sx={{ color: "#2563EB", fontSize: 28 }} />
              <Box>
                <Typography color="text.secondary" fontSize={12}>
                  Check Out
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                 {todayRecord?.checkOut || "--"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#F8FAFC",
            }}
            >
            <Typography color="text.secondary" fontSize={12}>
                Total Working Hours
            </Typography>

            <Typography variant="h5" fontWeight={700}>
                {todayRecord?.hours || "--"}
            </Typography>
            </Box>
        </Box>
      </Card>

      {/* Attendance Rules */}
      <Card
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 2 }}>
          Attendance Time Rules
        </Typography>

        <Stack spacing={2}>
         <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#16A34A" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontSize={13} fontWeight={600}>
                Before 8:00 AM
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Early arrival.
              </Typography>
            </Box>
            <Chip label="Early" size="small" color="success" />
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center" }}
          >
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#2563EB" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontSize={13} fontWeight={600}>
                8:00 AM – 9:00 AM
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Allowed arrival window with a 1:1 offset.
              </Typography>
            </Box>
            <Chip label="On Time" size="small" color="info" />
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center" }}
         >
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#111827" }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontSize={13} fontWeight={600}>
                After 9:00 AM
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Late arrival. The late status is not cancelled.
              </Typography>
            </Box>
            <Chip
              label="Late"
              size="small"
              sx={{ backgroundColor: "#E5E7EB", color: "#111827" }}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Attendance History */}
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
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            sx={{
                justifyContent: "space-between",
                alignItems: { xs: "stretch", lg: "center" },
            }}
            >
            <Box>
                <Typography variant="h6" fontWeight={700}>
                Attendance History
                </Typography>

                <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
                Your daily attendance records for this month.
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
            >
                <TextField
                size="small"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                sx={{ minWidth: 180 }}
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

                <TextField
                select
                size="small"
                label="Month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                sx={{ minWidth: 140 }}
                >
                <MenuItem value="All">All Months</MenuItem>
                <MenuItem value="Nov">November</MenuItem>
                <MenuItem value="Oct">October</MenuItem>
                </TextField>

                <TextField
                select
                size="small"
                label="Status"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                sx={{ minWidth: 140 }}
                >
                <MenuItem value="All">All Records</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                </TextField>

                <Button
                variant="contained"
                startIcon={<DownloadRounded />}
                onClick={handleExportCSV}
                disabled={filteredRecords.length === 0}
                sx={{ whiteSpace: "nowrap" }}
                >
                Export CSV
                </Button>
            </Stack>
            </Stack>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Check Out</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Working Hours</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Typography fontSize={13} fontWeight={600}>
                        {record.date}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary">
                        {record.day}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13}>
                        {record.checkIn}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13}>
                        {record.checkOut}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontSize={13} fontWeight={600}>
                        {record.hours}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip status={record.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 5, textAlign: "center" }}>
                      <Typography fontWeight={600}>
                        No attendance records found
                      </Typography>
                      <Typography color="text.secondary" fontSize={13}>
                        Try selecting another status.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, backgroundColor: "#FAFBFC" }}>
          <Typography fontSize={12} color="text.secondary">
            Showing {filteredRecords.length} of {attendanceRecords.length} records
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default TeamLeaderAttendance;