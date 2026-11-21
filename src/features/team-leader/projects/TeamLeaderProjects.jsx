import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  IconButton,
  Menu,
  Alert,
  Snackbar,
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  MoreHorizRounded,
  FolderOutlined,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";
import { calculateProjectProgress } from "./projectsData";

const statusStyles = {
  "In Progress": { color: "#2563EB", backgroundColor: "#DBEAFE" },
  Planning: { color: "#B45309", backgroundColor: "#FEF3C7" },
  Completed: { color: "#15803D", backgroundColor: "#DCFCE7" },
  "On Hold": { color: "#64748B", backgroundColor: "#F1F5F9" },
};

const emptyProject = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Planning",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function TeamLeaderProjects({ currentTeamLeader }) {
  const navigate = useNavigate();

  const { projects, setProjects, employees } = useAppData();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyProject);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Find the current team leader from shared employees data
  const currentLeader = useMemo(() => {
    return employees.find(
      (employee) => employee.name === currentTeamLeader
    );
  }, [employees, currentTeamLeader]);

  const currentLeaderId = currentLeader?.id;

  // Only show projects owned by the current team leader
  const myProjects = useMemo(() => {
    if (!currentLeaderId) return [];

    return projects.filter(
      (project) => project.leaderId === currentLeaderId
    );
  }, [projects, currentLeaderId]);

  // Search and tabs
  const filteredProjects = useMemo(() => {
    return myProjects.filter((project) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (project.name || "").toLowerCase().includes(searchValue) ||
        (project.description || "").toLowerCase().includes(searchValue);

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Active" && project.status !== "Completed") ||
        (activeTab === "Completed" && project.status === "Completed");

      return matchesSearch && matchesTab;
    });
  }, [myProjects, search, activeTab]);

  const activeCount = myProjects.filter(
    (project) => project.status !== "Completed"
  ).length;

  const completedCount = myProjects.filter(
    (project) => project.status === "Completed"
  ).length;

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
    setForm(emptyProject);
  };

  const openAddDialog = () => {
    if (!currentLeaderId) {
      showNotification(
        "The current team leader could not be found.",
        "error"
      );
      return;
    }

    setEditingProject(null);
    setForm(emptyProject);
    setOpenDialog(true);
  };

  const openEditDialog = () => {
    if (!selectedProject) return;

    setEditingProject(selectedProject);

    setForm({
      name: selectedProject.name || "",
      description: selectedProject.description || "",
      startDate: selectedProject.startDate || "",
      endDate: selectedProject.endDate || "",
      status: selectedProject.status || "Planning",
    });

    setMenuAnchor(null);
    setOpenDialog(true);
  };

  const handleSaveProject = () => {
    if (
      !form.name.trim() ||
      !form.startDate ||
      !form.endDate ||
      form.endDate < form.startDate
    ) {
      showNotification("Please enter valid project information.", "error");
      return;
    }

    if (!currentLeaderId) {
      showNotification("Team leader information is missing.", "error");
      return;
    }

    if (editingProject) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id &&
          project.leaderId === currentLeaderId
            ? {
                ...project,
                name: form.name.trim(),
                description: form.description.trim(),
                startDate: form.startDate,
                endDate: form.endDate,
                status: form.status,
              }
            : project
        )
      );

      showNotification("Project updated successfully.");
    } else {
      const newProjectId = Date.now();

      const newProject = {
        id: newProjectId,
        name: form.name.trim(),
        description: form.description.trim(),
        leaderId: currentLeaderId,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        memberIds: [currentLeaderId],
        tasks: [],
        activities: [
          {
            id: Date.now() + 1,
            title: "Project created",
            userId: currentLeaderId,
            date: form.startDate,
          },
        ],
      };

      setProjects((prev) => [newProject, ...prev]);

      showNotification("Project created successfully.");
    }

    closeDialog();
  };

  const handleDeleteProject = () => {
    if (!selectedProject || !currentLeaderId) return;

    setProjects((prev) =>
      prev.filter(
        (project) =>
          project.id !== selectedProject.id ||
          project.leaderId !== currentLeaderId
      )
    );

    setDeleteDialog(false);
    setMenuAnchor(null);
    setSelectedProject(null);

    showNotification("Project deleted successfully.");
  };

  const openProjectMenu = (event, project) => {
    event.stopPropagation();

    if (project.leaderId !== currentLeaderId) return;

    setSelectedProject(project);
    setMenuAnchor(event.currentTarget);
  };

  const getProjectLeaderName = (project) => {
    const leader = employees.find(
      (employee) => employee.id === project.leaderId
    );

    return leader?.name || "Unknown";
  };

  const getProjectProgress = (project) => {
    return calculateProjectProgress(project.tasks || []);
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "#17365D", mb: 0.5 }}>
            Projects
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage your projects and track their progress.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openAddDialog}
          sx={{
            backgroundColor: "#2563EB",
            borderRadius: "10px",
            px: 2.5,
            py: 1.2,
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          New Project
        </Button>
      </Stack>

      {/* Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            title: "Total Projects",
            value: myProjects.length,
            color: "#2563EB",
          },
          {
            title: "Active Projects",
            value: activeCount,
            color: "#D97706",
          },
          {
            title: "Completed Projects",
            value: completedCount,
            color: "#16A34A",
          },
        ].map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {item.title}
            </Typography>

            <Typography
              variant="h4"
              sx={{ mt: 1, color: item.color, fontWeight: 700 }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Projects Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            sx={{
              minHeight: 42,
              "& .MuiTab-root": {
                minHeight: 42,
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            <Tab label="All Projects" value="All" />
            <Tab label="Active" value="Active" />
            <Tab label="Completed" value="Completed" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              width: { xs: "100%", md: 260 },
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
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
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                {[
                  "Project Name",
                  "Team Leader",
                  "Status",
                  "Start Date",
                  "End Date",
                  "Progress",
                  "",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "#64748B",
                      fontWeight: 600,
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      py: 2,
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProjects.map((project) => {
                const progress = getProjectProgress(project);

                return (
                  <TableRow
                    key={project.id}
                    hover
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 2.2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            backgroundColor: "#EFF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#2563EB",
                          }}
                        >
                          <FolderOutlined />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#17365D",
                            }}
                          >
                            {project.name}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {project.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography variant="body2" fontWeight={500}>
                        {getProjectLeaderName(project)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "11px",
                          borderRadius: "6px",
                          color:
                            statusStyles[project.status]?.color || "#64748B",
                          backgroundColor:
                            statusStyles[project.status]?.backgroundColor ||
                            "#F1F5F9",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography variant="body2">
                        {formatDate(project.startDate)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography variant="body2">
                        {formatDate(project.endDate)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ minWidth: 150 }}>
                      <Stack spacing={0.8}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>

                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="#17365D"
                          >
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
                                progress === 100 ? "#16A34A" : "#2563EB",
                            },
                          }}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => openProjectMenu(event, project)}
                      >
                        <MoreHorizRounded />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {myProjects.length === 0
                        ? "You don't have any projects yet."
                        : "No projects found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid #E2E8F0" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredProjects.length} of {myProjects.length} projects
          </Typography>
        </Box>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (selectedProject) {
              navigate(`/projects/${selectedProject.id}`);
            }
            setMenuAnchor(null);
          }}
        >
          View Details
        </MenuItem>

        <MenuItem onClick={openEditDialog}>Edit Project</MenuItem>

        <MenuItem
          sx={{ color: "#DC2626" }}
          onClick={() => {
            setMenuAnchor(null);
            setDeleteDialog(true);
          }}
        >
          Delete Project
        </MenuItem>
      </Menu>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#17365D" }}>
          {editingProject ? "Edit Project" : "Create New Project"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />

            <TextField
              label="Status"
              select
              fullWidth
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
            >
              <MenuItem value="Planning">Planning</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>

            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={form.startDate}
              onChange={(event) =>
                setForm({ ...form, startDate: event.target.value })
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={form.endDate}
              onChange={(event) =>
                setForm({ ...form, endDate: event.target.value })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: form.startDate || undefined },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveProject}
            disabled={
              !form.name.trim() ||
              !form.startDate ||
              !form.endDate ||
              form.endDate < form.startDate
            }
          >
            {editingProject ? "Save Changes" : "Create Project"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Delete Project?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete "{selectedProject?.name}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => {
              setDeleteDialog(false);
              setSelectedProject(null);
            }}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteProject}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() =>
          setNotification((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((prev) => ({ ...prev, open: false }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeamLeaderProjects;