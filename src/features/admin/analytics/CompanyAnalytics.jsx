import { useMemo } from "react";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";

import {
  BusinessCenterOutlined,
  TaskAltOutlined,
  GroupsOutlined,
  TrendingUpOutlined,
  EventAvailableOutlined,
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
  LineChart,
  Line,
} from "recharts";

import { useAppData } from "../../../hooks/useAppData";

const STATUS_COLORS = {
  Completed: "#16A34A",
  "In Progress": "#2563EB",
  Planning: "#F59E0B",
  "On Hold": "#EF4444",
  Other: "#94A3B8",
};

const normalizeStatus = (status = "") => {
  const value = String(status).toLowerCase().trim();

  if (value === "completed" || value === "done") {
    return "Completed";
  }

  if (value === "in progress" || value === "in-progress") {
    return "In Progress";
  }

  if (value === "planning") {
    return "Planning";
  }

  if (value === "on hold" || value === "on-hold") {
    return "On Hold";
  }

  return "Other";
};

const normalizeTaskStatus = (status = "") => {
  const value = String(status).toLowerCase().trim();

  if (value === "completed" || value === "done") {
    return "Completed";
  }

  if (value === "in progress" || value === "in-progress") {
    return "In Progress";
  }

  return "Pending";
};

const calculateProgress = (tasks = []) => {
  if (!tasks.length) return 0;

  const completed = tasks.filter(
    (task) => normalizeTaskStatus(task.status) === "Completed"
  ).length;

  return Math.round((completed / tasks.length) * 100);
};

// Reusable statistic card
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      height: "100%",
      minHeight: 140,
      boxSizing: "border-box",
      border: "1px solid #E8EDF4",
      borderRadius: 3,
      backgroundColor: "#FFFFFF",
      transition: "0.2s ease",
      "&:hover": {
        borderColor: "#CBD5E1",
        transform: "translateY(-2px)",
      },
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={1}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          color="#64748B"
          fontSize={13}
          fontWeight={500}
          sx={{ mb: 1.5 }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: "#17365D",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        <Typography color="#94A3B8" fontSize={11} sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 44,
          height: 44,
          minWidth: 44,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}14`,
          color,
        }}
      >
        {icon}
      </Box>
    </Stack>
  </Paper>
);

// Reusable chart container
const ChartCard = ({ title, subtitle, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 2.5 },
      height: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      border: "1px solid #E8EDF4",
      borderRadius: 3,
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
      transition: "0.2s ease",
      "&:hover": {
        borderColor: "#CBD5E1",
      },
    }}
  >
    <Box sx={{ minHeight: 42 }}>
      <Typography fontWeight={700} fontSize={15} color="#17365D">
        {title}
      </Typography>

      {subtitle && (
        <Typography color="#94A3B8" fontSize={11} sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>

    <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />

    <Box sx={{ width: "100%", height: 230, minWidth: 0 }}>
      {children}
    </Box>
  </Paper>
);

const SectionHeading = ({ title, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography fontSize={17} fontWeight={700} color="#17365D">
      {title}
    </Typography>

    {subtitle && (
      <Typography fontSize={12} color="#94A3B8" sx={{ mt: 0.4 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const EmptyState = ({ message }) => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      px: 2,
    }}
  >
    <Typography color="#94A3B8" fontSize={13}>
      {message}
    </Typography>
  </Box>
);

const CompanyAnalytics = () => {
  const { projects, employees, attendance } = useAppData();

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  const analytics = useMemo(() => {
    const projectStatuses = {
      Completed: 0,
      "In Progress": 0,
      Planning: 0,
      "On Hold": 0,
      Other: 0,
    };

    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let pendingTasks = 0;

    const projectPerformanceData = [];

    safeProjects.forEach((project) => {
      const tasks = Array.isArray(project.tasks) ? project.tasks : [];

      const progress = calculateProgress(tasks);

      const status =
        progress === 100
          ? "Completed"
          : normalizeStatus(project.status);

      projectStatuses[status]++;

      projectPerformanceData.push({
        name:
          project.name?.length > 13
            ? `${project.name.slice(0, 13)}...`
            : project.name || "Untitled",
        progress,
      });

      tasks.forEach((task) => {
        totalTasks++;

        const taskStatus = normalizeTaskStatus(task.status);

        if (taskStatus === "Completed") {
          completedTasks++;
        } else if (taskStatus === "In Progress") {
          inProgressTasks++;
        } else {
          pendingTasks++;
        }
      });
    });

    const totalProgress = projectPerformanceData.reduce(
      (sum, project) => sum + project.progress,
      0
    );

    const averageProgress = safeProjects.length
      ? Math.round(totalProgress / safeProjects.length)
      : 0;

    const projectStatusData = Object.entries(projectStatuses)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name],
      }));

    const taskCompletionRate = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalProjects: safeProjects.length,
      completedProjects: projectStatuses.Completed,
      averageProgress,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      taskCompletionRate,
      projectStatusData,
      projectPerformanceData,
    };
  }, [safeProjects]);

  // Workforce distribution
  const workforceData = useMemo(() => {
    const departments = {};

    safeEmployees.forEach((employee) => {
      const department = employee.department?.trim() || "Unassigned";

      departments[department] = (departments[department] || 0) + 1;
    });

    return Object.entries(departments)
      .map(([department, employeesCount]) => ({
        department,
        employees: employeesCount,
      }))
      .sort((a, b) => b.employees - a.employees);
  }, [safeEmployees]);

  const totalEmployees = safeEmployees.length;

  // Attendance analytics
  const attendanceAnalytics = useMemo(() => {
    const validRecords = safeAttendance.filter(
      (record) =>
        record.date &&
        ["present", "late", "absent"].includes(
          record.status?.toLowerCase()
        )
    );

    const totalRecords = validRecords.length;

    const presentRecords = validRecords.filter((record) =>
      ["present", "late"].includes(record.status.toLowerCase())
    );

    const presentCount = presentRecords.length;

    const averageAttendance = totalRecords
      ? Math.round((presentCount / totalRecords) * 100)
      : 0;

    // Group attendance by recorded date.
    const attendanceByDate = {};

    validRecords.forEach((record) => {
      const date = record.date;

      if (!attendanceByDate[date]) {
        attendanceByDate[date] = {
          total: 0,
          present: 0,
        };
      }

      attendanceByDate[date].total++;

      if (["present", "late"].includes(record.status.toLowerCase())) {
        attendanceByDate[date].present++;
      }
    });

    // Latest 7 dates that actually have attendance records.
    const attendanceTrend = Object.entries(attendanceByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-7)
      .map(([date, data]) => ({
        day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        }),
        rate: Math.round((data.present / data.total) * 100),
        date,
      }));

    return {
      totalRecords,
      presentCount,
      absentCount: validRecords.filter(
        (record) => record.status.toLowerCase() === "absent"
      ).length,
      averageAttendance,
      attendanceTrend,
    };
  }, [safeAttendance]);

  const taskStatusData = [
    { name: "Completed", value: analytics.completedTasks },
    { name: "In Progress", value: analytics.inProgressTasks },
    { name: "Pending", value: analytics.pendingTasks },
  ];

  const chartGridStyles = {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(3, minmax(0, 1fr))",
    },
    gap: 2.5,
    width: "100%",
    alignItems: "stretch",
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        width: "100%",
        maxWidth: "none",
        mx: 0,
        boxSizing: "border-box",
        backgroundColor: "#F5F7FB",
        minHeight: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 3.5 }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 24, md: 28 },
              fontWeight: 700,
              color: "#17365D",
              letterSpacing: "-0.5px",
            }}
          >
            Company Analytics
          </Typography>

          <Typography color="#64748B" fontSize={13} sx={{ mt: 0.6 }}>
            Monitor company performance and business insights.
          </Typography>
        </Box>

        <Chip
          label="Company Overview"
          variant="outlined"
          sx={{
            height: 30,
            borderRadius: 2,
            borderColor: "#BFDBFE",
            backgroundColor: "#EFF6FF",
            color: "#2563EB",
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </Stack>

      {/* Statistics */}
      <SectionHeading
        title="Performance Overview"
        subtitle="Key metrics across your company"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          width: "100%",
          mb: 3,
        }}
      >
        <StatCard
          title="Total Projects"
          value={analytics.totalProjects}
          subtitle="Across the company"
          icon={<BusinessCenterOutlined />}
          color="#2563EB"
        />

        <StatCard
          title="Completed Projects"
          value={analytics.completedProjects}
          subtitle="Successfully completed"
          icon={<TaskAltOutlined />}
          color="#16A34A"
        />

        <StatCard
          title="Task Completion"
          value={`${analytics.taskCompletionRate}%`}
          subtitle={`${analytics.completedTasks} of ${analytics.totalTasks} tasks`}
          icon={<TrendingUpOutlined />}
          color="#7C3AED"
        />

        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Registered company employees"
          icon={<GroupsOutlined />}
          color="#D97706"
        />
      </Box>

      {/* Overall Project Progress */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3.5,
          border: "1px solid #E8EDF4",
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography fontWeight={700} fontSize={15} color="#17365D">
              Overall Project Progress
            </Typography>

            <Typography color="#94A3B8" fontSize={11} sx={{ mt: 0.5 }}>
              Average completion across all company projects
            </Typography>
          </Box>

          <Typography fontWeight={700} fontSize={24} color="#2563EB">
            {analytics.averageProgress}%
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={analytics.averageProgress}
          sx={{
            height: 9,
            borderRadius: 5,
            backgroundColor: "#E8EDF4",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              backgroundColor: "#2563EB",
            },
          }}
        />

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography fontSize={10} color="#94A3B8">
            0%
          </Typography>

          <Typography fontSize={10} color="#94A3B8">
            100%
          </Typography>
        </Stack>
      </Paper>

      {/* Analytics Charts */}
      <SectionHeading
        title="Company Insights"
        subtitle="A complete overview of projects, tasks, workforce and attendance"
      />

      <Box sx={chartGridStyles}>
        {/* Projects by Status */}
        <ChartCard
          title="Projects by Status"
          subtitle="Distribution based on project progress and status"
        >
          {analytics.projectStatusData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={3}
                >
                  {analytics.projectStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No project data available yet." />
          )}
        </ChartCard>

        {/* Project Performance */}
        <ChartCard
          title="Project Performance"
          subtitle="Completion percentage for each project"
        >
          {analytics.projectPerformanceData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.projectPerformanceData}
                margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8EDF4"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  width={35}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Progress"]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF4",
                    fontSize: 11,
                  }}
                />

                <Bar
                  dataKey="progress"
                  name="Progress"
                  fill="#2563EB"
                  radius={[5, 5, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No project data available yet." />
          )}
        </ChartCard>

        {/* Tasks Overview */}
        <ChartCard
          title="Tasks Overview"
          subtitle="Current task status across all projects"
        >
          {analytics.totalTasks ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskStatusData}
                margin={{ top: 15, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8EDF4"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF4",
                    fontSize: 11,
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Tasks"
                  radius={[5, 5, 0, 0]}
                  barSize={30}
                >
                  <Cell fill="#16A34A" />
                  <Cell fill="#2563EB" />
                  <Cell fill="#F59E0B" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No task data available yet." />
          )}
        </ChartCard>

        {/* Workforce Distribution */}
        <ChartCard
          title="Workforce Distribution"
          subtitle="Employees across company departments"
        >
          {workforceData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workforceData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E8EDF4"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="department"
                  width={82}
                  tick={{ fontSize: 9, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="employees"
                  name="Employees"
                  fill="#7C3AED"
                  radius={[0, 5, 5, 0]}
                  barSize={17}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No employee data available yet." />
          )}
        </ChartCard>

        {/* Attendance Trend */}
        <ChartCard
          title="Attendance Trend"
          subtitle="Latest 7 recorded attendance dates"
        >
          {attendanceAnalytics.attendanceTrend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceAnalytics.attendanceTrend}
                margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8EDF4"
                />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  width={35}
                />

                <Tooltip
                  formatter={(value) => [`${value}%`, "Attendance"]}
                  labelFormatter={(label, payload) =>
                    payload?.[0]?.payload?.date || label
                  }
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #E8EDF4",
                    fontSize: 11,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#16A34A",
                    strokeWidth: 2,
                    stroke: "#FFFFFF",
                  }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No attendance records available yet." />
          )}
        </ChartCard>

        {/* Average Attendance */}
        <ChartCard
          title="Average Attendance"
          subtitle="Based on recorded employee attendance"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%", textAlign: "center" }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <EventAvailableOutlined fontSize="large" />
            </Box>

            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                color: "#17365D",
                lineHeight: 1.2,
              }}
            >
              {attendanceAnalytics.averageAttendance}%
            </Typography>

            <Chip
              label={
                attendanceAnalytics.totalRecords
                  ? `${attendanceAnalytics.presentCount} attended / ${attendanceAnalytics.totalRecords} records`
                  : "No Attendance Data"
              }
              size="small"
              sx={{
                mt: 1.5,
                backgroundColor: "#F0FDF4",
                color: "#15803D",
                fontWeight: 600,
                fontSize: 10,
              }}
            />

            <Typography
              color="#94A3B8"
              fontSize={10}
              sx={{ mt: 1.5, maxWidth: 230, lineHeight: 1.6 }}
            >
              Present and late records are counted as attendance.
              Missing records are not automatically counted as absences.
            </Typography>
          </Stack>
        </ChartCard>
      </Box>

      {/* Data Notice */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2.5,
          backgroundColor: "#EFF6FF",
          border: "1px solid #DBEAFE",
        }}
      >
        <Typography fontSize={12} color="#1E40AF" lineHeight={1.7}>
          <strong>Data information:</strong> All analytics are calculated
          from shared employees, projects, tasks, and attendance records.
          Figures update automatically when shared data changes.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CompanyAnalytics;