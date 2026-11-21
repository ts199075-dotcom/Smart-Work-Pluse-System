import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
  AvatarGroup,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  ArrowBackRounded,
  CalendarMonthRounded,
  PersonOutlineRounded,
  GroupsRounded,
  TaskAltRounded,
  AccessTimeRounded,
  PersonAddAlt1Rounded,
  CloseRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";
import { calculateProjectProgress } from "./projectsData";

const statusStyles = {
  "In Progress": { color: "#2563EB", backgroundColor: "#DBEAFE" },
  Planning: { color: "#B45309", backgroundColor: "#FEF3C7" },
  Completed: { color: "#15803D", backgroundColor: "#DCFCE7" },
  "On Hold": { color: "#64748B", backgroundColor: "#F1F5F9" },
};

const taskStatusStyles = {
  Completed: { color: "#15803D", backgroundColor: "#DCFCE7" },
  "In Progress": { color: "#2563EB", backgroundColor: "#DBEAFE" },
  "To Do": { color: "#B45309", backgroundColor: "#FEF3C7" },
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function TeamLeaderProjectDetails({ currentTeamLeader }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { projects, setProjects, employees } = useAppData();

  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentLeader = useMemo(
    () => employees.find((employee) => employee.name === currentTeamLeader),
    [employees, currentTeamLeader]
  );

  // Find the project only if it belongs to the current team leader
  const project = projects.find(
    (item) =>
      String(item.id) === projectId &&
      item.leaderId === currentLeader?.id
  );

  if (!project) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate("/projects")}
          sx={{ mb: 3 }}
        >
          Back to Projects
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography variant="h5" fontWeight={700} color="#17365D">
            Project Not Found
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            This project does not exist or you don't have permission to view it.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const projectTasks = project.tasks || [];
  const projectActivities = project.activities || [];

  // Resolve project leader
  const projectLeader = employees.find(
    (employee) => employee.id === project.leaderId
  );

  // Resolve project members from employee IDs
  const memberIds = project.memberIds || project.membersIds || [];

  const projectMembers = memberIds
    .map((memberId) =>
      employees.find((employee) => employee.id === memberId)
    )
    .filter(Boolean);

  const availableEmployees = employees.filter(
    (employee) =>
      employee.status === "Active" &&
      employee.id !== project.leaderId
  );

  // Resolve activity users
  const activitiesWithUsers = projectActivities.map((activity) => {
    const activityUser = employees.find(
      (employee) => employee.id === activity.userId
    );

    return {
      ...activity,
      userName: activityUser?.name || "Unknown Employee",
    };
  });

  const completedTasks = projectTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const projectProgress = calculateProjectProgress(projectTasks);

  // Open members dialog
  const openMembersDialog = () => {
    setSelectedMemberIds(memberIds);
    setMembersDialogOpen(true);
  };

  // Save project members
  const handleSaveMembers = () => {
    const updatedMemberIds = [
      ...new Set([project.leaderId, ...selectedMemberIds]),
    ];

    setProjects((previousProjects) =>
      previousProjects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              memberIds: updatedMemberIds,
              membersIds: undefined,
            }
          : item
      )
    );

    setMembersDialogOpen(false);

    setSnackbar({
      open: true,
      message: "Project team updated successfully.",
      severity: "success",
    });
  };

  // Remove a project member
  const handleRemoveMember = (memberId) => {
    if (memberId === project.leaderId) return;

    const updatedMemberIds = memberIds.filter((id) => id !== memberId);

    setProjects((previousProjects) =>
      previousProjects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              memberIds: updatedMemberIds,
              membersIds: undefined,
            }
          : item
      )
    );

    setSnackbar({
      open: true,
      message: "Team member removed successfully.",
      severity: "success",
    });
  };

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate("/projects")}
        sx={{
          mb: 3,
          color: "#64748B",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Projects
      </Button>

      {/* Project Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "#17365D", mb: 1 }}>
            {project.name}
          </Typography>

          <Typography color="text.secondary">
            Project Overview and Details
          </Typography>
        </Box>

        <Chip
          label={project.status}
          sx={{
            fontWeight: 700,
            px: 1,
            color: statusStyles[project.status]?.color || "#64748B",
            backgroundColor:
              statusStyles[project.status]?.backgroundColor || "#F1F5F9",
          }}
        />
      </Stack>

      {/* Overview */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#17365D">
          Project Overview
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1.5, lineHeight: 1.8 }}
        >
          {project.description || "No project description available."}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {[
            {
              icon: <PersonOutlineRounded />,
              title: "Team Leader",
              value: projectLeader?.name || "Unknown",
            },
            {
              icon: <CalendarMonthRounded />,
              title: "Start Date",
              value: formatDate(project.startDate),
            },
            {
              icon: <AccessTimeRounded />,
              title: "Deadline",
              value: formatDate(project.endDate),
            },
            {
              icon: <TaskAltRounded />,
              title: "Tasks Completed",
              value: `${completedTasks} / ${projectTasks.length}`,
            },
          ].map((item) => (
            <Box key={item.title}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ color: "#2563EB", display: "flex" }}>
                  {item.icon}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {item.title}
                </Typography>
              </Stack>

              <Typography fontWeight={700} sx={{ mt: 1, color: "#17365D" }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Progress and Team */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Progress */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#17365D">
            Project Progress
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            color="#2563EB"
            sx={{ mt: 2 }}
          >
            {projectProgress}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={projectProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              mt: 2,
              backgroundColor: "#E2E8F0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor:
                  projectProgress === 100 ? "#16A34A" : "#2563EB",
              },
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Overall project completion
          </Typography>
        </Paper>

        {/* Team */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <GroupsRounded sx={{ color: "#2563EB" }} />

              <Typography variant="h6" fontWeight={700} color="#17365D">
                Project Team
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAddAlt1Rounded />}
              onClick={openMembersDialog}
              sx={{ textTransform: "none" }}
            >
              Manage
            </Button>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            {projectMembers.length} team members
          </Typography>

          <AvatarGroup max={6} sx={{ justifyContent: "flex-start" }}>
            {projectMembers.map((member) => (
              <Tooltip key={member.id} title={member.name}>
                <Avatar
                  alt={member.name}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#DBEAFE",
                    color: "#17365D",
                    fontSize: 13,
                  }}
                >
                  {getInitials(member.name)}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {projectMembers.map((member) => (
              <Stack
                key={member.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "#EFF6FF",
                      color: "#2563EB",
                      fontSize: 11,
                    }}
                  >
                    {getInitials(member.name)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {member.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {member.id === project.leaderId
                        ? "Project Leader"
                        : member.position}
                    </Typography>
                  </Box>
                </Stack>

                {member.id !== project.leaderId && (
                  <Tooltip title="Remove member">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            ))}

            {projectMembers.length === 0 && (
              <Typography color="text.secondary" variant="body2">
                No team members assigned.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* Project Tasks */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#17365D">
            Project Tasks
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tasks associated with this project.
          </Typography>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 550 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                {["Task Name", "Priority", "Status"].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{ color: "#64748B", fontWeight: 600 }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {projectTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Typography fontWeight={600} color="#17365D">
                      {task.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {task.priority || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={task.status}
                      sx={{
                        fontWeight: 600,
                        color:
                          taskStatusStyles[task.status]?.color || "#64748B",
                        backgroundColor:
                          taskStatusStyles[task.status]?.backgroundColor ||
                          "#F1F5F9",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {projectTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No tasks have been added to this project yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Recent Activity */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#17365D">
          Recent Activity
        </Typography>

        <Stack spacing={2.5} sx={{ mt: 3 }}>
          {activitiesWithUsers.map((activity) => (
            <Stack
              key={activity.id}
              direction="row"
              alignItems="flex-start"
              spacing={2}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#EFF6FF",
                  color: "#2563EB",
                  fontSize: 13,
                }}
              >
                {getInitials(activity.userName)}
              </Avatar>

              <Box>
                <Typography fontWeight={600} color="#17365D">
                  {activity.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {activity.userName} · {formatDate(activity.date)}
                </Typography>
              </Box>
            </Stack>
          ))}

          {projectActivities.length === 0 && (
            <Typography color="text.secondary">
              No recent activity available.
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* Manage Project Members Dialog */}
      <Dialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "#17365D", fontWeight: 700 }}>
          Manage Project Members
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Select employees to add to this project.
          </Typography>

          <FormControl fullWidth>
            <Select
              multiple
              value={selectedMemberIds}
              onChange={(event) => setSelectedMemberIds(event.target.value)}
              displayEmpty
              renderValue={(selected) =>
                selected.length === 0
                  ? "Select team members"
                  : `${selected.length} employees selected`
              }
            >
              {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  <Checkbox
                    checked={selectedMemberIds.includes(employee.id)}
                  />

                  <ListItemText
                    primary={employee.name}
                    secondary={`${employee.position} · ${employee.department}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setMembersDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveMembers}
            sx={{ textTransform: "none" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({ ...previous, open: false }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeamLeaderProjectDetails;