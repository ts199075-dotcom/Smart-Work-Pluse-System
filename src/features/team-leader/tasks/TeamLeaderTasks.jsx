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
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  AssignmentOutlined,
  CalendarTodayOutlined,
  MoreHorizRounded,
  CloseRounded,
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

function TaskCard({ task, onStatusChange }) {
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

          <IconButton size="small">
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

  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    assignedTo: "",
    status: "To Do",
    priority: "Medium",
    deadline: "",
  });

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
              progress:
                newStatus === "Completed"
                  ? 100
                  : newStatus === "To Do"
                    ? 0
                    : task.progress === 0
                      ? 30
                      : task.progress,
            }
          : task
      )
    );
  };

  const handleAddTask = () => {
    if (
      !newTask.title.trim() ||
      !newTask.project.trim() ||
      !newTask.assignedTo ||
      !newTask.deadline
    ) {
      return;
    }

    const task = {
      ...newTask,
      id: Date.now(),
      initials: getInitials(newTask.assignedTo),
      progress: 0,
    };

    setTasks((previousTasks) => [task, ...previousTasks]);

    setNewTask({
      title: "",
      project: "",
      assignedTo: "",
      status: "To Do",
      priority: "Medium",
      deadline: "",
    });

    setOpenDialog(false);
  };

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
          onClick={() => setOpenDialog(true)}
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

      {/* Create Task Dialog */}
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
              Create New Task
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
              value={newTask.title}
              onChange={(event) =>
                setNewTask({ ...newTask, title: event.target.value })
              }
            />

            <TextField
              fullWidth
              label="Project Name"
              placeholder="Enter project name"
              value={newTask.project}
              onChange={(event) =>
                setNewTask({ ...newTask, project: event.target.value })
              }
            />

            <TextField
              select
              fullWidth
              label="Assign To"
              value={newTask.assignedTo}
              onChange={(event) =>
                setNewTask({ ...newTask, assignedTo: event.target.value })
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
              value={newTask.priority}
              onChange={(event) =>
                setNewTask({ ...newTask, priority: event.target.value })
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
                setNewTask({ ...newTask, status: event.target.value })
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
                setNewTask({ ...newTask, deadline: event.target.value })
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
            onClick={handleAddTask}
            disabled={
              !newTask.title.trim() ||
              !newTask.project.trim() ||
              !newTask.assignedTo ||
              !newTask.deadline
            }
            sx={{
              backgroundColor: "#17365D",
              "&:hover": {
                backgroundColor: "#102945",
              },
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamLeaderTasks;