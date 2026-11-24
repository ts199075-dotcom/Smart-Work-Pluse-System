
import { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  LinearProgress,
  Divider,
} from "@mui/material";

import Assessment from "@mui/icons-material/Assessment";
import People from "@mui/icons-material/People";
import Payments from "@mui/icons-material/Payments";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Download from "@mui/icons-material/Download";
import TrendingUp from "@mui/icons-material/TrendingUp";
import AccessTime from "@mui/icons-material/AccessTime";
import PersonOff from "@mui/icons-material/PersonOff";
import StatCard from "../../../components/common/StatCard";

const departmentsData = [
  {
    name: "IT",
    employees: 25,
    present: 23,
    absent: 1,
    late: 1,
    payroll: 125000,
    leaveRequests: 8,
  },
  {
    name: "HR",
    employees: 12,
    present: 11,
    absent: 0,
    late: 1,
    payroll: 65000,
    leaveRequests: 4,
  },
  {
    name: "Finance",
    employees: 18,
    present: 17,
    absent: 1,
    late: 0,
    payroll: 95000,
    leaveRequests: 5,
  },
  {
    name: "Marketing",
    employees: 20,
    present: 18,
    absent: 1,
    late: 1,
    payroll: 88000,
    leaveRequests: 6,
  },
  {
    name: "Sales",
    employees: 30,
    present: 27,
    absent: 2,
    late: 1,
    payroll: 110000,
    leaveRequests: 9,
  },
  {
    name: "Operations",
    employees: 15,
    present: 14,
    absent: 1,
    late: 0,
    payroll: 72000,
    leaveRequests: 3,
  },
];

const attendanceTrend = [
  { day: "Sat", attendance: 92 },
  { day: "Sun", attendance: 96 },
  { day: "Mon", attendance: 88 },
  { day: "Tue", attendance: 95 },
  { day: "Wed", attendance: 90 },
  { day: "Thu", attendance: 98 },
  { day: "Fri", attendance: 85 },
];

const formatCurrency = (value) =>
  `${value.toLocaleString("en-US")} EGP`;

// function StatCard({ title, value, subtitle, icon, color }) {
//   return (
//     <Card
//       sx={{
//         height: "100%",
//         borderRadius: 3,
//         border: "1px solid",
//         borderColor: "divider",
//         boxShadow: "none",
//       }}
//     >
//       <CardContent>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Box>
//             <Typography variant="body2" color="text.secondary">
//               {title}
//             </Typography>

//             <Typography variant="h4" fontWeight={700} mt={1}>
//               {value}
//             </Typography>

//             <Typography variant="caption" color="text.secondary">
//               {subtitle}
//             </Typography>
//           </Box>

//           <Box
//             sx={{
//               width: 52,
//               height: 52,
//               borderRadius: 3,
//               bgcolor: `${color}15`,
//               color,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {icon}
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

function SectionTitle({ title, subtitle }) {
  return (
    <Box mb={2}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default function HRReports() {
  const [department, setDepartment] = useState("All");
  const [period, setPeriod] = useState("This Month");

  const filteredDepartments = useMemo(() => {
    if (department === "All") return departmentsData;

    return departmentsData.filter(
      (item) => item.name === department
    );
  }, [department]);

  const totals = useMemo(() => {
    return filteredDepartments.reduce(
      (result, item) => ({
        employees: result.employees + item.employees,
        present: result.present + item.present,
        absent: result.absent + item.absent,
        late: result.late + item.late,
        payroll: result.payroll + item.payroll,
        leaveRequests: result.leaveRequests + item.leaveRequests,
      }),
      {
        employees: 0,
        present: 0,
        absent: 0,
        late: 0,
        payroll: 0,
        leaveRequests: 0,
      }
    );
  }, [filteredDepartments]);

  const attendanceRate =
    totals.employees > 0
      ? Math.round((totals.present / totals.employees) * 100)
      : 0;

  const exportCSV = () => {
    const headers = [
      "Department",
      "Employees",
      "Present",
      "Absent",
      "Late",
      "Payroll (EGP)",
      "Leave Requests",
      "Attendance Rate (%)",
    ];

    const rows = filteredDepartments.map((item) => [
      item.name,
      item.employees,
      item.present,
      item.absent,
      item.late,
      item.payroll,
      item.leaveRequests,
      Math.round((item.present / item.employees) * 100),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "HR_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
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
            HR Reports
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Workforce analytics and HR performance reports
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={exportCSV}
        >
          Export CSV
        </Button>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="All">All Departments</MenuItem>

                {departmentsData.map((item) => (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Report Period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <MenuItem value="This Week">This Week</MenuItem>
                <MenuItem value="This Month">This Month</MenuItem>
                <MenuItem value="Last Month">Last Month</MenuItem>
                <MenuItem value="This Quarter">This Quarter</MenuItem>
                <MenuItem value="This Year">This Year</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={totals.employees}
            subtitle="Employees in selected departments"
            icon={<People />}
            color="#6366f1"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="Current attendance overview"
            icon={<TrendingUp />}
            color="#10b981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payroll"
            value={formatCurrency(totals.payroll)}
            subtitle="Monthly payroll overview"
            icon={<Payments />}
            color="#f59e0b"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Leave Requests"
            value={totals.leaveRequests}
            subtitle="Requests across departments"
            icon={<EventAvailable />}
            color="#ec4899"
          />
        </Grid>
      </Grid>

      {/* Attendance Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <SectionTitle
                title="Attendance Overview"
                subtitle="Employee attendance summary"
              />

              <Stack spacing={3} mt={3}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="body2">
                      Present
                    </Typography>

                    <Typography fontWeight={700} color="success.main">
                      {totals.present}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={attendanceRate}
                    color="success"
                    sx={{ height: 9, borderRadius: 5 }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="body2">
                      Absent
                    </Typography>

                    <Typography fontWeight={700} color="error.main">
                      {totals.absent}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      totals.employees
                        ? (totals.absent / totals.employees) * 100
                        : 0
                    }
                    color="error"
                    sx={{ height: 9, borderRadius: 5 }}
                  />
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="body2">
                      Late
                    </Typography>

                    <Typography fontWeight={700} color="warning.main">
                      {totals.late}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      totals.employees
                        ? (totals.late / totals.employees) * 100
                        : 0
                    }
                    color="warning"
                    sx={{ height: 9, borderRadius: 5 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <SectionTitle
                title="Weekly Attendance Trend"
                subtitle="Attendance percentage during the week"
              />

              <Box
                sx={{
                  height: 220,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  gap: 1,
                  mt: 2,
                }}
              >
                {attendanceTrend.map((item) => (
                  <Box
                    key={item.day}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography variant="caption" fontWeight={600} mb={1}>
                      {item.attendance}%
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 40,
                        height: `${item.attendance}%`,
                        minHeight: 10,
                        borderRadius: "6px 6px 0 0",
                        bgcolor: "#6366f1",
                        transition: "0.3s",
                        "&:hover": {
                          bgcolor: "#818cf8",
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mt={1}
                    >
                      {item.day}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Table */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <Box p={2}>
          <SectionTitle
            title="Department Summary"
            subtitle="Detailed performance by department"
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department</TableCell>
                <TableCell>Employees</TableCell>
                <TableCell>Present</TableCell>
                <TableCell>Absent</TableCell>
                <TableCell>Late</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Payroll</TableCell>
                <TableCell>Leaves</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDepartments.map((item) => {
                const rate = Math.round(
                  (item.present / item.employees) * 100
                );

                return (
                  <TableRow key={item.name} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {item.name}
                      </Typography>
                    </TableCell>

                    <TableCell>{item.employees}</TableCell>

                    <TableCell>
                      <Typography color="success.main" fontWeight={600}>
                        {item.present}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography color="error.main" fontWeight={600}>
                        {item.absent}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography color="warning.main" fontWeight={600}>
                        {item.late}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box minWidth={100}>
                        <Typography variant="caption" fontWeight={600}>
                          {rate}%
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={rate}
                          sx={{
                            height: 6,
                            borderRadius: 5,
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      {formatCurrency(item.payroll)}
                    </TableCell>

                    <TableCell>{item.leaveRequests}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Quick Insights */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTime color="warning" />

                <Typography fontWeight={600}>
                  Late Attendance
                </Typography>
              </Stack>

              <Typography variant="h4" fontWeight={700} mt={2}>
                {totals.late}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Late employees in selected departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonOff color="error" />

                <Typography fontWeight={600}>
                  Absence
                </Typography>
              </Stack>

              <Typography variant="h4" fontWeight={700} mt={2}>
                {totals.absent}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Absent employees in selected departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Assessment color="primary" />

                <Typography fontWeight={600}>
                  Departments
                </Typography>
              </Stack>

              <Typography variant="h4" fontWeight={700} mt={2}>
                {filteredDepartments.length}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Departments included in this report
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Divider />

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={2}
        >
          Report period: {period} | Data is currently demo data.
        </Typography>
      </Box>
    </Box>
  );
}
