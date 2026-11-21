/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import {
  Box,
  Card,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  Avatar,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import {
  FolderRounded,
  AssignmentRounded,
  WarningAmberRounded,
  CheckCircleRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";
import { calculateProjectProgress } from "../../team-leader/projects/projectsData";

// Temporary employee until Backend Authentication is ready
const CURRENT_MEMBER_ID = 1;

const statusColors = {
  Active: { color: "#2563EB", bg: "#DBEAFE" },
  Done: { color: "#15803D", bg: "#DCFCE7" },
  Completed: { color: "#15803D", bg: "#DCFCE7" },
  "In Progress": { color: "#2563EB", bg: "#DBEAFE" },
  "To Do": { color: "#64748B", bg: "#F1F5F9" },
  High: { color: "#DC2626", bg: "#FEE2E2" },
  Medium: { color: "#D97706", bg: "#FEF3C7" },
  Low: { color: "#15803D", bg: "#DCFCE7" },
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

function formatDate(date) {
  if (!date) return "No deadline";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "No deadline";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function MemberProjectsTasks() {
  const { projects, setProjects, employees } = useAppData();

  const currentMember = employees.find(
    (employee) => employee.id === CURRENT_MEMBER_ID
  );

  // Projects where the current employee is a member
  const memberProjects = useMemo(() => {
    return projects.filter((project) => {
      const memberIds = project.memberIds || project.membersIds || [];
      return memberIds.includes(CURRENT_MEMBER_ID);
    });
  }, [projects]);

  // Tasks assigned specifically to the current employee
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

  const activeProjectsCount = memberProjects.filter(
   (project) => calculateProjectProgress(project.tasks || []) < 100
  ).length;

  const openTasksCount = memberTasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const overdueTasksCount = memberTasks.filter(isOverdue).length;

  const handleStatusChange = (projectId, taskId, newStatus) => {
    setProjects((previousProjects) =>
      previousProjects.map((project) => {
        if (project.id !== projectId) return project;

        return {
          ...project,
          tasks: (project.tasks || []).map((task) =>
            task.id === taskId && task.assignedToId === CURRENT_MEMBER_ID
              ? { ...task, status: newStatus }
              : task
          ),
        };
      })
    );
  };

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
          value={activeProjectsCount}
          subtitle="Currently assigned"
          icon={<FolderRounded />}
          color="#2563EB"
          bg="#DBEAFE"
        />

        <SummaryCard
          title="Open Tasks"
          value={openTasksCount}
          subtitle="Tasks to complete"
          icon={<AssignmentRounded />}
          color="#D97706"
          bg="#FEF3C7"
        />

        <SummaryCard
          title="Overdue Tasks"
          value={overdueTasksCount}
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

              {memberProjects.length === 0 ? (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  fontSize={13}
                  py={4}
                >
                  You are not assigned to any projects yet.
                </Typography>
              ) : (
                memberProjects.map((project) => {
                  const progress = calculateProjectProgress(
                    project.tasks || []
                  );

                  const leader = employees.find(
                    (employee) => employee.id === project.leaderId
                  );

                 const projectStatus = progress === 100 ? "Completed" : "Active";

                  return (
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
                          {leader?.name || "Not assigned"}
                        </Typography>

                        <Typography fontSize={12} fontWeight={600}>
                          {progress}%
                        </Typography>

                        <Box>
                          <StatusChip status={projectStatus} />
                        </Box>
                      </Box>

                      <Divider />
                    </Box>
                  );
                })
              )}
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

          {memberProjects.length === 0 ? (
            <Typography fontSize={13} color="text.secondary">
              No project progress to display.
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
                      mb={1}
                    >
                      <Typography fontSize={12} fontWeight={500}>
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
                        height: 8,
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
            label={`${memberTasks.length} Tasks`}
            size="small"
            sx={{
              bgcolor: "#DBEAFE",
              color: "#2563EB",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 650 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1.2fr 1fr 0.8fr 1.1fr",
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

            {memberTasks.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={13}
                py={4}
              >
                No tasks have been assigned to you yet.
              </Typography>
            ) : (
              memberTasks.map((task) => (
                <Box key={task.id}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 1.2fr 1fr 0.8fr 1.1fr",
                      gap: 1,
                      alignItems: "center",
                      py: 1.8,
                    }}
                  >
                    <Typography fontSize={12} fontWeight={600}>
                      {task.title}
                    </Typography>

                    <Typography fontSize={12}>
                      {task.projectName}
                    </Typography>

                    <Typography fontSize={11}>
                      {formatDate(task.deadline)}
                    </Typography>

                    <Box>
                      <StatusChip status={task.priority} />
                    </Box>

                    <FormControl size="small" fullWidth>
                      <Select
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(
                            task.projectId,
                            task.id,
                            event.target.value
                          )
                        }
                        sx={{
                          fontSize: 11,
                          borderRadius: 1.5,
                          "& .MuiSelect-select": {
                            py: 0.7,
                          },
                        }}
                      >
                        <MenuItem value="To Do">To Do</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Divider />
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default MemberProjectsTasks;