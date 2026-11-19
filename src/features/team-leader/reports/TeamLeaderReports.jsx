
import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";

import {
  AssessmentRounded,
  TaskAltRounded,
  ScheduleRounded,
  TrendingUpRounded,
  DownloadRounded,
  LightbulbOutlined,
  PictureAsPdfRounded,
  GroupsRounded,
} from "@mui/icons-material";

// Temporary mock data.
// All task totals are calculated from member records.

const reportData = {
  week: {
    previousProductivity: 74,
    previousCompleted: 25,
    previousOverdue: 7,

    members: [
      { name: "Ahmed Mohamed", completed: 8, inProgress: 2, overdue: 0, productivity: 94 },
      { name: "Sara Ali", completed: 7, inProgress: 2, overdue: 0, productivity: 88 },
      { name: "Mohamed Hassan", completed: 5, inProgress: 3, overdue: 1, productivity: 76 },
      { name: "Omar Khaled", completed: 4, inProgress: 3, overdue: 2, productivity: 65 },
      { name: "Mona Ahmed", completed: 6, inProgress: 2, overdue: 0, productivity: 90 },
    ],

    projects: [
      { name: "Website Redesign", progress: 75, status: "In Progress" },
      { name: "Mobile Application", progress: 45, status: "In Progress" },
      { name: "HR System", progress: 100, status: "Completed" },
      { name: "Internal Dashboard", progress: 60, status: "In Progress" },
    ],
  },

  month: {
    previousProductivity: 79,
    previousCompleted: 91,
    previousOverdue: 9,

    members: [
      { name: "Ahmed Mohamed", completed: 24, inProgress: 4, overdue: 1, productivity: 92 },
      { name: "Sara Ali", completed: 20, inProgress: 3, overdue: 0, productivity: 88 },
      { name: "Mohamed Hassan", completed: 18, inProgress: 6, overdue: 2, productivity: 76 },
      { name: "Omar Khaled", completed: 15, inProgress: 5, overdue: 3, productivity: 68 },
      { name: "Mona Ahmed", completed: 22, inProgress: 2, overdue: 1, productivity: 90 },
    ],

    projects: [
      { name: "Website Redesign", progress: 65, status: "In Progress" },
      { name: "Mobile Application", progress: 25, status: "In Progress" },
      { name: "HR System", progress: 100, status: "Completed" },
      { name: "Internal Dashboard", progress: 80, status: "In Progress" },
    ],
  },

  quarter: {
    previousProductivity: 78,
    previousCompleted: 270,
    previousOverdue: 22,

    members: [
      { name: "Ahmed Mohamed", completed: 68, inProgress: 10, overdue: 3, productivity: 90 },
      { name: "Sara Ali", completed: 59, inProgress: 8, overdue: 2, productivity: 86 },
      { name: "Mohamed Hassan", completed: 52, inProgress: 14, overdue: 5, productivity: 74 },
      { name: "Omar Khaled", completed: 43, inProgress: 13, overdue: 7, productivity: 70 },
      { name: "Mona Ahmed", completed: 64, inProgress: 7, overdue: 2, productivity: 91 },
    ],

    projects: [
      { name: "Website Redesign", progress: 85, status: "In Progress" },
      { name: "Mobile Application", progress: 70, status: "In Progress" },
      { name: "HR System", progress: 100, status: "Completed" },
      { name: "Internal Dashboard", progress: 100, status: "Completed" },
    ],
  },
};

const periods = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
];

const formatChange = (current, previous) => {
  if (!previous) return { text: "No previous data", positive: null };

  const difference = current - previous;
  const percentage = Math.round((difference / previous) * 100);

  return {
    text: `${difference > 0 ? "+" : ""}${percentage}%`,
    positive: difference === 0 ? null : difference > 0,
  };
};

const getProductivityColor = (value) => {
  if (value >= 85) return "success";
  if (value >= 70) return "info";
  return "warning";
};

function TeamLeaderReports() {
  const [period, setPeriod] = useState("month");

  const data = reportData[period];

  const statistics = useMemo(() => {
    const completed = data.members.reduce(
      (sum, member) => sum + member.completed,
      0
    );

    const inProgress = data.members.reduce(
      (sum, member) => sum + member.inProgress,
      0
    );

    const overdue = data.members.reduce(
      (sum, member) => sum + member.overdue,
      0
    );

    const productivity = data.members.length
      ? Math.round(
          data.members.reduce(
            (sum, member) => sum + member.productivity,
            0
          ) / data.members.length
        )
      : 0;

    return {
      completed,
      inProgress,
      overdue,
      productivity,
      totalTasks: completed + inProgress + overdue,
    };
  }, [data]);

  const insights = useMemo(() => {
    const bestMember = [...data.members].sort(
      (a, b) => b.productivity - a.productivity
    )[0];

    const bestProject = [...data.projects].sort(
      (a, b) => b.progress - a.progress
    )[0];

    const completedProjects = data.projects.filter(
      (project) => project.status === "Completed"
    ).length;

    return {
      bestMember,
      bestProject,
      completedProjects,
      projectCount: data.projects.length,
    };
  }, [data]);

  const cards = [
    {
      title: "Completed Tasks",
      value: statistics.completed,
      icon: <TaskAltRounded />,
      color: "#16A34A",
      background: "#DCFCE7",
      change: formatChange(
        statistics.completed,
        data.previousCompleted
      ),
      lowerIsBetter: false,
    },
    {
      title: "In Progress",
      value: statistics.inProgress,
      icon: <AssessmentRounded />,
      color: "#2563EB",
      background: "#DBEAFE",
    },
    {
      title: "Overdue Tasks",
      value: statistics.overdue,
      icon: <ScheduleRounded />,
      color: "#DC2626",
      background: "#FEE2E2",
      change: formatChange(
        statistics.overdue,
        data.previousOverdue
      ),
      lowerIsBetter: true,
    },
    {
      title: "Team Productivity",
      value: `${statistics.productivity}%`,
      icon: <TrendingUpRounded />,
      color: "#9333EA",
      background: "#F3E8FF",
      change: formatChange(
        statistics.productivity,
        data.previousProductivity
      ),
    },
  ];

  const exportCSV = () => {
    const rows = [
      ["Team Leader Report"],
      ["Period", periods.find((item) => item.value === period)?.label],
      ["Generated At", new Date().toLocaleString()],
      [],
      ["Task Statistics"],
      ["Completed Tasks", statistics.completed],
      ["In Progress Tasks", statistics.inProgress],
      ["Overdue Tasks", statistics.overdue],
      ["Team Productivity", `${statistics.productivity}%`],
      [],
      ["Project Name", "Progress", "Status"],
      ...data.projects.map((project) => [
        project.name,
        `${project.progress}%`,
        project.status,
      ]),
      [],
      ["Member Name", "Completed", "In Progress", "Overdue", "Productivity"],
      ...data.members.map((member) => [
        member.name,
        member.completed,
        member.inProgress,
        member.overdue,
        `${member.productivity}%`,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `team-report-${period}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const periodLabel = periods.find(
      (item) => item.value === period
    )?.label;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      window.alert("Please allow pop-ups to export the PDF report.");
      return;
    }

    const projectRows = data.projects
      .map(
        (project) => `
          <tr>
            <td>${project.name}</td>
            <td>${project.progress}%</td>
            <td>${project.status}</td>
          </tr>
        `
      )
      .join("");

    const memberRows = data.members
      .map(
        (member) => `
          <tr>
            <td>${member.name}</td>
            <td>${member.completed}</td>
            <td>${member.inProgress}</td>
            <td>${member.overdue}</td>
            <td>${member.productivity}%</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Team Leader Report</title>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #172B4D;
              padding: 35px;
            }
            h1 { color: #17365D; margin-bottom: 5px; }
            h2 { margin-top: 30px; color: #17365D; }
            .muted { color: #64748B; font-size: 13px; }
            .stats {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-top: 25px;
            }
            .stat {
              border: 1px solid #E2E8F0;
              padding: 15px;
              border-radius: 10px;
            }
            .stat strong {
              display: block;
              font-size: 24px;
              margin-top: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #E2E8F0;
              padding: 11px;
              text-align: left;
              font-size: 12px;
            }
            th { background: #F1F5F9; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Team Leader Report</h1>
          <p class="muted">
            ${periodLabel} | Generated: ${new Date().toLocaleString()}
          </p>

          <div class="stats">
            <div class="stat">Completed Tasks<strong>${statistics.completed}</strong></div>
            <div class="stat">In Progress<strong>${statistics.inProgress}</strong></div>
            <div class="stat">Overdue Tasks<strong>${statistics.overdue}</strong></div>
            <div class="stat">Productivity<strong>${statistics.productivity}%</strong></div>
          </div>

          <h2>Project Progress</h2>
          <table>
            <thead><tr><th>Project</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>${projectRows}</tbody>
          </table>

          <h2>Team Productivity</h2>
          <table>
            <thead>
              <tr>
                <th>Member</th><th>Completed</th>
                <th>In Progress</th><th>Overdue</th><th>Productivity</th>
              </tr>
            </thead>
            <tbody>${memberRows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const periodLabel = periods.find(
    (item) => item.value === period
  )?.label;

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
          <Typography variant="h4" fontWeight={700} mb={1}>
            Team Reports
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            Analyze projects, tasks and team productivity.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <TextField
            select
            size="small"
            label="Time Period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            sx={{ minWidth: 160 }}
          >
            {periods.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<DownloadRounded />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>

          <Button
            variant="contained"
            startIcon={<PictureAsPdfRounded />}
            onClick={exportPDF}
            sx={{
              backgroundColor: "#17365D",
              "&:hover": { backgroundColor: "#102945" },
            }}
          >
            Export PDF
          </Button>
        </Stack>
      </Stack>

      {/* Overview Cards */}
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
        {cards.map((card) => (
          <Card
            key={card.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography fontSize={13} color="text.secondary">
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: card.background,
                    color: card.color,
                    fontSize: 23,
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Typography variant="h4" fontWeight={700} mb={0.5}>
                {card.value}
              </Typography>

              {card.change && (
                <Typography
                  fontSize={12}
                  color={
                    card.change.positive === null
                      ? "text.secondary"
                      : card.lowerIsBetter
                        ? card.change.positive
                          ? "error.main"
                          : "success.main"
                        : card.change.positive
                          ? "success.main"
                          : "error.main"
                  }
                >
                  {card.change.text} vs previous period
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Report Insights */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
            <LightbulbOutlined color="warning" />
            <Typography variant="h6" fontWeight={700}>
              Report Insights
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#F8FAFC" }}>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                Top Performer
              </Typography>
              <Typography fontWeight={700}>
                {insights.bestMember?.name ?? "No data"}
              </Typography>
              <Typography fontSize={13} color="success.main">
                {insights.bestMember?.productivity ?? 0}% productivity
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#F8FAFC" }}>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                Most Advanced Project
              </Typography>
              <Typography fontWeight={700}>
                {insights.bestProject?.name ?? "No data"}
              </Typography>
              <Typography fontSize={13} color="success.main">
                {insights.bestProject?.progress ?? 0}% completed
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#F8FAFC" }}>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                Projects Completed
              </Typography>
              <Typography fontWeight={700}>
                {insights.completedProjects} / {insights.projectCount}
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                During selected report period
              </Typography>
            </Box>
          </Box>

          {statistics.overdue > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#FEF2F2",
              }}
            >
              <Typography fontSize={13} color="error.main" fontWeight={600}>
                Attention: {statistics.overdue} overdue tasks need follow-up.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Task Distribution Chart */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Task Distribution
          </Typography>

          <Typography fontSize={13} color="text.secondary" mb={3}>
            Breakdown of team tasks for {periodLabel}.
          </Typography>

          {[
            {
              label: "Completed",
              value: statistics.completed,
              color: "#16A34A",
            },
            {
              label: "In Progress",
              value: statistics.inProgress,
              color: "#2563EB",
            },
            {
              label: "Overdue",
              value: statistics.overdue,
              color: "#DC2626",
            },
          ].map((item) => (
            <Box key={item.label} sx={{ mb: 2.5 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontSize={13} fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography fontSize={13} fontWeight={700}>
                  {item.value} tasks
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: 14,
                  backgroundColor: "#E2E8F0",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${
                      statistics.totalTasks
                        ? (item.value / statistics.totalTasks) * 100
                        : 0
                    }%`,
                    backgroundColor: item.color,
                    borderRadius: 5,
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Project Progress */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Project Progress
          </Typography>

          <Typography fontSize={13} color="text.secondary" mb={3}>
            Current progress across team projects.
          </Typography>

          <Stack spacing={3}>
            {data.projects.map((project) => (
              <Box key={project.name}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    gap: 1,
                  }}
                >
                  <Typography fontSize={14} fontWeight={600}>
                    {project.name}
                  </Typography>

                  <Chip
                    label={project.status}
                    size="small"
                    color={
                      project.status === "Completed" ? "success" : "info"
                    }
                  />
                </Stack>

                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", mb: 1 }}
                >
                  <Typography fontSize={12} color="text.secondary">
                    Progress
                  </Typography>
                  <Typography fontSize={12} fontWeight={700}>
                    {project.progress}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  color={project.progress === 100 ? "success" : "primary"}
                  sx={{
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: "#E2E8F0",
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Team Productivity */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
            <GroupsRounded color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Team Productivity
            </Typography>
          </Stack>

          <Typography fontSize={13} color="text.secondary" mb={3}>
            Individual performance during {periodLabel}.
          </Typography>

          <Stack spacing={2.5}>
            {[...data.members]
              .sort((a, b) => b.productivity - a.productivity)
              .map((member) => (
                <Box key={member.name}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography fontSize={14} fontWeight={600}>
                        {member.name}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {member.completed} completed tasks
                      </Typography>
                    </Box>

                    <Typography fontSize={14} fontWeight={700}>
                      {member.productivity}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={member.productivity}
                    color={getProductivityColor(member.productivity)}
                    sx={{
                      height: 9,
                      borderRadius: 5,
                      backgroundColor: "#E2E8F0",
                    }}
                  />
                </Box>
              ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography fontSize={12} color="text.secondary">
            Report period: {periodLabel} · {data.members.length} team members ·{" "}
            {data.projects.length} projects
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TeamLeaderReports;
