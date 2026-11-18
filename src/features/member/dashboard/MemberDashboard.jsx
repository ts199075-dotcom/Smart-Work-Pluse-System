import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";

import { ArrowForwardRounded } from "@mui/icons-material";

// Dashboard statistics
const stats = [
  {
    title: "Green cards this month",
    value: "12",
    description: "12 of 20 toward next reward",
    progress: 60,
    color: "#16A34A",
  },
  {
    title: "Blue cards (net after offset)",
    value: "0",
    description: "3 Blue offset by 3 Green · fine at 30",
    progress: 0,
    color: "#2563EB",
  },
  {
    title: "Black cards",
    value: "0",
    description: "0 of 30 · never cancelled by Green",
    progress: 0,
    color: "#111827",
  },
  {
    title: "Leave days used",
    value: "1 of 3",
    description: "Free days left this month: 2",
    progress: 33,
    color: "#F59E0B",
  },
];

// Sample tasks
const tasks = [
  {
    name: "Design leave balance widget",
    project: "HR Portal Revamp",
    due: "28 Oct",
    status: "In progress",
  },
  {
    name: "Review payroll export format",
    project: "Finance Automation",
    due: "29 Oct",
    status: "In review",
  },
  {
    name: "Write attendance API tests",
    project: "HR Portal Revamp",
    due: "25 Oct",
    status: "Overdue",
  },
  {
    name: "Prepare sprint demo notes",
    project: "Mobile Check-in",
    due: "02 Nov",
    status: "To do",
  },
  {
    name: "Update onboarding checklist",
    project: "People Ops",
    due: "04 Nov",
    status: "To do",
  },
];

// Weekly working hours
const weeklyHours = [
  { day: "Mon", hours: 8.6 },
  { day: "Tue", hours: 9.1 },
  { day: "Wed", hours: 8.2 },
  { day: "Thu", hours: 7.9 },
  { day: "Sun", hours: 4.5 },
];

// Task status colors
const statusColors = {
  "In progress": {
    bg: "#DBEAFE",
    color: "#1D4ED8",
  },
  "In review": {
    bg: "#FEF3C7",
    color: "#92400E",
  },
  Overdue: {
    bg: "#FEE2E2",
    color: "#B91C1C",
  },
  "To do": {
    bg: "#F1F5F9",
    color: "#475569",
  },
};

// Reusable section header
function SectionHeader({ title, action }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h5">{title}</Typography>

      {action && (
        <Button
          size="small"
          endIcon={<ArrowForwardRounded />}
          sx={{ fontSize: 12 }}
        >
          {action}
        </Button>
      )}
    </Box>
  );
}

function MemberDashboard() {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* Welcome Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h3" mb={0.5}>
            Good evening, Sara
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Monday, 26 October 2026 · Working hours 8:00 AM to 5:00 PM
          </Typography>
        </Box>

        <Button variant="outlined" size="small">
          View attendance history
        </Button>
      </Box>

      {/* Attendance Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "14px",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
              <Chip
                label="Checked in"
                size="small"
                sx={{
                  bgcolor: "#DCFCE7",
                  color: "#15803D",
                  fontWeight: 600,
                }}
              />

              <Chip
                label="Green card earned"
                size="small"
                sx={{
                  bgcolor: "#DCFCE7",
                  color: "#15803D",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Typography variant="h2" fontWeight={700}>
              7h 48m
            </Typography>

            <Typography color="text.secondary" fontSize={12} mt={1}>
              Checked in today at 07:52 AM · Check-out available from 5:00 PM
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button variant="contained" size="medium">
              Check out
            </Button>

            <Button variant="outlined" size="medium">
              Start overtime
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((stat) => (
          <Paper
            key={stat.title}
            elevation={0}
            sx={{
              p: 2.5,
              minWidth: 0,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
            }}
          >
            <Typography fontSize={12} color="text.secondary" mb={1}>
              {stat.title}
            </Typography>

            <Typography variant="h4" mb={1}>
              {stat.value}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={stat.progress}
              sx={{
                height: 5,
                borderRadius: 5,
                mb: 1.5,
                bgcolor: "#F1F5F9",
                "& .MuiLinearProgress-bar": {
                  bgcolor: stat.color,
                  borderRadius: 5,
                },
              }}
            />

            <Typography fontSize={11} color="text.secondary">
              {stat.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Tasks and Weekly Hours */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.7fr) minmax(280px, 1fr)",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* My Tasks */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            minWidth: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
          }}
        >
          <SectionHeader title="My tasks" action="View all" />

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 2fr) minmax(130px, 1.5fr) minmax(65px, 0.7fr) minmax(90px, 1fr)",
                minWidth: 550,
              }}
            >
              {/* Table Header */}
              {["TASK", "PROJECT", "DUE", "STATUS"].map((heading) => (
                <Box
                  key={heading}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    fontSize={10}
                    fontWeight={700}
                    color="text.secondary"
                  >
                    {heading}
                  </Typography>
                </Box>
              ))}

              {/* Table Rows */}
              {tasks.map((task) => (
                <Box
                  key={task.name}
                  sx={{
                    display: "contents",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.7,
                      pr: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography fontSize={12} fontWeight={600}>
                      {task.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.7,
                      pr: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography fontSize={11} color="text.secondary">
                      {task.project}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.7,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography fontSize={11} color="text.secondary">
                      {task.due}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      py: 1.7,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        width: "fit-content",
                        fontSize: 10,
                        fontWeight: 600,
                        bgcolor: statusColors[task.status].bg,
                        color: statusColors[task.status].color,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Weekly Hours */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            minWidth: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
          }}
        >
          <SectionHeader title="Hours this week" />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              alignItems: "end",
              height: 150,
              gap: 1,
              mt: 2,
            }}
          >
            {weeklyHours.map((item) => (
              <Box
                key={item.day}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                  minWidth: 0,
                  gap: 1,
                }}
              >
                <Typography fontSize={10} fontWeight={600}>
                  {item.hours}h
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 38,
                    height: `${(item.hours / 10) * 100}px`,
                    bgcolor: "#2563EB",
                    borderRadius: "5px 5px 0 0",
                  }}
                />

                <Typography fontSize={10} color="text.secondary">
                  {item.day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Overtime and Payslip */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                Overtime requests
              </Typography>

              <Typography fontSize={12} fontWeight={700}>
                1 pending
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                Last payslip (Sep 2026)
              </Typography>

              <Typography fontSize={12} fontWeight={700}>
                EGP 14,250 · Paid
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default MemberDashboard;