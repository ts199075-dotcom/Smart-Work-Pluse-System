import { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";

import {
  FolderRounded,
  AssignmentRounded,
  WarningAmberRounded,
  CheckCircleRounded,
  AccessTimeRounded,
  EventAvailableRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";
import { calculateProjectProgress } from "../../team-leader/projects/projectsData";
import StatCard from "../../../components/common/StatCard";
import { formatDate } from "../../../utils/formatters";

// Temporary employee until Backend Authentication is ready
const CURRENT_MEMBER_ID = 1;

const statusColors = {
  "In Progress": {
    bg: "#DBEAFE",
    color: "#1D4ED8",
  },
  Completed: {
    bg: "#DCFCE7",
    color: "#15803D",
  },
  "To Do": {
    bg: "#F1F5F9",
    color: "#475569",
  },
};

function StatusChip({ status }) {
  const style = statusColors[status] || statusColors["To Do"];

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        width: "fit-content",
        fontSize: 10,
        fontWeight: 600,
        bgcolor: style.bg,
        color: style.color,
      }}
    />
  );
}

function SectionHeader({ title }) {
  return (
    <Typography variant="h5" fontWeight={700} mb={2}>
      {title}
    </Typography>
  );
}

function isOverdue(task) {
  if (!task.deadline || task.status === "Completed") return false;

  const deadline = new Date(task.deadline);

  if (Number.isNaN(deadline.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return deadline < today;
}

function formatHours(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

function MemberDashboard() {
  const { employees, projects, attendance = [] } = useAppData();

  const currentMember = employees.find(
    (employee) => employee.id === CURRENT_MEMBER_ID
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const memberProjects = useMemo(() => {
    return projects.filter((project) => {
      const memberIds = project.memberIds || project.membersIds || [];
      return memberIds.includes(CURRENT_MEMBER_ID);
    });
  }, [projects]);

  const memberTasks = useMemo(() => {
    return memberProjects.flatMap((project) =>
      (project.tasks || [])
        .filter((task) => task.assignedToId === CURRENT_MEMBER_ID)
        .map((task) => ({
          ...task,
          projectId: project.id,
          projectName: project.name,
        }))
    );
  }, [memberProjects]);

  // Attendance records for the current member
  const memberAttendance = useMemo(() => {
   return attendance.filter(
    (record) =>
      record.employeeId === CURRENT_MEMBER_ID &&
      record.date.startsWith(currentMonth)
  );
 }, [attendance, currentMonth]);

  const attendanceSummary = useMemo(() => {
    const present = memberAttendance.filter(
      (record) => record.status === "present"
    ).length;

    const late = memberAttendance.filter(
      (record) => record.status === "late"
    ).length;

    const absent = memberAttendance.filter(
      (record) => record.status === "absent"
    ).length;

    const totalMinutes = memberAttendance.reduce(
      (total, record) => total + (Number(record.hours) || 0),
      0
    );

    return {
      present,
      late,
      absent,
      totalMinutes,
    };
  }, [memberAttendance]);

  const openTasks = memberTasks.filter(
    (task) => task.status !== "Completed"
  );

  const completedTasks = memberTasks.filter(
    (task) => task.status === "Completed"
  );

  const overdueTasks = memberTasks.filter(isOverdue);

  const activeProjects = memberProjects.filter(
    (project) => calculateProjectProgress(project.tasks || []) < 100
  );

  const today = new Date();

  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!currentMember) {
    return (
      <Box p={3}>
        <Typography color="error">
          Employee data could not be found.
        </Typography>
      </Box>
    );
  }

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
          <Typography variant="h3" mb={0.5} fontWeight={700}>
            {greeting}, {currentMember.name.split(" ")[0]}
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            {formattedDate}
          </Typography>
        </Box>

        <Chip
          label={currentMember.position}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Attendance Overview */}
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={1.5}
        >
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "#DBEAFE",
              color: "#2563EB",
              borderRadius: 1.5,
            }}
          >
            <EventAvailableRounded />
          </Avatar>

          <Box>
            <Typography fontWeight={700}>
              Attendance Overview
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              Your recorded attendance information
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Present Days
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {attendanceSummary.present}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              Late Days
            </Typography>
            <Typography variant="h5" fontWeight={700} color="warning.main">
              {attendanceSummary.late}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              Absent Days
            </Typography>
            <Typography variant="h5" fontWeight={700} color="error.main">
              {attendanceSummary.absent}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              Total Working Hours
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {formatHours(attendanceSummary.totalMinutes)}
            </Typography>
          </Box>
        </Box>

        {memberAttendance.length === 0 && (
          <Typography fontSize={12} color="text.secondary" mt={2}>
            No attendance records available yet.
          </Typography>
        )}
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
        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          description="Currently assigned"
          icon={<FolderRounded />}
          color="#2563EB"
          bg="#DBEAFE"
          iconPosition="start"
          hover={false}
        />

        <StatCard
          title="Open Tasks"
          value={openTasks.length}
          description="Tasks to complete"
          icon={<AssignmentRounded />}
          color="#D97706"
          bg="#FEF3C7"
          iconPosition="start"
          hover={false}
        />

        <StatCard
          title="Completed Tasks"
          value={completedTasks.length}
          description="Successfully completed"
          icon={<CheckCircleRounded />}
          color="#16A34A"
          bg="#DCFCE7"
          iconPosition="start"
          hover={false}
        />

        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          description="Need your attention"
          icon={<WarningAmberRounded />}
          color="#DC2626"
          bg="#FEE2E2"
          iconPosition="start"
          hover={false}
        />
      </Box>

      {/* Tasks and Projects */}
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
          <SectionHeader title="My Tasks" />

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px, 2fr) minmax(130px, 1.5fr) minmax(75px, 0.8fr) minmax(100px, 1fr)",
                minWidth: 550,
              }}
            >
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

              {memberTasks.length === 0 ? (
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    py: 5,
                    textAlign: "center",
                  }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    No tasks have been assigned to you yet.
                  </Typography>
                </Box>
              ) : (
                memberTasks.slice(0, 5).map((task) => (
                  <Box key={task.id} sx={{ display: "contents" }}>
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
                        {task.title}
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
                        {task.projectName}
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
                        {formatDate(task.deadline, "No deadline")}
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
                      <StatusChip status={task.status} />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {memberTasks.length > 5 && (
            <Typography
              fontSize={11}
              color="text.secondary"
              textAlign="center"
              mt={2}
            >
              Showing 5 of {memberTasks.length} assigned tasks.
            </Typography>
          )}
        </Paper>

        {/* Project Progress */}
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
          <SectionHeader title="My Projects" />

          {memberProjects.length === 0 ? (
            <Typography fontSize={13} color="text.secondary">
              You are not assigned to any projects yet.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {memberProjects.map((project) => {
                const progress = calculateProjectProgress(
                  project.tasks || []
                );

                return (
                  <Box key={project.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                      spacing={1}
                    >
                      <Typography
                        fontSize={12}
                        fontWeight={600}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {project.name}
                      </Typography>

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
                          bgcolor: "#2563EB",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}

          <Divider sx={{ my: 2.5 }} />

          {/* Working Hours */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "#FEF3C7",
                color: "#D97706",
                borderRadius: 1.5,
              }}
            >
              <AccessTimeRounded />
            </Avatar>

            <Box>
              <Typography fontSize={12} fontWeight={700}>
                Total Working Hours
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                {formatHours(attendanceSummary.totalMinutes)} recorded
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default MemberDashboard;