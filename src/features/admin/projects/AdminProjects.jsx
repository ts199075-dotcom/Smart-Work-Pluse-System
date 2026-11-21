/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import {
  FolderOutlined,
  CheckCircleOutlineRounded,
  PendingActionsOutlined,
  WarningAmberRounded,
  SearchRounded,
  BusinessCenterOutlined,
  GroupsOutlined,
  AssignmentOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";

const getProjectStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return { label: "Completed", color: "success" };
    case "in progress":
      return { label: "In Progress", color: "info" };
    case "on hold":
      return { label: "On Hold", color: "warning" };
    case "planning":
      return { label: "Planning", color: "default" };
    default:
      return { label: status || "Unknown", color: "default" };
  }
};

const isOverdue = (project) => {
  if (!project.endDate || project.status === "Completed") return false;

  const endDate = new Date(project.endDate);
  if (Number.isNaN(endDate.getTime())) return false;

  endDate.setHours(23, 59, 59, 999);

  return endDate < new Date();
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getMemberCount = (members) => {
  return Array.isArray(members) ? members.length : 0;
};

const getTaskCount = (tasks) => {
  return Array.isArray(tasks) ? tasks.length : 0;
};

const getCompletedTasks = (tasks) => {
  if (!Array.isArray(tasks)) return 0;

  return tasks.filter((task) =>
    ["completed", "done"].includes(task.status?.toLowerCase())
  ).length;
};

function StatCard({ title, value, subtitle, icon, color, bgColor }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #E8EDF5",
        height: "100%",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography fontSize={13} fontWeight={600} color="text.secondary">
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            color="#17365D"
            sx={{ mt: 1 }}
          >
            {value}
          </Typography>

          <Typography fontSize={11} color="text.secondary" sx={{ mt: 0.8 }}>
            {subtitle}
          </Typography>
        </Box>

        <Avatar
          sx={{
            bgcolor: bgColor,
            color,
            width: 48,
            height: 48,
            borderRadius: 2.5,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

export default function AdminProjects({ projects = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const safeProjects = Array.isArray(projects) ? projects : [];

  const totalProjects = safeProjects.length;

  const completedProjects = safeProjects.filter(
    (project) => project.status?.toLowerCase() === "completed"
  ).length;

  const inProgressProjects = safeProjects.filter(
    (project) => project.status?.toLowerCase() === "in progress"
  ).length;

  const overdueProjects = safeProjects.filter(isOverdue).length;

  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return safeProjects.filter((project) => {
      const matchesSearch =
        project.name?.toLowerCase().includes(search) ||
        project.leader?.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [safeProjects, searchTerm, statusFilter]);

  const averageProgress =
    totalProjects > 0
      ? Math.round(
          safeProjects.reduce(
            (total, project) =>
              total + Math.min(100, Math.max(0, Number(project.progress) || 0)),
            0
          ) / totalProjects
        )
      : 0;

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            color="#17365D"
            sx={{ fontSize: { xs: 24, md: 30 } }}
          >
            Projects Overview
          </Typography>

          <Typography
            fontSize={14}
            color="text.secondary"
            sx={{ mt: 0.7 }}
          >
            Monitor all company projects, progress, and team performance.
          </Typography>
        </Box>

        <Chip
          icon={<BusinessCenterOutlined />}
          label="Company-wide View"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 2 }}
        />
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
        <StatCard
          title="Total Projects"
          value={totalProjects}
          subtitle="All company projects"
          icon={<FolderOutlined />}
          color="#2563EB"
          bgColor="#EFF6FF"
        />

        <StatCard
          title="In Progress"
          value={inProgressProjects}
          subtitle="Currently active projects"
          icon={<PendingActionsOutlined />}
          color="#0891B2"
          bgColor="#ECFEFF"
        />

        <StatCard
          title="Completed"
          value={completedProjects}
          subtitle="Successfully completed"
          icon={<CheckCircleOutlineRounded />}
          color="#16A34A"
          bgColor="#F0FDF4"
        />

        <StatCard
          title="Overdue Projects"
          value={overdueProjects}
          subtitle="Passed their due date"
          icon={<WarningAmberRounded />}
          color="#DC2626"
          bgColor="#FEF2F2"
        />
      </Box>

      {/* Overall Progress */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #E8EDF5",
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Box>
            <Typography fontSize={16} fontWeight={800} color="#17365D">
              Overall Project Progress
            </Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.4 }}>
              Average completion across all company projects.
            </Typography>
          </Box>

          <Typography fontSize={22} fontWeight={800} color="#2563EB">
            {averageProgress}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={averageProgress}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: "#E2E8F0",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              bgcolor: "#2563EB",
            },
          }}
        />
      </Paper>

      {/* Projects Table */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: "1px solid #E8EDF5",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography fontSize={17} fontWeight={800} color="#17365D">
              All Projects
            </Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
              Track project ownership, progress, and deadlines.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <TextField
              size="small"
              placeholder="Search projects or leaders..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 240 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Planning">Planning</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Typography fontSize={12} color="text.secondary" sx={{ mb: 1.5 }}>
          Showing {filteredProjects.length} of {totalProjects} projects
        </Typography>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {[
                  "Project",
                  "Team Leader",
                  "Team",
                  "Tasks",
                  "Progress",
                  "Status",
                  "Due Date",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#64748B",
                      borderBottom: "none",
                      py: 1.8,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const status = getProjectStatus(project.status);
                  const tasks = Array.isArray(project.tasks)
                    ? project.tasks
                    : [];

                  const completedTasks = getCompletedTasks(tasks);
                  const progress = Math.min(
                    100,
                    Math.max(0, Number(project.progress) || 0)
                  );

                  const overdue = isOverdue(project);

                  return (
                    <TableRow
                      key={project.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      {/* Project */}
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 38,
                              height: 38,
                              bgcolor: "#EFF6FF",
                              color: "#2563EB",
                            }}
                          >
                            <FolderOutlined fontSize="small" />
                          </Avatar>

                          <Box sx={{ minWidth: 150 }}>
                            <Typography
                              fontSize={13}
                              fontWeight={700}
                              color="#17365D"
                            >
                              {project.name}
                            </Typography>

                            <Typography
                              fontSize={11}
                              color="text.secondary"
                              sx={{
                                maxWidth: 190,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {project.description || "No description"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Team Leader */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: "#F1F5F9",
                              color: "#475569",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {(project.leader || "N").charAt(0).toUpperCase()}
                          </Avatar>

                          <Typography fontSize={12} fontWeight={600}>
                            {project.leader || "Not assigned"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Team Members */}
                      <TableCell>
                        <Stack direction="row" spacing={0.7} alignItems="center">
                          <GroupsOutlined
                            fontSize="small"
                            sx={{ color: "#64748B" }}
                          />

                          <Typography fontSize={12} color="text.secondary">
                            {getMemberCount(project.members)} Members
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Tasks */}
                      <TableCell>
                        <Stack spacing={0.4}>
                          <Typography fontSize={12} fontWeight={700}>
                            {completedTasks} / {getTaskCount(project.tasks)}
                          </Typography>

                          <Typography fontSize={10} color="text.secondary">
                            Completed
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Progress */}
                      <TableCell sx={{ minWidth: 150 }}>
                        <Stack spacing={0.7}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography fontSize={12} fontWeight={700}>
                              {progress}%
                            </Typography>
                          </Stack>

                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 7,
                              borderRadius: 5,
                              bgcolor: "#E2E8F0",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                bgcolor:
                                  progress === 100 ? "#16A34A" : "#2563EB",
                              },
                            }}
                          />
                        </Stack>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Stack spacing={0.6} alignItems="flex-start">
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 10, fontWeight: 700 }}
                          />

                          {overdue && (
                            <Typography
                              fontSize={10}
                              fontWeight={700}
                              color="error.main"
                            >
                              Overdue
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Due Date */}
                      <TableCell>
                        <Stack direction="row" spacing={0.7} alignItems="center">
                          <CalendarMonthOutlined
                            fontSize="small"
                            sx={{
                              color: overdue ? "#DC2626" : "#64748B",
                            }}
                          />

                          <Typography
                            fontSize={12}
                            fontWeight={overdue ? 700 : 500}
                            color={overdue ? "error.main" : "text.secondary"}
                          >
                            {formatDate(project.endDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 7 }}>
                    <BusinessCenterOutlined
                      sx={{ fontSize: 38, color: "#CBD5E1", mb: 1 }}
                    />

                    <Typography fontSize={13} color="text.secondary">
                      No projects found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer Information */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <AssignmentOutlined
          sx={{ fontSize: 16, color: "#94A3B8" }}
        />

        <Typography fontSize={11} color="text.secondary">
          Project information is displayed for monitoring purposes.
          Project management remains under the Team Leader's responsibility.
        </Typography>
      </Stack>
    </Box>
  );
}