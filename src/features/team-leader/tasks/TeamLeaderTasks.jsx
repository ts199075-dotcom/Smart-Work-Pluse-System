
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
  Menu,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  AssignmentOutlined,
  CalendarTodayOutlined,
  MoreHorizRounded,
  CloseRounded,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlineRounded,
} from "@mui/icons-material";

const initialTasks = [
  {
    id: 1,
    title: "Design Homepage UI",
    project: "Website Redesign",
    assignedTo: "Ahmed Mohamed",
    initials: "AM",
    status: "In Progress",
    priority: "High",
    deadline: "2026-11-25",
    progress: 70,
  },
  {
    id: 2,
    title: "Develop Login API",
    project: "Mobile Application",
    assignedTo: "Mohamed Hassan",
    initials: "MH",
    status: "To Do",
    priority: "High",
    deadline: "2026-11-28",
    progress: 0,
  },
  {
    id: 3,
    title: "Create Dashboard Layout",
    project: "Internal Dashboard",
    assignedTo: "Sara Ali",
    initials: "SA",
    status: "Completed",
    priority: "Medium",
    deadline: "2026-11-15",
    progress: 100,
  },
  {
    id: 4,
    title: "Fix Attendance Bugs",
    project: "Attendance System",
    assignedTo: "Omar Khaled",
    initials: "OK",
    status: "In Progress",
    priority: "Critical",
    deadline: "2026-11-22",
    progress: 45,
  },
  {
    id: 5,
    title: "Prepare Database Structure",
    project: "HR System",
    assignedTo: "Mona Ahmed",
    initials: "MA",
    status: "To Do",
    priority: "Low",
    deadline: "2026-11-30",
    progress: 0,
  },
];

const teamMembers = [
  "Ahmed Mohamed",
  "Mohamed Hassan",
  "Sara Ali",
  "Omar Khaled",
  "Mona Ahmed",
];

const statusOptions = ["To Do", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High", "Critical"];

const emptyTask = {
  title: "",
  project: "",
  assignedTo: "",
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

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProgressByStatus(status, previousProgress = 0, previousStatus = "") {
  if (status === "Completed") return 100;
  if (status === "To Do") return 0;

  if (
    previousStatus === "Completed" ||
    previousProgress <= 0 ||
    previousProgress >= 100
  ) {
    return 30;
  }

  return previousProgress;
}

function TaskCard({
  task,
  onStatusChange,
  onMenuOpen,
}) {
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
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Chip
            label={task.project}
            size="small"
            sx={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 600,
              maxWidth: "75%",
            }}
          />

          <IconButton
            size="small"
            onClick={(event) => onMenuOpen(event, task)}
          >
            <MoreHorizRounded />
          </IconButton>
        </Stack>

        <Typography fontSize={16} fontWeight={700} mb={1}>
          {task.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
            variant="outlined"
          />

          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", mb: 1 }}
          >
            <Typography fontSize={12} color="text.secondary">
              Progress
            </Typography>

            <Typography fontSize={12} fontWeight={600}>
              {task.progress}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={task.progress}
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
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", minWidth: 0 }}
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
              {task.initials}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontSize={12} fontWeight={600} noWrap>
                {task.assignedTo}
              </Typography>

              <Typography fontSize={11} color="text.secondary">
                Assigned Member
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", flexShrink: 0 }}
          >
            <CalendarTodayOutlined
              sx={{ fontSize: 14, color: "text.secondary" }}
            />

            <Typography fontSize={11} color="text.secondary">
              {task.deadline}
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
            onStatusChange(task.id, event.target.value)
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

function TeamLeaderTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTask, setMenuTask] = useState(null);

  const [formTask, setFormTask] = useState(emptyTask);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              progress: getProgressByStatus(
                newStatus,
                task.progress,
                task.status
              ),
            }
          : task
      )
    );
  };

  const handleMenuOpen = (event, task) => {
    setMenuAnchor(event.currentTarget);
    setMenuTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTask(null);
  };

  const handleCreateOpen = () => {
    setEditingTask(null);
    setFormTask(emptyTask);
    setOpenDialog(true);
  };

  const handleEditOpen = () => {
    if (!menuTask) return;

    setEditingTask(menuTask);

    setFormTask({
      title: menuTask.title,
      project: menuTask.project,
      assignedTo: menuTask.assignedTo,
      status: menuTask.status,
      priority: menuTask.priority,
      deadline: menuTask.deadline,
    });

    handleMenuClose();
    setOpenDialog(true);
  };

  const handleSaveTask = () => {
    if (
      !formTask.title.trim() ||
      !formTask.project.trim() ||
      !formTask.assignedTo ||
      !formTask.deadline
    ) {
      return;
    }

    if (editingTask) {
      setTasks((previousTasks) =>
        previousTasks.map((task) => {
          if (task.id !== editingTask.id) return task;

          return {
            ...task,
            ...formTask,
            title: formTask.title.trim(),
            project: formTask.project.trim(),
            initials: getInitials(formTask.assignedTo),
            progress: getProgressByStatus(
              formTask.status,
              task.progress,
              task.status
            ),
          };
        })
      );
    } else {
      const task = {
        ...formTask,
        id: Date.now(),
        title: formTask.title.trim(),
        project: formTask.project.trim(),
        initials: getInitials(formTask.assignedTo),
        progress: getProgressByStatus(formTask.status),
      };

      setTasks((previousTasks) => [task, ...previousTasks]);
    }

    setOpenDialog(false);
    setEditingTask(null);
    setFormTask(emptyTask);
  };

  const handleViewDetails = () => {
    setSelectedTask(menuTask);
    handleMenuClose();
  };

  const handleDeleteRequest = () => {
    setTaskToDelete(menuTask);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (!taskToDelete) return;

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskToDelete.id)
    );

    setTaskToDelete(null);
  };

  const handleFormChange = (field, value) => {
    setFormTask((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const isFormValid =
    formTask.title.trim() &&
    formTask.project.trim() &&
    formTask.assignedTo &&
    formTask.deadline;

  return (
    <Box>
      {/* Page Header */}
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
            Tasks Management
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Manage tasks, assign team members and track progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={handleCreateOpen}
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
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded color="action" />
                    </InputAdornment>
                  ),
                },
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
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
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
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onMenuOpen={handleMenuOpen}
            />
          ))}
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
            Try changing your search or filter options.
          </Typography>
        </Card>
      )}

      {/* Task Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityOutlined sx={{ mr: 1.5, fontSize: 19 }} />
          View Details
        </MenuItem>

        <MenuItem onClick={handleEditOpen}>
          <EditOutlined sx={{ mr: 1.5, fontSize: 19 }} />
          Edit Task
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleDeleteRequest}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineRounded sx={{ mr: 1.5, fontSize: 19 }} />
          Delete Task
        </MenuItem>
      </Menu>

      {/* Create / Edit Task Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {editingTask ? "Edit Task" : "Create New Task"}
            </Typography>

            <IconButton onClick={() => setOpenDialog(false)}>
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
              value={formTask.title}
              onChange={(event) =>
                handleFormChange("title", event.target.value)
              }
            />

            <TextField
              fullWidth
              label="Project Name"
              placeholder="Enter project name"
              value={formTask.project}
              onChange={(event) =>
                handleFormChange("project", event.target.value)
              }
            />

            <TextField
              select
              fullWidth
              label="Assign To"
              value={formTask.assignedTo}
              onChange={(event) =>
                handleFormChange("assignedTo", event.target.value)
              }
            >
              {teamMembers.map((member) => (
                <MenuItem key={member} value={member}>
                  {member}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Priority"
              value={formTask.priority}
              onChange={(event) =>
                handleFormChange("priority", event.target.value)
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
              value={formTask.status}
              onChange={(event) =>
                handleFormChange("status", event.target.value)
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
              slotProps={{
                inputLabel: { shrink: true },
              }}
              value={formTask.deadline}
              onChange={(event) =>
                handleFormChange("deadline", event.target.value)
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            color="inherit"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveTask}
            disabled={!isFormValid}
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

      {/* View Task Details Dialog */}
      <Dialog
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedTask && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Task Details
                </Typography>

                <IconButton onClick={() => setSelectedTask(null)}>
                  <CloseRounded />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ py: 1 }}>
                <Box>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mb={0.5}
                  >
                    TASK TITLE
                  </Typography>

                  <Typography fontWeight={700} fontSize={18}>
                    {selectedTask.title}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mb={0.5}
                  >
                    PROJECT
                  </Typography>

                  <Typography fontWeight={600}>
                    {selectedTask.project}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={selectedTask.status}
                    color={getStatusColor(selectedTask.status)}
                    variant="outlined"
                  />

                  <Chip
                    label={selectedTask.priority}
                    color={getPriorityColor(selectedTask.priority)}
                  />
                </Stack>

                <Divider />

                <Box>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mb={1}
                  >
                    ASSIGNED MEMBER
                  </Typography>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        backgroundColor: "#DBEAFE",
                        color: "#17365D",
                      }}
                    >
                      {selectedTask.initials}
                    </Avatar>

                    <Typography fontWeight={600}>
                      {selectedTask.assignedTo}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    mb={0.5}
                  >
                    DEADLINE
                  </Typography>

                  <Typography fontWeight={600}>
                    {selectedTask.deadline}
                  </Typography>
                </Box>

                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography
                      fontSize={12}
                      color="text.secondary"
                    >
                      PROGRESS
                    </Typography>

                    <Typography fontWeight={700} fontSize={13}>
                      {selectedTask.progress}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={selectedTask.progress}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          selectedTask.status === "Completed"
                            ? "#16A34A"
                            : "#2563EB",
                      },
                    }}
                  />
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedTask(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle fontWeight={700}>
          Delete Task?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" fontSize={14}>
            Are you sure you want to delete
            {" "}
            <strong>{taskToDelete?.title}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            color="inherit"
            onClick={() => setTaskToDelete(null)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamLeaderTasks;
