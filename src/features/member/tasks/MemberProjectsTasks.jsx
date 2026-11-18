import {
  Box,
  Card,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";

import {
  FolderRounded,
  AssignmentRounded,
  WarningAmberRounded,
  CheckCircleRounded,
} from "@mui/icons-material";

const projects = [
  {
    id: 1,
    name: "Customer Portal",
    lead: "Ahmed",
    progress: 72,
    status: "Active",
    color: "#2563EB",
  },
  {
    id: 2,
    name: "Mobile API",
    lead: "Sara",
    progress: 46,
    status: "Active",
    color: "#D97706",
  },
  {
    id: 3,
    name: "Internal Tools",
    lead: "Omar",
    progress: 100,
    status: "Done",
    color: "#16A34A",
  },
];

const tasks = [
  {
    id: 1,
    title: "Design login screen",
    project: "Customer Portal",
    dueDate: "Oct 28, 2026",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Implement API integration",
    project: "Mobile API",
    dueDate: "Oct 30, 2026",
    priority: "Medium",
    status: "To Do",
  },
  {
    id: 3,
    title: "Review dashboard UI",
    project: "Customer Portal",
    dueDate: "Oct 25, 2026",
    priority: "High",
    status: "Done",
  },
];

const statusColors = {
  Active: { color: "#2563EB", bg: "#DBEAFE" },
  Done: { color: "#15803D", bg: "#DCFCE7" },
  "In Progress": { color: "#2563EB", bg: "#DBEAFE" },
  "To Do": { color: "#64748B", bg: "#F1F5F9" },
  High: { color: "#DC2626", bg: "#FEE2E2" },
  Medium: { color: "#D97706", bg: "#FEF3C7" },
};

function StatusChip({ status }) {
  const style = statusColors[status] || statusColors.Active;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 24,
        borderRadius: 1.5,
        fontSize: 11,
        fontWeight: 600,
        color: style.color,
        backgroundColor: style.bg,
      }}
    />
  );
}

function SummaryCard({ title, value, icon, color, bg, subtitle }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar
          variant="rounded"
          sx={{
            width: 42,
            height: 42,
            bgcolor: bg,
            color,
            borderRadius: 1.5,
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography fontSize={12} color="text.secondary">
            {title}
          </Typography>

          <Typography fontSize={23} fontWeight={700}>
            {value}
          </Typography>

          <Typography fontSize={11} color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

function MemberProjectsTasks() {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant="h3" fontWeight={700} mb={0.5}>
          Projects & Tasks
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          Track your projects, assigned tasks, and work progress.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard
          title="Active Projects"
          value="3"
          subtitle="Currently assigned"
          icon={<FolderRounded />}
          color="#2563EB"
          bg="#DBEAFE"
        />

        <SummaryCard
          title="Open Tasks"
          value="8"
          subtitle="Tasks to complete"
          icon={<AssignmentRounded />}
          color="#D97706"
          bg="#FEF3C7"
        />

        <SummaryCard
          title="Overdue Tasks"
          value="2"
          subtitle="Need your attention"
          icon={<WarningAmberRounded />}
          color="#DC2626"
          bg="#FEE2E2"
        />
      </Box>

      {/* Projects and Progress */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.2fr 0.8fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Project Portfolio */}
        <Card
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            minWidth: 0,
          }}
        >
          <Typography fontSize={16} fontWeight={700} mb={2}>
            Project Portfolio
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 480 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 0.7fr 0.7fr 0.8fr",
                  gap: 1,
                  pb: 1.5,
                }}
              >
                {["PROJECT", "LEAD", "PROGRESS", "STATUS"].map((label) => (
                  <Typography
                    key={label}
                    fontSize={10}
                    fontWeight={700}
                    color="text.secondary"
                  >
                    {label}
                  </Typography>
                ))}
              </Box>

              <Divider />

              {projects.map((project) => (
                <Box key={project.id}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 0.7fr 0.7fr 0.8fr",
                      gap: 1,
                      alignItems: "center",
                      py: 2,
                    }}
                  >
                    <Typography fontSize={12} fontWeight={600}>
                      {project.name}
                    </Typography>

                    <Typography fontSize={12}>
                      {project.lead}
                    </Typography>

                    <Typography fontSize={12} fontWeight={600}>
                      {project.progress}%
                    </Typography>

                    <Box>
                      <StatusChip status={project.status} />
                    </Box>
                  </Box>

                  <Divider />
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {/* Project Progress */}
        <Card
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
          }}
        >
          <Typography fontSize={16} fontWeight={700} mb={2.5}>
            Project Progress
          </Typography>

          <Stack spacing={3}>
            {projects.map((project) => (
              <Box key={project.id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography fontSize={12} fontWeight={500}>
                    {project.name}
                  </Typography>

                  <Typography fontSize={12} fontWeight={700}>
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
                      bgcolor: project.color,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>

      {/* My Tasks */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontSize={16} fontWeight={700}>
            My Tasks
          </Typography>

          <Chip
            label={`${tasks.length} Tasks`}
            size="small"
            sx={{
              bgcolor: "#DBEAFE",
              color: "#2563EB",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 600 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.2fr 1fr 0.8fr 0.8fr",
                gap: 1,
                pb: 1.5,
              }}
            >
              {["TASK", "PROJECT", "DUE DATE", "PRIORITY", "STATUS"].map(
                (label) => (
                  <Typography
                    key={label}
                    fontSize={10}
                    fontWeight={700}
                    color="text.secondary"
                  >
                    {label}
                  </Typography>
                )
              )}
            </Box>

            <Divider />

            {tasks.map((task) => (
              <Box key={task.id}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1.2fr 1fr 0.8fr 0.8fr",
                    gap: 1,
                    alignItems: "center",
                    py: 1.8,
                  }}
                >
                  <Typography fontSize={12} fontWeight={600}>
                    {task.title}
                  </Typography>

                  <Typography fontSize={12}>
                    {task.project}
                  </Typography>

                  <Typography fontSize={11}>
                    {task.dueDate}
                  </Typography>

                  <Box>
                    <StatusChip status={task.priority} />
                  </Box>

                  <Box>
                    <StatusChip status={task.status} />
                  </Box>
                </Box>

                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default MemberProjectsTasks;