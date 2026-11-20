
/* eslint-disable no-unused-vars */

import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import {
  GroupsOutlined,
  TaskAltOutlined,
  WarningAmberOutlined,
  TrendingUpRounded,
  ArrowForwardRounded,
  MoreHorizRounded,
  CheckCircleOutlineRounded,
  AssignmentTurnedInOutlined,
  CalendarTodayOutlined,
  WorkOffOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// Dashboard Statistics
const overviewData = [
  {
    title: "Team Members",
    value: "12",
    description: "Across 3 active teams",
    trend: "+2 this month",
    icon: <GroupsOutlined />,
    color: "#2563EB",
    background: "#DBEAFE",
  },
  {
    title: "Active Projects",
    value: "5",
    description: "2 projects near deadline",
    trend: "+1 this month",
    icon: <WorkOffOutlined />,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Completed Tasks",
    value: "48",
    description: "Out of 72 total tasks",
    trend: "67% completion",
    icon: <TaskAltOutlined />,
    color: "#7C3AED",
    background: "#EDE9FE",
  },
  {
    title: "Overdue Tasks",
    value: "3",
    description: "Require your attention",
    trend: "Needs attention",
    icon: <WarningAmberOutlined />,
    color: "#DC2626",
    background: "#FEE2E2",
  },
];

// Projects Data
const projects = [
  {
    name: "Customer Portal",
    team: "Frontend Team",
    progress: 75,
    deadline: "Nov 25, 2026",
    status: "On Track",
  },
  {
    name: "Mobile Application",
    team: "Mobile Team",
    progress: 45,
    deadline: "Dec 10, 2026",
    status: "In Progress",
  },
  {
    name: "Internal Management System",
    team: "Backend Team",
    progress: 90,
    deadline: "Nov 22, 2026",
    status: "Near Deadline",
  },
];

// Team Performance Data
const teamPerformance = [
  {
    name: "Ahmed Mohamed",
    role: "Frontend Developer",
    initials: "AM",
    completed: 18,
    progress: 90,
  },
  {
    name: "Sara Hassan",
    role: "Backend Developer",
    initials: "SH",
    completed: 15,
    progress: 82,
  },
  {
    name: "Omar Ali",
    role: "UI/UX Designer",
    initials: "OA",
    completed: 12,
    progress: 70,
  },
];

// Tasks Data
const tasks = [
  {
    title: "Implement Authentication UI",
    project: "Customer Portal",
    assignee: "Ahmed Mohamed",
    priority: "High",
    dueDate: "Nov 22, 2026",
    status: "In Progress",
  },
  {
    title: "Fix Dashboard Responsiveness",
    project: "Customer Portal",
    assignee: "Omar Ali",
    priority: "Medium",
    dueDate: "Nov 25, 2026",
    status: "Pending",
  },
  {
    title: "API Integration",
    project: "Mobile Application",
    assignee: "Sara Hassan",
    priority: "High",
    dueDate: "Nov 18, 2026",
    status: "Overdue",
  },
  {
    title: "Update Database Schema",
    project: "Internal Management System",
    assignee: "Mohamed Adel",
    priority: "Low",
    dueDate: "Nov 20, 2026",
    status: "Completed",
  },
];

// Pending Approvals
const initialApprovals = [
  {
    id: 1,
    title: "Overtime Request",
    employee: "Ahmed Mohamed",
    details: "5 additional hours",
    date: "Nov 18, 2026",
    type: "Overtime",
  },
  {
    id: 2,
    title: "Task Completion Review",
    employee: "Omar Ali",
    details: "Dashboard Responsiveness",
    date: "Nov 18, 2026",
    type: "Task",
  },
  {
    id: 3,
    title: "Overtime Request",
    employee: "Sara Hassan",
    details: "3 additional hours",
    date: "Nov 17, 2026",
    type: "Overtime",
  },
];

// Recent Activities
const recentActivities = [
  {
    title: "Ahmed Mohamed completed a task",
    description: "Authentication UI implementation",
    time: "10 minutes ago",
    icon: <CheckCircleOutlineRounded />,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Sara Hassan updated a project",
    description: "Mobile Application progress changed to 45%",
    time: "1 hour ago",
    icon: <TrendingUpRounded />,
    color: "#2563EB",
    background: "#DBEAFE",
  },
  {
    title: "Omar Ali submitted a task",
    description: "Dashboard Responsiveness",
    time: "3 hours ago",
    icon: <AssignmentTurnedInOutlined />,
    color: "#7C3AED",
    background: "#EDE9FE",
  },
  {
    title: "Mohamed Adel completed a task",
    description: "Database Schema Update",
    time: "Yesterday",
    icon: <CheckCircleOutlineRounded />,
    color: "#16A34A",
    background: "#DCFCE7",
  },
];

// Shared Card Style
const cardStyle = {
  p: 2.5,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 3,
  boxShadow: "0 2px 8px rgba(23, 54, 93, 0.025)",
};

// Date Helpers
const getCurrentDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Section Header
function SectionHeader({ title, subtitle, action }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      mb={2.5}
    >
      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.5}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      {action}
    </Stack>
  );
}

// Overview Card
function OverviewCard({ item }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...cardStyle,
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(23, 54, 93, 0.08)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Avatar
          sx={{
            width: 46,
            height: 46,
            bgcolor: item.background,
            color: item.color,
            borderRadius: 2.5,
          }}
        >
          {item.icon}
        </Avatar>

        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <MoreHorizRounded />
        </IconButton>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={0.5}>
        {item.title}
      </Typography>

      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.3,
          mb: 1,
        }}
      >
        {item.value}
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={0.5}
      >
        <Typography variant="caption" color="text.secondary">
          {item.description}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: item.color, fontWeight: 600 }}
        >
          {item.trend}
        </Typography>
      </Stack>
    </Paper>
  );
}

// Project Card
function ProjectCard({ project }) {
  const statusColor =
    project.status === "On Track"
      ? "success"
      : project.status === "Near Deadline"
        ? "warning"
        : "info";

  return (
    <Box sx={{ py: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
        mb={1.5}
      >
        <Box>
          <Typography fontWeight={600} fontSize={14} mb={0.5}>
            {project.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {project.team}
          </Typography>
        </Box>

        <Typography fontWeight={700} color="primary.main">
          {project.progress}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={project.progress}
        sx={{
          height: 8,
          borderRadius: 5,
          bgcolor: "#E2E8F0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
          },
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mt={1.5}
      >
        <Typography variant="caption" color="text.secondary">
          <CalendarTodayOutlined
            sx={{ fontSize: 13, verticalAlign: "middle", mr: 0.5 }}
          />
          {project.deadline}
        </Typography>

        <Chip
          label={project.status}
          size="small"
          color={statusColor}
          variant="outlined"
        />
      </Stack>
    </Box>
  );
}

// Team Performance Item
function TeamMemberItem({ member, index }) {
  return (
    <Box sx={{ py: 1.8 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: ["#DBEAFE", "#DCFCE7", "#EDE9FE"][index],
            color: ["#2563EB", "#16A34A", "#7C3AED"][index],
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {member.initials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize={13}>
            {member.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {member.role}
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography fontWeight={700} fontSize={14}>
            {member.completed}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Tasks done
          </Typography>
        </Box>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={member.progress}
        sx={{
          mt: 1.5,
          height: 6,
          borderRadius: 5,
          bgcolor: "#E2E8F0",
        }}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="right"
        mt={0.5}
      >
        {member.progress}% completion
      </Typography>
    </Box>
  );
}

// Task Table
function TasksTable() {
  const statusColors = {
    "In Progress": "info",
    Pending: "warning",
    Overdue: "error",
    Completed: "success",
  };

  const priorityColors = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "#F8FAFC",
              "& th": {
                color: "text.secondary",
                fontWeight: 600,
                fontSize: 12,
                whiteSpace: "nowrap",
                borderBottom: "1px solid #E2E8F0",
              },
            }}
          >
            <TableCell>Task</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.title}
              hover
              sx={{
                "& td": {
                  borderBottom: "1px solid #F1F5F9",
                  py: 2,
                },
              }}
            >
              <TableCell>
                <Typography fontWeight={600} fontSize={13}>
                  {task.title}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {task.project}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontSize={13}>{task.assignee}</Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={task.priority}
                  color={priorityColors[task.priority]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Typography fontSize={12} color="text.secondary">
                  {task.dueDate}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={task.status}
                  color={statusColors[task.status]}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Approval Item
function ApprovalItem({ approval, onApprove, onReject }) {
  return (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: "#DBEAFE",
            color: "#2563EB",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {approval.employee
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <Typography fontWeight={600} fontSize={13}>
              {approval.employee}
            </Typography>

            <Chip
              label={approval.type}
              size="small"
              variant="outlined"
              color="info"
            />
          </Stack>

          <Typography fontSize={13} mt={0.5}>
            {approval.title}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {approval.details} • {approval.date}
          </Typography>

          <Stack direction="row" spacing={1} mt={1.5}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => onApprove(approval.id)}
              sx={{ minWidth: 85, textTransform: "none" }}
            >
              Approve
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onReject(approval.id)}
              sx={{ minWidth: 75, textTransform: "none" }}
            >
              Reject
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

// Recent Activity Item
function ActivityItem({ activity, isLast }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ pb: isLast ? 0 : 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: activity.background,
            color: activity.color,
          }}
        >
          {activity.icon}
        </Avatar>

        {!isLast && (
          <Box
            sx={{
              width: "2px",
              flex: 1,
              minHeight: 25,
              bgcolor: "#E2E8F0",
              mt: 0.5,
            }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, pb: isLast ? 0 : 1 }}>
        <Typography fontWeight={600} fontSize={13}>
          {activity.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.4 }}
        >
          {activity.description}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.7}
        >
          {activity.time}
        </Typography>
      </Box>
    </Stack>
  );
}

// Main Dashboard
function TeamLeaderDashboard() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const navigate = useNavigate();

  const today = getCurrentDate();

  const [selectedDate, setSelectedDate] = useState(() => getCurrentDate());

  const isCurrentDay =
    selectedDate.toDateString() === today.toDateString();

  const goToPreviousDay = () => {
    setSelectedDate((current) => {
      const previousDay = new Date(current);
      previousDay.setDate(previousDay.getDate() - 1);
      return previousDay;
    });
  };

  const goToCurrentDay = () => {
    setSelectedDate(getCurrentDate());
  };

  const handleDateChange = (event) => {
    const value = event.target.value;

    if (!value) return;

    const [year, month, day] = value.split("-").map(Number);
    const newDate = new Date(year, month - 1, day);

    newDate.setHours(0, 0, 0, 0);

    if (newDate <= today) {
      setSelectedDate(newDate);
    }
  };

  const handleApprove = (id) => {
    setApprovals((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const handleReject = (id) => {
    setApprovals((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Welcome Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 23, md: 27 },
              fontWeight: 700,
              color: "#17365D",
              mb: 0.5,
            }}
          >
            Welcome back, Sara
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Here's what's happening with your team today.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <TextField
            type="date"
            size="small"
            value={formatInputDate(selectedDate)}
            onChange={handleDateChange}
            slotProps={{
              htmlInput: {
                max: formatInputDate(today),
              },
            }}
            sx={{
              width: 195,
              bgcolor: "#FFFFFF",
              "& .MuiOutlinedInput-root": {
                height: 36,
                borderRadius: 2,
                fontSize: 13,
              },
              "& .MuiInputBase-input": {
                py: 0.5,
              },
            }}
          />

          <Button
            variant="outlined"
            onClick={goToPreviousDay}
            disabled={
              selectedDate.getTime() <=
              new Date(1900, 0, 1).getTime()
            }
            sx={{
              height: 36,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Previous Day
          </Button>

          {!isCurrentDay && (
            <Button
              size="small"
              onClick={goToCurrentDay}
              sx={{
                height: 36,
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              Current Day
            </Button>
          )}

          <Button
            variant="contained"
            endIcon={<ArrowForwardRounded />}
            onClick={() => navigate("/reports")}
            sx={{
              height: 36,
              px: 2,
              whiteSpace: "nowrap",
            }}
          >
            View Reports
          </Button>
        </Stack>
      </Stack>

      {/* Overview Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {overviewData.map((item) => (
          <OverviewCard key={item.title} item={item} />
        ))}
      </Box>

      {/* Projects and Team Performance */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.5fr) minmax(300px, 1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        {/* Projects */}
        <Paper elevation={0} sx={cardStyle}>
          <SectionHeader
            title="Projects Progress"
            subtitle="Track your team's active projects."
            action={
              <Button
                size="small"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate("/projects")}
                sx={{ whiteSpace: "nowrap" }}
              >
                View All
              </Button>
            }
          />

          {projects.map((project, index) => (
            <Box key={project.name}>
              <ProjectCard project={project} />
              {index !== projects.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        {/* Team Performance */}
        <Paper elevation={0} sx={cardStyle}>
          <SectionHeader
            title="Team Performance"
            subtitle="Your team's task completion."
          />

          <Box
            sx={{
              bgcolor: "#F5F7FB",
              borderRadius: 2.5,
              p: 2,
              mb: 1,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Overall Completion
                </Typography>

                <Typography
                  fontSize={27}
                  fontWeight={700}
                  color="primary.main"
                >
                  78%
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#DBEAFE",
                  color: "#2563EB",
                }}
              >
                <TrendingUpRounded />
              </Avatar>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={78}
              sx={{
                mt: 1.5,
                height: 8,
                borderRadius: 5,
              }}
            />
          </Box>

          {teamPerformance.map((member, index) => (
            <Box key={member.name}>
              <TeamMemberItem member={member} index={index} />
              {index !== teamPerformance.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Tasks Overview */}
      <Paper elevation={0} sx={{ ...cardStyle, mb: 3 }}>
        <SectionHeader
          title="Tasks Overview"
          subtitle="Monitor your team's latest tasks and deadlines."
          action={
            <Button
              size="small"
              endIcon={<ArrowForwardRounded />}
              onClick={() => navigate("/tasks")}
              sx={{ whiteSpace: "nowrap" }}
            >
              View All
            </Button>
          }
        />

        <TasksTable />
      </Paper>

      {/* Approvals and Activities */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.1fr) minmax(0, 1fr)",
          },
          gap: 2.5,
          mb: 2,
        }}
      >
        {/* Pending Approvals */}
        <Paper elevation={0} sx={cardStyle}>
          <SectionHeader
            title="Pending Approvals"
            subtitle="Requests waiting for your review."
            action={
              <Chip
                label={`${approvals.length} Pending`}
                size="small"
                color={approvals.length > 0 ? "warning" : "success"}
              />
            }
          />

          {approvals.length > 0 ? (
            approvals.map((approval, index) => (
              <Box key={approval.id}>
                <ApprovalItem
                  approval={approval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />

                {index !== approvals.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box textAlign="center" py={4}>
              <CheckCircleOutlineRounded
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />

              <Typography fontWeight={600}>
                All caught up!
              </Typography>

              <Typography variant="body2" color="text.secondary">
                There are no pending approvals.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Recent Activities */}
        <Paper elevation={0} sx={cardStyle}>
          <SectionHeader
            title="Recent Activities"
            subtitle="Latest updates from your team."
            action={
              <IconButton size="small">
                <MoreHorizRounded />
              </IconButton>
            }
          />

          <Box sx={{ pt: 0.5 }}>
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={activity.title}
                activity={activity}
                isLast={index === recentActivities.length - 1}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default TeamLeaderDashboard;
