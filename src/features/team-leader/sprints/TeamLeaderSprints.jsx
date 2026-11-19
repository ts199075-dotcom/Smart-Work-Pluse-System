/* eslint-disable no-unused-vars */
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
  Grid,
} from "@mui/material";

import {
  AddRounded,
  RocketLaunchRounded,
  TaskAltRounded,
  GroupsRounded,
  ScheduleRounded,
  MoreHorizRounded,
  CloseRounded,
  CalendarMonthRounded,
  FlagRounded,
  EditRounded,
  DeleteOutlineRounded,
  SearchRounded,
} from "@mui/icons-material";

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
  },
];

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
};

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

function SprintStatus({ status }) {
  const style = statusStyles[status];

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

function SprintCard({ sprint, onView, onEdit, onDelete, onStatusChange }) {
  const progress =
    sprint.tasks > 0
      ? Math.round((sprint.completed / sprint.tasks) * 100)
      : 0;

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

        <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center" }}
            >
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

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2, alignItems: "center" }}
      >
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
          <CalendarMonthRounded
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography fontSize={12} color="text.secondary">
            {sprint.startDate}
          </Typography>
        </Stack>
      </Stack>

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

function TeamLeaderSprints() {
  const [sprints, setSprints] = useState(initialSprints);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
  });
  
  const [editingSprintId, setEditingSprintId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const summary = useMemo(() => {
    return {
      total: sprints.length,
      active: sprints.filter((sprint) => sprint.status === "Active").length,
      completed: sprints.filter(
        (sprint) => sprint.status === "Completed"
      ).length,
      planned: sprints.filter((sprint) => sprint.status === "Planned").length,
    };
  }, [sprints]);

  const filteredSprints = useMemo(() => {
    return sprints.filter((sprint) => {
        const matchesStatus =
        selectedFilter === "All" || sprint.status === selectedFilter;

        const matchesSearch =
        `${sprint.name} ${sprint.goal}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });
  }, [sprints, selectedFilter, searchTerm]);

  const currentSprint = sprints.find(
    (sprint) => sprint.status === "Active"
  );

  const handleCreateSprint = () => {
    if (
        !formData.name.trim() ||
        !formData.goal.trim() ||
        !formData.startDate ||
        !formData.endDate ||
        formData.endDate < formData.startDate
    ) {
        return;
    }

    if (editingSprintId) {
        setSprints((previous) =>
        previous.map((sprint) =>
            sprint.id === editingSprintId
            ? { ...sprint, ...formData }
            : sprint
        )
        );
    } else {
        const newSprint = {
        id: Date.now(),
        ...formData,
        status: "Planned",
        tasks: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        members: [],
        };

        setSprints((previous) => [newSprint, ...previous]);
    }

    setEditingSprintId(null);

    setFormData({
        name: "",
        goal: "",
        startDate: "",
        endDate: "",
    });

    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSprintId(null);

    setFormData({
        name: "",
        goal: "",
        startDate: "",
        endDate: "",
    });
  };

  const handleEditSprint = (sprint) => {
  setEditingSprintId(sprint.id);

  setFormData({
    name: sprint.name,
    goal: sprint.goal,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
  });

  setOpenDialog(true);
};

const handleDeleteSprint = (sprintId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this sprint?"
  );

  if (!confirmed) return;

  setSprints((previous) =>
    previous.filter((sprint) => sprint.id !== sprintId)
  );

  if (selectedSprint?.id === sprintId) {
    setSelectedSprint(null);
  }
};

const handleStatusChange = (sprintId, newStatus) => {
    setSprints((previous) =>
        previous.map((sprint) => {
        if (sprint.id === sprintId) {
            return { ...sprint, status: newStatus };
        }

        // Keep only one active sprint at a time.
        if (newStatus === "Active" && sprint.status === "Active") {
            return { ...sprint, status: "Planned" };
        }

        return sprint;
        })
    );

    setSelectedSprint((previous) => {
        if (!previous) return previous;

        if (previous.id === sprintId) {
        return { ...previous, status: newStatus };
        }

        if (newStatus === "Active" && previous.status === "Active") {
        return { ...previous, status: "Planned" };
        }

        return previous;
    });
    };

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
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2, px: 2.5, py: 1.2 }}
        >
          {editingSprintId ? "Save Changes" : "Create Sprint"}
        </Button>
      </Stack>

      {/* Summary */}
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

              <Typography
                color="text.secondary"
                fontSize={13}
                sx={{ mt: 0.7 }}
              >
                {currentSprint.goal}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2, flexWrap: "wrap" }}
              >
                <Typography fontSize={12} color="text.secondary">
                  Start: {currentSprint.startDate}
                </Typography>

                <Typography fontSize={12} color="text.secondary">
                  End: {currentSprint.endDate}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ width: { xs: "100%", md: 260 } }}>
              <Typography fontSize={13} fontWeight={600} sx={{ mb: 1 }}>
                Sprint Completion
              </Typography>

              <Typography variant="h4" fontWeight={700}>
                {Math.round(
                  (currentSprint.completed / currentSprint.tasks) * 100
                )}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={
                  (currentSprint.completed / currentSprint.tasks) * 100
                }
                sx={{ mt: 1, height: 9, borderRadius: 5 }}
              />

              <Typography
                color="text.secondary"
                fontSize={12}
                sx={{ mt: 1 }}
              >
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
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
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

      {/* Sprint List */}
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
          <Box>
            <Typography variant="h6" fontWeight={700}>
              All Sprints
            </Typography>
            <TextField
                size="small"
                placeholder="Search sprints..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                sx={{ minWidth: 200 }}
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

            <Typography color="text.secondary" fontSize={13}>
              Manage and review your team's sprints.
            </Typography>
          </Box>

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

        <Grid container spacing={2}>
          {filteredSprints.map((sprint) => (
            <Grid item xs={12} md={6} key={sprint.id}>
              <SprintCard
                sprint={sprint}
                onView={setSelectedSprint}
                onEdit={handleEditSprint}
                onDelete={handleDeleteSprint}
                onStatusChange={handleStatusChange}
              />
            </Grid>
          ))}
        </Grid>

        {filteredSprints.length === 0 && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography fontWeight={600}>
              No sprints found
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Try changing the selected status.
            </Typography>
          </Box>
        )}
      </Card>

      {/* Create Sprint Dialog */}
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
        >{editingSprintId ? "Edit Sprint" : "Create New Sprint"}
          

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
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="e.g. Sprint 06"
            />

            <TextField
              label="Sprint Goal"
              fullWidth
              multiline
              minRows={3}
              value={formData.goal}
              onChange={(event) =>
                setFormData({ ...formData, goal: event.target.value })
              }
              placeholder="Describe the sprint objective..."
            />

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(event) =>
                setFormData({ ...formData, startDate: event.target.value })
              }
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(event) =>
                setFormData({ ...formData, endDate: event.target.value })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateSprint}
            disabled={
              !formData.name.trim() ||
              !formData.goal.trim() ||
              !formData.startDate ||
              !formData.endDate ||
              formData.endDate < formData.startDate
            }
          >
            Create Sprint
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
              {selectedSprint.name}

              <IconButton onClick={() => setSelectedSprint(null)}>
                <CloseRounded />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <SprintStatus status={selectedSprint.status} />

              <Typography
                fontWeight={600}
                sx={{ mt: 2 }}
              >
                Sprint Goal
              </Typography>

              <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
                {selectedSprint.goal}
              </Typography>

              <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    Start Date
                  </Typography>

                  <Typography fontSize={13} fontWeight={600}>
                    {selectedSprint.startDate}
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
                    {selectedSprint.endDate}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    Total Tasks
                  </Typography>

                  <Typography fontSize={13} fontWeight={600}>
                    {selectedSprint.tasks}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Typography fontSize={13} color="text.secondary">
                    Completed Tasks
                  </Typography>

                  <Typography fontSize={13} fontWeight={600}>
                    {selectedSprint.completed}
                  </Typography>
                </Stack>
              </Stack>

              <Typography fontWeight={600} sx={{ mt: 3, mb: 1 }}>
                Team Members
              </Typography>

              <Stack direction="row" spacing={1}>
                {selectedSprint.members.map((member, index) => (
                  <Avatar
                    key={`${member}-${index}`}
                    sx={{
                      width: 34,
                      height: 34,
                      fontSize: 12,
                      backgroundColor: "#DBEAFE",
                      color: "#1D4ED8",
                    }}
                  >
                    {member.charAt(0)}
                  </Avatar>
                ))}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedSprint(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default TeamLeaderSprints;