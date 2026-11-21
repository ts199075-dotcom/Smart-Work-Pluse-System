import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  AssignmentOutlined,
  CalendarTodayOutlined,
  EditRounded,
  DeleteOutlineRounded,
  CloseRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";

const statusOptions = ["To Do", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High", "Critical"];

const emptyTask = {
  title: "",
  description: "",
  projectId: "",
  assignedToId: "",
  status: "To Do",
  priority: "Medium",
  deadline: "",
};

function getStatusColor(status) {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    default:
      return "default";
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case "Critical":
      return "error";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    default:
      return "success";
  }
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTaskProgress(status) {
  switch (status) {
    case "Completed":
      return 100;
    case "In Progress":
      return 50;
    default:
      return 0;
  }
}

function TaskCard({
  task,
  project,
  assignedEmployee,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const progress = getTaskProgress(task.status);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Chip
            label={project?.name || "Unknown Project"}
            size="small"
            sx={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 600,
              maxWidth: "75%",
            }}
          />

          <Stack direction="row" spacing={0}>
            <Tooltip title="Edit Task">
              <IconButton size="small" onClick={() => onEdit(task, project)}>
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Task">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(project.id, task.id)}
              >
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography fontSize={16} fontWeight={700} mb={1}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            fontSize={13}
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
            variant="outlined"
          />

          <Chip
            label={task.priority || "Medium"}
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={1}
          >
            <Typography fontSize={12} color="text.secondary">
              Progress
            </Typography>

            <Typography fontSize={12} fontWeight={600}>
              {progress}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 7,
              borderRadius: 5,
              backgroundColor: "#E2E8F0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor:
                  task.status === "Completed" ? "#16A34A" : "#2563EB",
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 12,
                backgroundColor: "#DBEAFE",
                color: "#17365D",
              }}
            >
              {getInitials(assignedEmployee?.name || "Unassigned")}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontSize={12} fontWeight={600} noWrap>
                {assignedEmployee?.name || "Unassigned"}
              </Typography>

              <Typography fontSize={11} color="text.secondary">
                Assigned Member
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <CalendarTodayOutlined
              sx={{ fontSize: 14, color: "text.secondary" }}
            />

            <Typography fontSize={11} color="text.secondary">
              {task.deadline || "No deadline"}
            </Typography>
          </Stack>
        </Stack>

        <TextField
          select
          fullWidth
          size="small"
          label="Update Status"
          value={task.status}
          onChange={(event) =>
            onStatusChange(project.id, task.id, event.target.value)
          }
          sx={{ mt: 2 }}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </CardContent>
    </Card>
  );
}

function TeamLeaderTasks({ currentTeamLeader = "Sara Ahmed" }) {
  const { projects, setProjects, employees } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState(emptyTask);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentLeader = employees.find(
    (employee) => employee.name === currentTeamLeader
  );

  const leaderProjects = useMemo(() => {
    if (!currentLeader) return [];

    return projects.filter(
      (project) => project.leaderId === currentLeader.id
    );
  }, [projects, currentLeader]);

  const allTasks = useMemo(() => {
    return leaderProjects.flatMap((project) =>
      (project.tasks || []).map((task) => ({
        ...task,
        projectId: project.id,
        projectName: project.name,
        assignedEmployee: employees.find(
          (employee) => employee.id === task.assignedToId
        ),
      }))
    );
  }, [leaderProjects, employees]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        (task.title || "").toLowerCase().includes(searchTerm) ||
        (task.projectName || "").toLowerCase().includes(searchTerm) ||
        (task.assignedEmployee?.name || "")
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [allTasks, search, statusFilter, priorityFilter]);

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = allTasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todoTasks = allTasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const selectedProject = projects.find(
    (project) => String(project.id) === String(newTask.projectId)
  );

  const projectMembers = selectedProject
    ? (selectedProject.memberIds || selectedProject.membersIds || [])
        .map((memberId) =>
          employees.find((employee) => employee.id === memberId)
        )
        .filter(
          (employee) => employee && employee.status === "Active"
        )
    : [];

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleOpenCreateDialog = () => {
    setEditingTask(null);

    setNewTask({
      ...emptyTask,
      projectId: leaderProjects[0]
        ? String(leaderProjects[0].id)
        : "",
    });

    setOpenDialog(true);
  };

  const handleOpenEditDialog = (task, project) => {
    setEditingTask({
      projectId: project.id,
      taskId: task.id,
    });

    setNewTask({
      title: task.title || "",
      description: task.description || "",
      projectId: String(project.id),
      assignedToId: task.assignedToId
        ? String(task.assignedToId)
        : "",
      status: task.status || "To Do",
      priority: task.priority || "Medium",
      deadline: task.deadline || "",
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setNewTask(emptyTask);
  };

  const handleProjectChange = (projectId) => {
    setNewTask((previous) => ({
      ...previous,
      projectId,
      assignedToId: "",
    }));
  };

  const handleSaveTask = () => {
    const title = newTask.title.trim();

    if (!title || !newTask.projectId) {
      showMessage("Please enter a task title and select a project.", "error");
      return;
    }

    const targetProject = leaderProjects.find(
      (project) => String(project.id) === String(newTask.projectId)
    );

    if (!targetProject) {
      showMessage("Please select a valid project.", "error");
      return;
    }

    if (newTask.assignedToId) {
      const isProjectMember = (
        targetProject.memberIds ||
        targetProject.membersIds ||
        []
      ).some(
        (memberId) => String(memberId) === String(newTask.assignedToId)
      );

      if (!isProjectMember) {
        showMessage(
          "The assigned employee must be a member of this project.",
          "error"
        );
        return;
      }
    }

    if (editingTask) {
      setProjects((previousProjects) =>
        previousProjects.map((project) => {
          const isOldProject = project.id === editingTask.projectId;
          const isNewProject =
            String(project.id) === String(newTask.projectId);

          if (!isOldProject && !isNewProject) return project;

          let updatedTasks = [...(project.tasks || [])];

          if (isOldProject) {
            updatedTasks = updatedTasks.filter(
              (task) => task.id !== editingTask.taskId
            );
          }

          if (isNewProject) {
            const oldTask = projects
              .find((item) => item.id === editingTask.projectId)
              ?.tasks?.find((task) => task.id === editingTask.taskId);

            const updatedTask = {
              ...oldTask,
              ...newTask,
              id: editingTask.taskId,
              assignedToId: newTask.assignedToId
                ? Number(newTask.assignedToId)
                : null,
            };

            const alreadyExists = updatedTasks.some(
              (task) => task.id === editingTask.taskId
            );

            if (alreadyExists) {
              updatedTasks = updatedTasks.map((task) =>
                task.id === editingTask.taskId ? updatedTask : task
              );
            } else {
              updatedTasks = [...updatedTasks, updatedTask];
            }
          }

          return {
            ...project,
            tasks: updatedTasks,
          };
        })
      );

      showMessage("Task updated successfully.");
    } else {
      const allExistingIds = projects.flatMap((project) =>
        (project.tasks || []).map((task) => Number(task.id) || 0)
      );

      const newId = Math.max(0, ...allExistingIds) + 1;

      const task = {
        id: newId,
        title,
        description: newTask.description.trim(),
        status: newTask.status,
        priority: newTask.priority,
        deadline: newTask.deadline,
        assignedToId: newTask.assignedToId
          ? Number(newTask.assignedToId)
          : null,
      };

      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          String(project.id) === String(newTask.projectId)
            ? {
                ...project,
                tasks: [...(project.tasks || []), task],
              }
            : project
        )
      );

      showMessage("Task created successfully.");
    }

    handleCloseDialog();
  };

  const handleStatusChange = (projectId, taskId, newStatus) => {
    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: (project.tasks || []).map((task) =>
                task.id === taskId
                  ? { ...task, status: newStatus }
                  : task
              ),
            }
          : project
      )
    );

    showMessage("Task status updated successfully.");
  };

  const handleDeleteTask = (projectId, taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: (project.tasks || []).filter(
                (task) => task.id !== taskId
              ),
            }
          : project
      )
    );

    showMessage("Task deleted successfully.");
  };

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Tasks Management
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Manage tasks, assign team members and track progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={handleOpenCreateDialog}
          disabled={leaderProjects.length === 0}
          sx={{
            backgroundColor: "#17365D",
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            "&:hover": {
              backgroundColor: "#102945",
            },
          }}
        >
          Create New Task
        </Button>
      </Stack>

      {!currentLeader && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          The current team leader was not found in the employees list.
        </Alert>
      )}

      {/* Summary Cards */}
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
        {[
          {
            title: "Total Tasks",
            value: totalTasks,
            color: "#2563EB",
            background: "#DBEAFE",
          },
          {
            title: "To Do",
            value: todoTasks,
            color: "#64748B",
            background: "#F1F5F9",
          },
          {
            title: "In Progress",
            value: inProgressTasks,
            color: "#D97706",
            background: "#FEF3C7",
          },
          {
            title: "Completed",
            value: completedTasks,
            color: "#16A34A",
            background: "#DCFCE7",
          },
        ].map((item) => (
          <Card
            key={item.title}
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
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontSize={13} color="text.secondary" mb={1}>
                    {item.title}
                  </Typography>

                  <Typography variant="h4" fontWeight={700}>
                    {item.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: item.background,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AssignmentOutlined />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filters */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search tasks, projects or members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>

              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Priority"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <MenuItem value="All">All Priorities</MenuItem>

              {priorityOptions.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          All Tasks
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          {filteredTasks.length} tasks found
        </Typography>
      </Stack>

      {filteredTasks.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            },
            gap: 2.5,
          }}
        >
          {filteredTasks.map((task) => {
            const project = leaderProjects.find(
              (item) => item.id === task.projectId
            );

            return (
              <TaskCard
                key={`${task.projectId}-${task.id}`}
                task={task}
                project={project}
                assignedEmployee={task.assignedEmployee}
                onStatusChange={handleStatusChange}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteTask}
              />
            );
          })}
        </Box>
      ) : (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            textAlign: "center",
            py: 6,
          }}
        >
          <Typography fontWeight={600} mb={1}>
            No tasks found
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Try changing your search or filter options, or create a new task.
          </Typography>
        </Card>
      )}

      {/* Create / Edit Task Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {editingTask ? "Edit Task" : "Create New Task"}
            </Typography>

            <IconButton onClick={handleCloseDialog}>
              <CloseRounded />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Task Title"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Description"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
            />

            <TextField
              select
              fullWidth
              label="Project"
              value={newTask.projectId}
              onChange={(event) => handleProjectChange(event.target.value)}
            >
              {leaderProjects.map((project) => (
                <MenuItem key={project.id} value={String(project.id)}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Assign To"
              value={newTask.assignedToId}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  assignedToId: event.target.value,
                }))
              }
              disabled={!selectedProject || projectMembers.length === 0}
            >
              <MenuItem value="">
                Unassigned
              </MenuItem>

              {projectMembers.map((member) => (
                <MenuItem key={member.id} value={String(member.id)}>
                  {member.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Priority"
              value={newTask.priority}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  priority: event.target.value,
                }))
              }
            >
              {priorityOptions.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Status"
              value={newTask.status}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  status: event.target.value,
                }))
              }
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="date"
              label="Deadline"
              InputLabelProps={{ shrink: true }}
              value={newTask.deadline}
              onChange={(event) =>
                setNewTask((previous) => ({
                  ...previous,
                  deadline: event.target.value,
                }))
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button color="inherit" onClick={handleCloseDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveTask}
            disabled={!newTask.title.trim() || !newTask.projectId}
            sx={{
              backgroundColor: "#17365D",
              "&:hover": {
                backgroundColor: "#102945",
              },
            }}
          >
            {editingTask ? "Save Changes" : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeamLeaderTasks;