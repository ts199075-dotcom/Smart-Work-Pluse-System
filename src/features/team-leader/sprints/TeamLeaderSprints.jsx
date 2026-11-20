
import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  Button,
  TextField,
  MenuItem,
  LinearProgress,
  Avatar,
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
  RocketLaunchRounded,
  TaskAltRounded,
  ScheduleRounded,
  CloseRounded,
  CalendarMonthRounded,
  EditRounded,
  DeleteOutlineRounded,
  SearchRounded,
  GroupsRounded,
  AssignmentOutlined,
  FlagRounded,
} from "@mui/icons-material";

// --------------------------------------------------
// Initial Data
// --------------------------------------------------

const initialSprints = [
  {
    id: 1,
    name: "Sprint 04",
    goal: "Complete authentication and user management features.",
    startDate: "2026-11-10",
    endDate: "2026-11-24",
    status: "Active",
    tasks: 20,
    completed: 13,
    inProgress: 5,
    todo: 2,
    members: ["Ahmed", "Sara", "Omar", "Mona"],
    taskItems: [
      {
        id: 1,
        title: "Create Login API",
        assignee: "Ahmed",
        status: "Completed",
      },
      {
        id: 2,
        title: "Build Registration Form",
        assignee: "Sara",
        status: "Completed",
      },
      {
        id: 3,
        title: "Implement JWT Authentication",
        assignee: "Omar",
        status: "In Progress",
      },
      {
        id: 4,
        title: "Create User Profile API",
        assignee: "Mona",
        status: "To Do",
      },
    ],
  },
  {
    id: 2,
    name: "Sprint 03",
    goal: "Build the main dashboard and project management modules.",
    startDate: "2026-10-25",
    endDate: "2026-11-08",
    status: "Completed",
    tasks: 18,
    completed: 18,
    inProgress: 0,
    todo: 0,
    members: ["Ahmed", "Sara", "Omar"],
    taskItems: [
      {
        id: 5,
        title: "Build Dashboard Layout",
        assignee: "Ahmed",
        status: "Completed",
      },
      {
        id: 6,
        title: "Create Projects Overview",
        assignee: "Sara",
        status: "Completed",
      },
      {
        id: 7,
        title: "Implement Project Filters",
        assignee: "Omar",
        status: "Completed",
      },
    ],
  },
  {
    id: 3,
    name: "Sprint 02",
    goal: "Develop employee attendance and task tracking.",
    startDate: "2026-10-05",
    endDate: "2026-10-19",
    status: "Completed",
    tasks: 16,
    completed: 16,
    inProgress: 0,
    todo: 0,
    members: ["Sara", "Mona", "Omar"],
    taskItems: [
      {
        id: 8,
        title: "Create Attendance Page",
        assignee: "Sara",
        status: "Completed",
      },
      {
        id: 9,
        title: "Implement Check-in Logic",
        assignee: "Mona",
        status: "Completed",
      },
      {
        id: 10,
        title: "Build Task Tracking",
        assignee: "Omar",
        status: "Completed",
      },
    ],
  },
  {
    id: 4,
    name: "Sprint 05",
    goal: "Prepare reports and improve system performance.",
    startDate: "2026-11-25",
    endDate: "2026-12-09",
    status: "Planned",
    tasks: 12,
    completed: 0,
    inProgress: 0,
    todo: 12,
    members: ["Ahmed", "Mona"],
    taskItems: [
      {
        id: 11,
        title: "Create Reports Dashboard",
        assignee: "Ahmed",
        status: "To Do",
      },
      {
        id: 12,
        title: "Optimize Application Performance",
        assignee: "Mona",
        status: "To Do",
      },
    ],
  },
];

// --------------------------------------------------
// Data Consistency Helpers
// --------------------------------------------------

const normalizeSprint = (sprint) => {
  const completed = Math.max(0, Number(sprint.completed) || 0);
  const inProgress = Math.max(0, Number(sprint.inProgress) || 0);
  const todo = Math.max(0, Number(sprint.todo) || 0);

  const totalTasks = completed + inProgress + todo;
  const isCompleted = sprint.status === "Completed";

  return {
    ...sprint,
    tasks: totalTasks,
    completed: isCompleted ? totalTasks : completed,
    inProgress: isCompleted ? 0 : inProgress,
    todo: isCompleted ? 0 : todo,
    members: sprint.members || [],
    taskItems: isCompleted
      ? (sprint.taskItems || []).map((task) => ({
          ...task,
          status: "Completed",
        }))
      : sprint.taskItems || [],
  };
};

const getSprintProgress = (sprint) => {
  if (!sprint.tasks) return 0;

  return Math.min(
    100,
    Math.round((sprint.completed / sprint.tasks) * 100)
  );
};

// --------------------------------------------------
// Status Styles
// --------------------------------------------------

const statusStyles = {
  Active: {
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
  },
  Completed: {
    color: "#15803D",
    backgroundColor: "#DCFCE7",
  },
  Planned: {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
  },
  "In Progress": {
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
  },
  "To Do": {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
  },
};

// --------------------------------------------------
// Helper Functions
// --------------------------------------------------

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRemainingDays = (endDate) => {
  if (!endDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(`${endDate}T00:00:00`);

  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
};

// --------------------------------------------------
// Summary Card
// --------------------------------------------------

function SummaryCard({ title, value, subtitle, icon, color, background }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500}>
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
            {value}
          </Typography>

          <Typography color="text.secondary" fontSize={12} sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            backgroundColor: background,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  );
}

// --------------------------------------------------
// Sprint Status
// --------------------------------------------------

function SprintStatus({ status }) {
  const style = statusStyles[status] || statusStyles.Planned;

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontWeight: 600,
        borderRadius: 2,
      }}
    />
  );
}

// --------------------------------------------------
// Sprint Card
// --------------------------------------------------

function SprintCard({ sprint, onView, onEdit, onDelete, onStatusChange }) {
  const progress = getSprintProgress(sprint);
  const remainingDays = getRemainingDays(sprint.endDate);

  const remainingText =
    sprint.status === "Completed"
      ? "Sprint completed"
      : remainingDays < 0
        ? `${Math.abs(remainingDays)} days overdue`
        : remainingDays === 0
          ? "Ends today"
          : `${remainingDays} days remaining`;

  const remainingColor =
    sprint.status === "Completed"
      ? "success.main"
      : remainingDays < 0
        ? "error.main"
        : remainingDays <= 3
          ? "warning.main"
          : "text.secondary";

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 5px 18px rgba(23,54,93,0.07)",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563EB",
            backgroundColor: "#DBEAFE",
          }}
        >
          <RocketLaunchRounded />
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <SprintStatus status={sprint.status} />

          <IconButton
            size="small"
            onClick={() => onEdit(sprint)}
            aria-label="Edit sprint"
          >
            <EditRounded fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(sprint.id)}
            aria-label="Delete sprint"
          >
            <DeleteOutlineRounded fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Typography fontWeight={700} fontSize={17} sx={{ mt: 2 }}>
        {sprint.name}
      </Typography>

      <Typography
        color="text.secondary"
        fontSize={13}
        sx={{ mt: 0.7, minHeight: 42 }}
      >
        {sprint.goal}
      </Typography>

      <Stack direction="row" spacing={0.7} sx={{ mt: 1, alignItems: "center" }}>
        <CalendarMonthRounded sx={{ fontSize: 16, color: "text.secondary" }} />

        <Typography fontSize={12} color="text.secondary">
          {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
        </Typography>
      </Stack>

      <Typography
        fontSize={12}
        fontWeight={600}
        sx={{ mt: 1, color: remainingColor }}
      >
        {remainingText}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography fontSize={12} fontWeight={600}>
            Sprint Progress
          </Typography>

          <Typography fontSize={12} fontWeight={700} color="primary.main">
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
            },
          }}
        />
      </Box>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
          <TaskAltRounded sx={{ fontSize: 17, color: "text.secondary" }} />

          <Typography fontSize={12} color="text.secondary">
            {sprint.completed}/{sprint.tasks} Tasks
          </Typography>
        </Stack>

        <TextField
          select
          size="small"
          value={sprint.status}
          onChange={(event) => onStatusChange(sprint.id, event.target.value)}
          sx={{ minWidth: 115 }}
        >
          <MenuItem value="Planned">Planned</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <Button size="small" onClick={() => onView(sprint)}>
          View Details
        </Button>
      </Stack>
    </Card>
  );
}

// --------------------------------------------------
// Main Component
// --------------------------------------------------

function TeamLeaderSprints() {
  const [sprints, setSprints] = useState(() =>
    initialSprints.map(normalizeSprint)
  );

  const [selectedSprint, setSelectedSprint] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteSprintId, setDeleteSprintId] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSprintId, setEditingSprintId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const summary = useMemo(
    () => ({
      total: sprints.length,
      active: sprints.filter((sprint) => sprint.status === "Active").length,
      completed: sprints.filter((sprint) => sprint.status === "Completed")
        .length,
      planned: sprints.filter((sprint) => sprint.status === "Planned").length,
    }),
    [sprints]
  );

  // --------------------------------------------------
  // Search and Filter
  // --------------------------------------------------

  const filteredSprints = useMemo(() => {
    return sprints.filter((sprint) => {
      const matchesStatus =
        selectedFilter === "All" || sprint.status === selectedFilter;

      const matchesSearch = `${sprint.name} ${sprint.goal}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [sprints, selectedFilter, searchTerm]);

  const currentSprint = sprints.find((sprint) => sprint.status === "Active");

  // --------------------------------------------------
  // Form Validation
  // --------------------------------------------------

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Sprint name is required.";
    }

    if (!formData.goal.trim()) {
      errors.goal = "Sprint goal is required.";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required.";
    } else if (
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      errors.endDate = "End date must be after or equal to start date.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate >= formData.startDate
    ) {
      const overlappingSprint = sprints.find((sprint) => {
        if (sprint.id === editingSprintId) {
          return false;
        }

        return (
          formData.startDate <= sprint.endDate &&
          formData.endDate >= sprint.startDate
        );
      });

      if (overlappingSprint) {
        errors.endDate = `Dates overlap with ${overlappingSprint.name}.`;
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [field]: "",
      ...(field === "startDate" ? { endDate: "" } : {}),
    }));
  };

  // --------------------------------------------------
  // Dialog Functions
  // --------------------------------------------------

  const resetForm = () => {
    setFormData({
      name: "",
      goal: "",
      startDate: "",
      endDate: "",
    });

    setFormErrors({});
    setEditingSprintId(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleCreateSprint = () => {
    if (!validateForm()) return;

    if (editingSprintId) {
      const updatedSprints = sprints.map((sprint) =>
        sprint.id === editingSprintId
          ? normalizeSprint({
              ...sprint,
              ...formData,
            })
          : sprint
      );

      setSprints(updatedSprints);

      setSelectedSprint((previous) => {
        if (!previous) return previous;

        return (
          updatedSprints.find((sprint) => sprint.id === previous.id) || null
        );
      });
    } else {
      const newSprint = normalizeSprint({
        id: Date.now(),
        ...formData,
        status: "Planned",
        tasks: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        members: [],
        taskItems: [],
      });

      setSprints((previous) => [newSprint, ...previous]);
    }

    setOpenDialog(false);
    resetForm();
  };

  // --------------------------------------------------
  // Edit Sprint
  // --------------------------------------------------

  const handleEditSprint = (sprint) => {
    setEditingSprintId(sprint.id);

    setFormData({
      name: sprint.name,
      goal: sprint.goal,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    });

    setFormErrors({});
    setOpenDialog(true);
  };

  // --------------------------------------------------
  // Delete Sprint
  // --------------------------------------------------

  const handleDeleteSprint = (sprintId) => {
    setDeleteSprintId(sprintId);
  };

  const confirmDeleteSprint = () => {
    if (deleteSprintId === null) return;

    setSprints((previous) =>
      previous.filter((sprint) => sprint.id !== deleteSprintId)
    );

    setSelectedSprint((previous) =>
      previous?.id === deleteSprintId ? null : previous
    );

    setDeleteSprintId(null);
  };

  // --------------------------------------------------
  // Change Sprint Status
  // --------------------------------------------------

  const handleStatusChange = (sprintId, newStatus) => {
    const updatedSprints = sprints.map((sprint) => {
      if (sprint.id === sprintId) {
        const updatedSprint = {
          ...sprint,
          status: newStatus,
        };

        if (newStatus === "Completed") {
          updatedSprint.completed = sprint.tasks;
          updatedSprint.inProgress = 0;
          updatedSprint.todo = 0;

          updatedSprint.taskItems = (sprint.taskItems || []).map((task) => ({
            ...task,
            status: "Completed",
          }));
        }

        return normalizeSprint(updatedSprint);
      }

      // Only one sprint can be active at a time.
      if (newStatus === "Active" && sprint.status === "Active") {
        return {
          ...sprint,
          status: "Planned",
        };
      }

      return sprint;
    });

    setSprints(updatedSprints);

    // Keep the details dialog synchronized with the latest sprint data.
    setSelectedSprint((previous) => {
      if (!previous) return previous;

      return (
        updatedSprints.find((sprint) => sprint.id === previous.id) || null
      );
    });
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

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
          <Typography variant="h4" fontWeight={700}>
            Sprints
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            Plan, organize and track your team's work cycles.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
          sx={{ borderRadius: 2, px: 2.5, py: 1.2 }}
        >
          Create Sprint
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
          mb: 3,
        }}
      >
        <SummaryCard
          title="Total Sprints"
          value={summary.total}
          subtitle="All work cycles"
          icon={<RocketLaunchRounded />}
          color="#2563EB"
          background="#DBEAFE"
        />

        <SummaryCard
          title="Active Sprints"
          value={summary.active}
          subtitle="Currently running"
          icon={<ScheduleRounded />}
          color="#D97706"
          background="#FEF3C7"
        />

        <SummaryCard
          title="Completed Sprints"
          value={summary.completed}
          subtitle="Successfully finished"
          icon={<TaskAltRounded />}
          color="#16A34A"
          background="#DCFCE7"
        />

        <SummaryCard
          title="Planned Sprints"
          value={summary.planned}
          subtitle="Upcoming work cycles"
          icon={<CalendarMonthRounded />}
          color="#7C3AED"
          background="#EDE9FE"
        />
      </Box>

      {/* Current Sprint */}

      {currentSprint && (
        <Card
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Current Sprint
                </Typography>

                <SprintStatus status="Active" />
              </Stack>

              <Typography fontWeight={700} fontSize={20}>
                {currentSprint.name}
              </Typography>

              <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.7 }}>
                {currentSprint.goal}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2, flexWrap: "wrap" }}
              >
                <Typography fontSize={12} color="text.secondary">
                  Start: {formatDate(currentSprint.startDate)}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  End: {formatDate(currentSprint.endDate)}
                </Typography>

                <Typography
                  fontSize={12}
                  fontWeight={600}
                  color={
                    getRemainingDays(currentSprint.endDate) < 0
                      ? "error.main"
                      : "primary.main"
                  }
                >
                  {getRemainingDays(currentSprint.endDate) < 0
                    ? `${Math.abs(
                        getRemainingDays(currentSprint.endDate)
                      )} days overdue`
                    : getRemainingDays(currentSprint.endDate) === 0
                      ? "Ends today"
                      : `${getRemainingDays(
                          currentSprint.endDate
                        )} days remaining`}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 260 } }}>
              <Typography fontSize={13} fontWeight={600} sx={{ mb: 1 }}>
                Sprint Completion
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {getSprintProgress(currentSprint)}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={getSprintProgress(currentSprint)}
                sx={{ mt: 1, height: 9, borderRadius: 5 }}
              />

              <Typography color="text.secondary" fontSize={12} sx={{ mt: 1 }}>
                {currentSprint.completed} completed out of{" "}
                {currentSprint.tasks} tasks
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}

      {/* Sprint Tasks Overview */}

      {currentSprint && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {[
            {
              label: "Completed Tasks",
              value: currentSprint.completed,
              color: "#16A34A",
              background: "#DCFCE7",
            },
            {
              label: "In Progress",
              value: currentSprint.inProgress,
              color: "#2563EB",
              background: "#DBEAFE",
            },
            {
              label: "To Do",
              value: currentSprint.todo,
              color: "#D97706",
              background: "#FEF3C7",
            },
          ].map((item) => (
            <Card
              key={item.label}
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    backgroundColor: item.background,
                  }}
                >
                  <TaskAltRounded />
                </Box>

                <Box>
                  <Typography fontSize={12} color="text.secondary">
                    {item.label}
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
                    {item.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>
      )}

      {/* All Sprints */}

      <Card
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Typography variant="h6" fontWeight={700}>
              All Sprints
            </Typography>

            <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
              Manage and review your team's sprints.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder="Search sprints..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Filter by status"
              value={selectedFilter}
              onChange={(event) => setSelectedFilter(event.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="All">All Sprints</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Planned">Planned</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {filteredSprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              onView={setSelectedSprint}
              onEdit={handleEditSprint}
              onDelete={handleDeleteSprint}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Box>

        {/* Empty State */}

        {filteredSprints.length === 0 && (
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#DBEAFE",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <SearchRounded sx={{ fontSize: 30 }} />
            </Box>

            <Typography fontWeight={700} fontSize={17}>
              {sprints.length === 0
                ? "No Sprints Yet"
                : searchTerm
                  ? "No Matching Sprints"
                  : "No Sprints Found"}
            </Typography>

            <Typography
              color="text.secondary"
              fontSize={13}
              sx={{ mt: 1, maxWidth: 350 }}
            >
              {sprints.length === 0
                ? "Start organizing your team's work by creating your first sprint."
                : "We couldn't find any sprints matching your current search or filters. Try changing them."}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                mt: 2.5,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {sprints.length > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedFilter("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}

              {sprints.length === 0 && (
                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={() => {
                    resetForm();
                    setOpenDialog(true);
                  }}
                >
                  Create First Sprint
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Card>

      {/* Create / Edit Sprint Dialog */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingSprintId ? "Edit Sprint" : "Create New Sprint"}

          <IconButton onClick={handleCloseDialog}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Sprint Name"
              fullWidth
              value={formData.name}
              onChange={(event) =>
                handleFormChange("name", event.target.value)
              }
              placeholder="e.g. Sprint 06"
              error={Boolean(formErrors.name)}
              helperText={formErrors.name || " "}
            />

            <TextField
              label="Sprint Goal"
              fullWidth
              multiline
              minRows={3}
              value={formData.goal}
              onChange={(event) =>
                handleFormChange("goal", event.target.value)
              }
              placeholder="Describe the sprint objective..."
              error={Boolean(formErrors.goal)}
              helperText={formErrors.goal || " "}
            />

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={(event) =>
                handleFormChange("startDate", event.target.value)
              }
              error={Boolean(formErrors.startDate)}
              helperText={formErrors.startDate || " "}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={formData.endDate}
              onChange={(event) =>
                handleFormChange("endDate", event.target.value)
              }
              error={Boolean(formErrors.endDate)}
              helperText={formErrors.endDate || " "}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: formData.startDate || undefined,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>

          <Button variant="contained" onClick={handleCreateSprint}>
            {editingSprintId ? "Save Changes" : "Create Sprint"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sprint Details Dialog */}

      <Dialog
        open={Boolean(selectedSprint)}
        onClose={() => setSelectedSprint(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedSprint && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize={20}>
                  {selectedSprint.name}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  Sprint Details
                </Typography>
              </Box>

              <IconButton onClick={() => setSelectedSprint(null)}>
                <CloseRounded />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 2 }}
              >
                <SprintStatus status={selectedSprint.status} />

                <Chip
                  size="small"
                  icon={<FlagRounded sx={{ fontSize: 15 }} />}
                  label={`${getSprintProgress(selectedSprint)}% Complete`}
                  variant="outlined"
                />
              </Stack>

              <Typography fontWeight={600}>Sprint Goal</Typography>

              <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
                {selectedSprint.goal}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                Sprint Timeline
              </Typography>

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    Start Date
                  </Typography>

                  <Typography fontSize={13} fontWeight={600}>
                    {formatDate(selectedSprint.startDate)}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    End Date
                  </Typography>

                  <Typography fontSize={13} fontWeight={600}>
                    {formatDate(selectedSprint.endDate)}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    Remaining Time
                  </Typography>

                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    color={
                      selectedSprint.status === "Completed"
                        ? "success.main"
                        : getRemainingDays(selectedSprint.endDate) < 0
                          ? "error.main"
                          : "primary.main"
                    }
                  >
                    {selectedSprint.status === "Completed"
                      ? "Completed"
                      : getRemainingDays(selectedSprint.endDate) < 0
                        ? `${Math.abs(
                            getRemainingDays(selectedSprint.endDate)
                          )} days overdue`
                        : getRemainingDays(selectedSprint.endDate) === 0
                          ? "Ends today"
                          : `${getRemainingDays(
                              selectedSprint.endDate
                            )} days`}
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                Task Overview
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1.5,
                }}
              >
                {[
                  {
                    label: "Total Tasks",
                    value: selectedSprint.tasks,
                  },
                  {
                    label: "Completed",
                    value: selectedSprint.completed,
                  },
                  {
                    label: "In Progress",
                    value: selectedSprint.inProgress,
                  },
                  {
                    label: "To Do",
                    value: selectedSprint.todo,
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#F5F7FB",
                    }}
                  >
                    <Typography fontSize={12} color="text.secondary">
                      {item.label}
                    </Typography>

                    <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography fontSize={13} fontWeight={600}>
                    Overall Progress
                  </Typography>

                  <Typography fontSize={13} fontWeight={700}>
                    {getSprintProgress(selectedSprint)}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={getSprintProgress(selectedSprint)}
                  sx={{ height: 9, borderRadius: 5 }}
                />
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1.5 }}
              >
                <GroupsRounded color="primary" />

                <Typography fontWeight={700}>
                  Team Members ({selectedSprint.members.length})
                </Typography>
              </Stack>

              {selectedSprint.members.length > 0 ? (
                <Stack spacing={1}>
                  {selectedSprint.members.map((member, index) => (
                    <Stack
                      key={`${member}-${index}`}
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center" }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: 12,
                          backgroundColor: "#DBEAFE",
                          color: "#1D4ED8",
                        }}
                      >
                        {member.charAt(0).toUpperCase()}
                      </Avatar>

                      <Typography fontSize={13} fontWeight={500}>
                        {member}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" fontSize={13}>
                  No team members assigned yet.
                </Typography>
              )}

              <Divider sx={{ my: 2.5 }} />

              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 1.5 }}
              >
                <AssignmentOutlined color="primary" />

                <Typography fontWeight={700}>
                  Task Preview ({selectedSprint.taskItems.length} of{" "}
                  {selectedSprint.tasks})
                </Typography>
              </Stack>

              {selectedSprint.taskItems.length > 0 ? (
                <Stack spacing={1.5}>
                  {selectedSprint.taskItems.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600} fontSize={13}>
                            {task.title}
                          </Typography>

                          <Typography
                            fontSize={12}
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            Assigned to: {task.assignee}
                          </Typography>
                        </Box>

                        <SprintStatus status={task.status} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" fontSize={13}>
                  No tasks have been added to this sprint yet.
                </Typography>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedSprint(null)}>Close</Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleEditSprint(selectedSprint);
                  setSelectedSprint(null);
                }}
              >
                Edit Sprint
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Sprint Confirmation Dialog */}

      <Dialog
        open={deleteSprintId !== null}
        onClose={() => setDeleteSprintId(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Delete Sprint
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" fontSize={14}>
            Are you sure you want to delete{" "}
            <strong>
              {sprints.find((sprint) => sprint.id === deleteSprintId)?.name}
            </strong>
            ?
          </Typography>

          <Typography color="error.main" fontSize={12} sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => setDeleteSprintId(null)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={confirmDeleteSprint}
          >
            Delete Sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamLeaderSprints;
