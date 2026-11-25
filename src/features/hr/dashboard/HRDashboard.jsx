
import { useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from "@mui/material";

import {
  GroupsOutlined,
  PersonAddAltOutlined,
  EventAvailableOutlined,
  BeachAccessOutlined,
  TrendingUpRounded,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";

import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";


const statistics = [
  {
    title: "Total Employees",
    value: "156",
    description: "Across all departments",
    icon: <GroupsOutlined />,
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    title: "Active Employees",
    value: "142",
    description: "Currently working",
    icon: <PersonAddAltOutlined />,
    color: "#16A34A",
    bg: "#DCFCE7",
  },
  {
    title: "Pending Leaves",
    value: "12",
    description: "Waiting for approval",
    icon: <BeachAccessOutlined />,
    color: "#D97706",
    bg: "#FEF3C7",
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    description: "Today's attendance",
    icon: <EventAvailableOutlined />,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
];

const departments = [
  { name: "Development", count: 48, progress: 85, color: "#2563EB" },
  { name: "Marketing", count: 26, progress: 60, color: "#16A34A" },
  { name: "Human Resources", count: 12, progress: 35, color: "#2563EB" },
  { name: "Finance", count: 20, progress: 50, color: "#D97706" },
  { name: "Operations", count: 50, progress: 90, color: "#0891B2" },
];

const employees = [
  { name: "Ahmed Mohamed", id: "EMP-001", department: "Development", position: "Senior Developer", status: "Active" },
  { name: "Sara Hassan", id: "EMP-002", department: "Marketing", position: "Marketing Specialist", status: "Active" },
  { name: "Omar Ali", id: "EMP-003", department: "Finance", position: "Accountant", status: "On Leave" },
  { name: "Mariam Adel", id: "EMP-004", department: "HR", position: "HR Specialist", status: "Active" },
];

const initialLeaves = [
  { id: 1, name: "Ahmed Mohamed", type: "Annual Leave", duration: "3 days", dates: "Nov 23 - Nov 25, 2026", initials: "AM" },
  { id: 2, name: "Sara Hassan", type: "Sick Leave", duration: "2 days", dates: "Nov 24 - Nov 25, 2026", initials: "SH" },
  { id: 3, name: "Omar Ali", type: "Personal Leave", duration: "1 day", dates: "Nov 26, 2026", initials: "OA" },
];

const activities = [
  { title: "New employee added", description: "Mariam Adel joined Human Resources", time: "10 minutes ago" },
  { title: "Leave request submitted", description: "Ahmed Mohamed requested 3 days off", time: "45 minutes ago" },
  { title: "Payroll updated", description: "November payroll information updated", time: "2 hours ago" },
  { title: "Attendance report generated", description: "Daily attendance report is ready", time: "Yesterday" },
];

const cardStyle = {
  p: 2.5,
  border: "1px solid #E5E7EB",
  borderRadius: 3,
  boxShadow: "0 2px 8px rgba(23,54,93,0.04)",
};

function SectionTitle({ title, subtitle }) {
  return (
    <Box mb={2.5}>
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  );
}

function HRDashboard() {
  const [leaves, setLeaves] = useState(initialLeaves);

  const handleLeave = (id) => {
    setLeaves((current) => current.filter((leave) => leave.id !== id));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Welcome back, HR Team"
        subtitle="Here's what's happening across your organization today."
      />

      {/* Statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {statistics.map((item) => (
          <Paper key={item.title} sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: item.bg, color: item.color }}>
                {item.icon}
              </Avatar>
              <TrendingUpRounded sx={{ color: "#16A34A" }} />
            </Stack>

            <Typography color="text.secondary" fontSize={13}>
              {item.title}
            </Typography>

            <Typography fontSize={28} fontWeight={700} my={0.5}>
              {item.value}
            </Typography>

            <Typography color="text.secondary" fontSize={12}>
              {item.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Departments and Attendance */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
          gap: 2.5,
          mb: 3,
        }}
      >
        <Paper sx={cardStyle}>
          <SectionTitle
            title="Department Overview"
            subtitle="Employee distribution across departments."
          />

          {departments.map((department) => (
            <Box key={department.name} mb={2.5}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography fontSize={13} fontWeight={600}>
                  {department.name}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {department.count} employees
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={department.progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: department.color,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          ))}
        </Paper>

        <Paper sx={cardStyle}>
          <SectionTitle
            title="Today's Attendance"
            subtitle="Employee attendance summary."
          />

          <Box bgcolor="#F5F7FB" borderRadius={2} p={2} mb={2}>
            <Typography color="text.secondary" fontSize={13}>
              Attendance Rate
            </Typography>
            <Typography fontSize={30} fontWeight={700}>
              94.2%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={94.2}
              sx={{ height: 8, borderRadius: 5, mt: 1 }}
            />
          </Box>

          {[
            ["Present", "142", "#16A34A"],
            ["Absent", "8", "#DC2626"],
            ["On Leave", "4", "#D97706"],
            ["Late", "2", "#2563EB"],
          ].map(([label, value, color]) => (
            <Stack
              key={label}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              py={1.2}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: color }} />
                <Typography fontSize={13} color="text.secondary">{label}</Typography>
              </Stack>
              <Typography fontWeight={700}>{value}</Typography>
            </Stack>
          ))}
        </Paper>
      </Box>

      {/* Employees */}
      <Paper sx={{ ...cardStyle, mb: 3, overflowX: "auto" }}>
        <SectionTitle
          title="Recent Employees"
          subtitle="Overview of recently added employees."
        />

        <Box sx={{ minWidth: 650 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 0.7fr",
              bgcolor: "#F8FAFC",
              p: 1.5,
              borderRadius: 1,
            }}
          >
            {["Employee", "Department", "Position", "Status"].map((heading) => (
              <Typography key={heading} fontSize={12} fontWeight={700} color="text.secondary">
                {heading}
              </Typography>
            ))}
          </Box>

          {employees.map((employee) => (
            <Stack
              key={employee.id}
              direction="row"
              alignItems="center"
              sx={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 0.7fr",
                p: 1.5,
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 34, height: 34, bgcolor: "#DBEAFE", color: "#2563EB", fontSize: 11 }}>
                  {employee.name.split(" ").map((part) => part[0]).join("")}
                </Avatar>
                <Box>
                  <Typography fontSize={13} fontWeight={600}>{employee.name}</Typography>
                  <Typography fontSize={11} color="text.secondary">{employee.id}</Typography>
                </Box>
              </Stack>

              <Typography fontSize={13}>{employee.department}</Typography>
              <Typography fontSize={13}>{employee.position}</Typography>

              <Chip
                size="small"
                label={employee.status}
                color={employee.status === "Active" ? "success" : "warning"}
                variant="outlined"
              />
            </Stack>
          ))}
        </Box>
      </Paper>

      {/* Leave Requests and Activities */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1fr" },
          gap: 2.5,
          mb: 2,
        }}
      >
        <Paper sx={cardStyle}>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <SectionTitle
              title="Pending Leave Requests"
              subtitle="Review employee leave applications."
            />
            <Chip label={`${leaves.length} Pending`} color="warning" size="small" />
          </Stack>

          {leaves.length === 0 ? (
            <Box textAlign="center" py={3}>
              <CheckCircleOutlineRounded color="success" sx={{ fontSize: 40 }} />
              <Typography fontWeight={600}>All caught up!</Typography>
              <Typography color="text.secondary" fontSize={13}>
                No pending leave requests.
              </Typography>
            </Box>
          ) : (
            leaves.map((leave, index) => (
              <Box key={leave.id}>
                <Stack direction="row" spacing={1.5} py={2}>
                  <Avatar sx={{ bgcolor: "#DBEAFE", color: "#2563EB" }}>
                    {leave.initials}
                  </Avatar>

                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={600} fontSize={13}>
                      {leave.name}
                    </Typography>
                    <Typography color="text.secondary" fontSize={12}>
                      {leave.type} • {leave.duration}
                    </Typography>
                    <Typography color="text.secondary" fontSize={11} mb={1}>
                      {leave.dates}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleLeave(leave.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleLeave(leave.id)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
                {index !== leaves.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Paper>

        <Paper sx={cardStyle}>
          <SectionTitle
            title="Recent HR Activities"
            subtitle="Latest updates from your HR department."
          />

          {activities.map((activity, index) => (
            <Box key={activity.title} py={1.8}>
              <Typography fontWeight={600} fontSize={13}>
                {activity.title}
              </Typography>
              <Typography color="text.secondary" fontSize={12} my={0.5}>
                {activity.description}
              </Typography>
              <Typography color="text.secondary" fontSize={11}>
                {activity.time}
              </Typography>
              {index !== activities.length - 1 && <Divider sx={{ mt: 1.5 }} />}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}

export default HRDashboard;
