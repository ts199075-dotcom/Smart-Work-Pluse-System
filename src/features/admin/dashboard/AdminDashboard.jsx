import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import {
  GroupsOutlined,
  BusinessCenterOutlined,
  CheckCircleOutlineRounded,
  TrendingUpRounded,
  AssignmentTurnedInOutlined,
  PendingActionsOutlined,
  PlayCircleOutlineRounded,
  SearchRounded,
  EventNoteOutlined,
  AccessTimeRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import { useAppData } from "../../../hooks/useAppData";
import StatCard from "../../../components/common/StatCard";
import { formatDate, formatNumber } from "../../../utils/formatters";

import {
  calculateProjectProgress,
} from "../../team-leader/projects/projectsData";

// ==============================
// Constants
// ==============================

const chartColors = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#94A3B8",
];

const statusColors = {
  "In Progress": "#2563EB",
  Completed: "#16A34A",
  "To Do": "#F59E0B",
  Other: "#94A3B8",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";

    case "In Progress":
      return "info";

    case "To Do":
      return "warning";

    default:
      return "default";
  }
};

const isProjectOverdue = (project) => {
  if (
    !project.endDate ||
    project.status === "Completed" ||
    calculateProjectProgress(project.tasks || []) === 100
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(`${project.endDate}T00:00:00`);

  return (
    !Number.isNaN(endDate.getTime()) &&
    endDate < today
  );
};

// ==============================
// Chart Card
// ==============================

function ChartCard({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: "1px solid #E8EDF5",
        height: "100%",
        minWidth: 0,

        transition: "box-shadow 0.2s ease",

        "&:hover": {
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Box>
          <Typography
            fontWeight={700}
            color="#17365D"
            fontSize={16}
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={12}
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        </Box>

        {action}
      </Stack>

      <Box sx={{ width: "100%", height: 270, mt: 2 }}>
        {children}
      </Box>
    </Paper>
  );
}

// ==============================
// Project Row
// ==============================

function ProjectRow({
  project,
  employees,
}) {
  const progress = calculateProjectProgress(
    project.tasks || []
  );

  const leader = employees.find(
    (employee) => employee.id === project.leaderId
  );

  const members =
    project.membersIds || project.memberIds || [];

  const overdue = isProjectOverdue(project);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 2,
        px: 1,
        borderBottom: "1px solid #F1F5F9",
        transition: "background-color 0.2s",

        "&:hover": {
          bgcolor: "#F8FAFC",
        },
      }}
    >
      <Box sx={{ width: "27%", pr: 1 }}>
        <Typography
          fontSize={13}
          fontWeight={600}
          noWrap
        >
          {project.name}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mt: 0.5 }}
        >
          <Typography
            fontSize={10}
            color="text.secondary"
            noWrap
          >
            Due: {formatDate(project.endDate, "No due date")}
          </Typography>

          {overdue && (
            <Chip
              label="Overdue"
              color="error"
              size="small"
              sx={{
                height: 18,
                fontSize: 9,
                fontWeight: 700,
              }}
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ width: "20%", pr: 1 }}>
        <Typography
          fontSize={12}
          color="text.secondary"
          noWrap
        >
          {leader?.name || "Not assigned"}
        </Typography>
      </Box>

      <Box sx={{ width: "15%" }}>
        <Typography
          fontSize={12}
          color="text.secondary"
        >
          {members.length}
        </Typography>
      </Box>

      <Box sx={{ width: "18%" }}>
        <Chip
          label={project.status || "Unknown"}
          size="small"
          color={getStatusColor(project.status)}
          sx={{
            fontSize: 10,
            fontWeight: 600,
            borderRadius: 1.5,
          }}
        />
      </Box>

      <Box sx={{ width: "20%", pr: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            color={overdue ? "error" : "primary"}
            sx={{
              flex: 1,
              height: 7,
              borderRadius: 5,
              bgcolor: "#E9EEF5",
            }}
          />

          <Typography
            fontSize={11}
            fontWeight={700}
          >
            {progress}%
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

// ==============================
// Main Admin Dashboard
// ==============================

export default function AdminDashboard() {
  const { employees, projects } = useAppData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ==============================
  // Employee Statistics
  // ==============================

  const totalEmployees = employees.length;

  const departmentsData = useMemo(() => {
    const departments = {};

    employees.forEach((employee) => {
      const department =
        employee.department || "Unassigned";

      departments[department] =
        (departments[department] || 0) + 1;
    });

    return Object.entries(departments).map(
      ([name, count]) => ({
        name,
        employees: count,
      })
    );
  }, [employees]);

  // ==============================
  // Project Statistics
  // ==============================

  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const overallProgress =
    totalProjects > 0
      ? Math.round(
          projects.reduce(
            (total, project) =>
              total +
              calculateProjectProgress(
                project.tasks || []
              ),
            0
          ) / totalProjects
        )
      : 0;

  const overdueProjects = projects.filter(
    isProjectOverdue
  ).length;

  // ==============================
  // Task Statistics
  // ==============================

  const allTasks = projects.flatMap(
    (project) => project.tasks || []
  );

  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = allTasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingTasks = allTasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const categorizedTasks =
    completedTasks +
    inProgressTasks +
    pendingTasks;

  const otherTasks = Math.max(
    0,
    allTasks.length - categorizedTasks
  );

  const totalTasks = allTasks.length;

  const taskCompletionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  // ==============================
  // Project Status Chart
  // ==============================

  const projectStatusData = [
    {
      name: "In Progress",
      value: activeProjects,
      color: statusColors["In Progress"],
    },
    {
      name: "Completed",
      value: completedProjects,
      color: statusColors.Completed,
    },
    {
      name: "To Do",
      value: projects.filter(
        (project) => project.status === "To Do"
      ).length,
      color: statusColors["To Do"],
    },
    {
      name: "Other",
      value: projects.filter(
        (project) =>
          ![
            "In Progress",
            "Completed",
            "To Do",
          ].includes(project.status)
      ).length,
      color: statusColors.Other,
    },
  ].filter((item) => item.value > 0);

  // ==============================
  // Tasks Chart
  // ==============================

  const taskStatusData = [
    {
      name: "Completed",
      tasks: completedTasks,
    },
    {
      name: "In Progress",
      tasks: inProgressTasks,
    },
    {
      name: "To Do",
      tasks: pendingTasks,
    },
    ...(otherTasks > 0
      ? [
          {
            name: "Other",
            tasks: otherTasks,
          },
        ]
      : []),
  ];

  // ==============================
  // Projects Progress
  // ==============================

  const projectsProgressData = projects.map(
    (project) => ({
      ...project,
      progress: calculateProjectProgress(
        project.tasks || []
      ),
    })
  );

  // ==============================
  // Project Search and Filters
  // ==============================

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const leader = employees.find(
        (employee) =>
          employee.id === project.leaderId
      );

      const matchesSearch = [
        project.name,
        leader?.name,
        project.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    projects,
    employees,
    searchTerm,
    statusFilter,
  ]);

  // ==============================
  // Recent Activities
  // ==============================

  const recentActivities = useMemo(() => {
    return projects
      .flatMap((project) =>
        (project.activities || []).map(
          (activity) => {
            const employee = employees.find(
              (item) => item.id === activity.userId
            );

            return {
              ...activity,
              projectName: project.name,
              userName: employee?.name || "Unknown User",
            };
          }
        )
      )
      .filter((activity) => activity.date)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 5);
  }, [projects, employees]);

  // ==============================
  // Render
  // ==============================

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
            sx={{
              fontSize: { xs: 24, md: 30 },
              letterSpacing: "-0.5px",
            }}
          >
            Company Overview
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={14}
            sx={{ mt: 0.7 }}
          >
            Monitor company performance and overall progress.
          </Typography>
        </Box>

        <Chip
          label="Admin Dashboard"
          color="primary"
          variant="outlined"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 0.5,
          }}
        />
      </Stack>

      {/* Statistics Cards */}

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
          title="Total Employees"
          value={formatNumber(totalEmployees)}
          subtitle="Registered company employees"
          icon={<GroupsOutlined />}
          color="#2563EB"
          bgColor="#EFF6FF"
        />

        <StatCard
          title="Active Projects"
          value={formatNumber(activeProjects)}
          subtitle={`${totalProjects} projects in total`}
          icon={<BusinessCenterOutlined />}
          color="#D97706"
          bgColor="#FFFBEB"
        />

        <StatCard
          title="Completed Projects"
          value={formatNumber(completedProjects)}
          subtitle={`${overallProgress}% average progress`}
          icon={<CheckCircleOutlineRounded />}
          color="#16A34A"
          bgColor="#F0FDF4"
        />

        <StatCard
          title="Tasks Completion"
          value={`${taskCompletionRate}%`}
          subtitle={`${completedTasks} of ${totalTasks} tasks completed`}
          icon={<TrendingUpRounded />}
          color="#7C3AED"
          bgColor="#F5F3FF"
        />
      </Box>

      {/* Charts */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >

        {/* Projects Status */}

        <ChartCard
          title="Projects Status"
          subtitle="Distribution of company projects"
          action={
            <Chip
              label={`${totalProjects} Total`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          }
        >
          {totalProjects > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  stroke="none"
                >
                  {projectStatusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF5",
                    fontSize: 12,
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={35}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No project data available." />
          )}

          {totalProjects > 0 && (
            <Box
              sx={{
                position: "relative",
                pointerEvents: "none",
                height: 0,
                display: "flex",
                justifyContent: "center",
                top: -165,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  fontSize={25}
                  fontWeight={800}
                  color="#17365D"
                  lineHeight={1.2}
                >
                  {totalProjects}
                </Typography>

                <Typography
                  fontSize={10}
                  color="text.secondary"
                  fontWeight={600}
                >
                  Projects
                </Typography>
              </Box>
            </Box>
          )}
        </ChartCard>

        {/* Tasks Analytics */}

        <ChartCard
          title="Tasks Analytics"
          subtitle="Tasks distribution by current status"
        >
          {totalTasks > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={taskStatusData}
                margin={{
                  top: 25,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E9EEF5"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF5",
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="tasks"
                  name="Tasks"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={55}
                >
                  {taskStatusData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          chartColors[
                            index % chartColors.length
                          ]
                        }
                      />
                    )
                  )}

                  <LabelList
                    dataKey="tasks"
                    position="top"
                    fill="#17365D"
                    fontSize={12}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No task data available." />
          )}
        </ChartCard>

        {/* Department Distribution */}

        <ChartCard
          title="Department Distribution"
          subtitle="Employees distribution by department"
          action={
            <Chip
              label="Live Data"
              size="small"
              color="success"
              variant="outlined"
              sx={{
                fontSize: 10,
                fontWeight: 600,
              }}
            />
          }
        >
          {departmentsData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={departmentsData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E9EEF5"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF5",
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="employees"
                  name="Employees"
                  fill="#2563EB"
                  radius={[0, 7, 7, 0]}
                  barSize={18}
                >
                  <LabelList
                    dataKey="employees"
                    position="right"
                    fill="#17365D"
                    fontSize={11}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No employee data available." />
          )}
        </ChartCard>

        {/* Project Progress */}

        <ChartCard
          title="Project Progress"
          subtitle="Progress percentage for each project"
          action={
            overdueProjects > 0 ? (
              <Chip
                icon={<WarningAmberRounded />}
                label={`${overdueProjects} Overdue`}
                color="error"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: 10,
                }}
              />
            ) : null
          }
        >
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
              pr: 1,

              "&::-webkit-scrollbar": {
                width: 5,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#CBD5E1",
                borderRadius: 5,
              },
            }}
          >
            {projectsProgressData.length > 0 ? (
              <Stack spacing={2.3}>
                {projectsProgressData.map(
                  (project) => {
                    const overdue =
                      isProjectOverdue(project);

                    return (
                      <Box key={project.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 0.8 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.7}
                            sx={{ minWidth: 0 }}
                          >
                            <Typography
                              fontSize={13}
                              fontWeight={600}
                              noWrap
                            >
                              {project.name}
                            </Typography>

                            {overdue && (
                              <WarningAmberRounded
                                sx={{
                                  color: "#DC2626",
                                  fontSize: 16,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Stack>

                          <Typography
                            fontSize={13}
                            fontWeight={700}
                            color={
                              overdue
                                ? "#DC2626"
                                : "#17365D"
                            }
                          >
                            {project.progress}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          color={
                            overdue ? "error" : "primary"
                          }
                          sx={{
                            height: 9,
                            borderRadius: 5,
                            bgcolor: "#E9EEF5",

                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                            },
                          }}
                        />

                        {overdue && (
                          <Typography
                            fontSize={10}
                            color="error.main"
                            sx={{ mt: 0.5 }}
                          >
                            Deadline has passed
                          </Typography>
                        )}
                      </Box>
                    );
                  }
                )}
              </Stack>
            ) : (
              <EmptyState message="No project data available." />
            )}
          </Box>
        </ChartCard>
      </Box>

      {/* Projects Overview */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          border: "1px solid #E8EDF5",
          mb: 3,
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
            <Typography
              fontWeight={700}
              color="#17365D"
              fontSize={17}
            >
              Projects Overview
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={12}
              sx={{ mt: 0.5 }}
            >
              Track and monitor projects across the company.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
          >
            <TextField
              size="small"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              sx={{
                minWidth: { xs: "100%", sm: 220 },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              sx={{
                minWidth: { xs: "100%", sm: 145 },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontSize: 13,
                },
              }}
            >
              <MenuItem value="All">
                All Statuses
              </MenuItem>

              <MenuItem value="In Progress">
                In Progress
              </MenuItem>

              <MenuItem value="Completed">
                Completed
              </MenuItem>

              <MenuItem value="To Do">
                To Do
              </MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography
            fontSize={12}
            color="text.secondary"
          >
            Showing {filteredProjects.length} of{" "}
            {totalProjects} projects
          </Typography>

          {overdueProjects > 0 && (
            <Chip
              icon={<WarningAmberRounded />}
              label={`${overdueProjects} overdue`}
              color="error"
              size="small"
              sx={{ fontSize: 10 }}
            />
          )}
        </Stack>

        {filteredProjects.length > 0 ? (
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 720 }}>
              <Stack
                direction="row"
                sx={{
                  py: 1.5,
                  px: 1,
                  bgcolor: "#F8FAFC",
                  borderRadius: 2,
                }}
              >
                {[
                  "Project",
                  "Team Leader",
                  "Members",
                  "Status",
                  "Progress",
                ].map((heading, index) => (
                  <Typography
                    key={heading}
                    fontSize={12}
                    fontWeight={700}
                    color="text.secondary"
                    sx={{
                      width: [
                        "27%",
                        "20%",
                        "15%",
                        "18%",
                        "20%",
                      ][index],
                    }}
                  >
                    {heading}
                  </Typography>
                ))}
              </Stack>

              {filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  employees={employees}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <EmptyState
            message={
              projects.length === 0
                ? "No projects available."
                : "No projects match your search."
            }
          />
        )}
      </Paper>

      {/* Bottom Section */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >

        {/* Recent Activities */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #E8EDF5",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                fontWeight={700}
                color="#17365D"
                fontSize={17}
              >
                Recent Company Activities
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={12}
                sx={{ mt: 0.5 }}
              >
                Latest updates from company projects.
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                width: 38,
                height: 38,
              }}
            >
              <EventNoteOutlined />
            </Avatar>
          </Stack>

          <Stack spacing={2.2} sx={{ mt: 3 }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <Stack
                  key={`${activity.projectName}-${activity.id}-${index}`}
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      bgcolor: "#EFF6FF",
                      color: "#2563EB",
                      width: 38,
                      height: 38,
                    }}
                  >
                    <EventNoteOutlined fontSize="small" />
                  </Avatar>

                  <Box flex={1} minWidth={0}>
                    <Typography
                      fontSize={13}
                      fontWeight={600}
                    >
                      {activity.title}
                    </Typography>

                    <Typography
                      fontSize={12}
                      color="text.secondary"
                      sx={{ mt: 0.3 }}
                    >
                      {activity.userName} ·{" "}
                      {activity.projectName}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ mt: 0.7 }}
                    >
                      <AccessTimeRounded
                        sx={{
                          fontSize: 13,
                          color: "text.disabled",
                        }}
                      />

                      <Typography
                        fontSize={11}
                        color="text.disabled"
                      >
                        {formatDate(activity.date)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ))
            ) : (
              <EmptyState message="No recent project activities." />
            )}
          </Stack>
        </Paper>

        {/* Company Overview */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #E8EDF5",
          }}
        >
          <Typography
            fontWeight={700}
            color="#17365D"
            fontSize={17}
          >
            Company Overview
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={12}
            sx={{ mt: 0.5 }}
          >
            Current workforce and project summary.
          </Typography>

          <Stack spacing={2.2} sx={{ mt: 3 }}>
            <OverviewItem
              icon={<GroupsOutlined />}
              title="Total Employees"
              value={totalEmployees}
              color="#2563EB"
              bgColor="#EFF6FF"
            />

            <Divider />

            <OverviewItem
              icon={<AssignmentTurnedInOutlined />}
              title="Completed Tasks"
              value={completedTasks}
              color="#16A34A"
              bgColor="#F0FDF4"
            />

            <Divider />

            <OverviewItem
              icon={<PendingActionsOutlined />}
              title="Pending Tasks"
              value={pendingTasks}
              color="#D97706"
              bgColor="#FFFBEB"
            />

            <Divider />

            <OverviewItem
              icon={<PlayCircleOutlineRounded />}
              title="Active Projects"
              value={activeProjects}
              color="#2563EB"
              bgColor="#EFF6FF"
            />

            <Divider />

            <OverviewItem
              icon={<WarningAmberRounded />}
              title="Overdue Projects"
              value={overdueProjects}
              color="#DC2626"
              bgColor="#FEF2F2"
            />
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

// ==============================
// Overview Item
// ==============================

function OverviewItem({
  icon,
  title,
  value,
  color,
  bgColor,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
      >
        <Avatar
          sx={{
            bgcolor: bgColor,
            color,
            width: 38,
            height: 38,
          }}
        >
          {icon}
        </Avatar>

        <Typography
          fontSize={13}
          fontWeight={500}
        >
          {title}
        </Typography>
      </Stack>

      <Typography
        fontWeight={800}
        color="#17365D"
        fontSize={15}
      >
        {formatNumber(value)}
      </Typography>
    </Stack>
  );
}

// ==============================
// Empty State
// ==============================

function EmptyState({ message }) {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
        color: "text.secondary",
      }}
    >
      <BusinessCenterOutlined
        sx={{
          fontSize: 32,
          opacity: 0.35,
        }}
      />

      <Typography fontSize={13}>
        {message}
      </Typography>
    </Box>
  );
}