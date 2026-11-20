import { useMemo, useState } from "react";

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
} from "@mui/material";

import {
  AddRounded,
  SearchRounded,
  MoreHorizRounded,
  FolderOutlined,
} from "@mui/icons-material";

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesigning the company website.",
    leader: "Ahmed Mohamed",
    status: "In Progress",
    startDate: "01 Oct 2026",
    endDate: "30 Dec 2026",
    progress: 65,
  },
  {
    id: 2,
    name: "Mobile Application",
    description: "Developing the company mobile application.",
    leader: "Sara Ali",
    status: "Planning",
    startDate: "15 Oct 2026",
    endDate: "15 Jan 2027",
    progress: 25,
  },
  {
    id: 3,
    name: "HR System",
    description: "Building an internal HR management system.",
    leader: "Mohamed Hassan",
    status: "In Progress",
    startDate: "01 Sep 2026",
    endDate: "20 Dec 2026",
    progress: 80,
  },
  {
    id: 4,
    name: "Internal Dashboard",
    description: "Creating an internal analytics dashboard.",
    leader: "Mona Ahmed",
    status: "Completed",
    startDate: "01 Jul 2026",
    endDate: "30 Sep 2026",
    progress: 100,
  },
  {
    id: 5,
    name: "Attendance System",
    description: "Developing a smart attendance system.",
    leader: "Omar Khaled",
    status: "In Progress",
    startDate: "10 Oct 2026",
    endDate: "25 Dec 2026",
    progress: 45,
  },
];

const statusStyles = {
  "In Progress": {
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
  },
  Planning: {
    color: "#B45309",
    backgroundColor: "#FEF3C7",
  },
  Completed: {
    color: "#15803D",
    backgroundColor: "#DCFCE7",
  },
  "On Hold": {
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  },
};

function TeamLeaderProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    leader: "",
    startDate: "",
    endDate: "",
    status: "Planning",
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.leader.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Active" && project.status !== "Completed") ||
        (activeTab === "Completed" && project.status === "Completed");

      return matchesSearch && matchesTab;
    });
  }, [projects, search, activeTab]);

  const handleAddProject = () => {
    if (
      !newProject.name.trim() ||
      !newProject.leader.trim() ||
      !newProject.startDate ||
      !newProject.endDate
    ) {
      return;
    }

    const project = {
      id: Date.now(),
      ...newProject,
      startDate: new Date(newProject.startDate).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" }
      ),
      endDate: new Date(newProject.endDate).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" }
      ),
      progress: 0,
    };

    setProjects((prev) => [project, ...prev]);
    setNewProject({
      name: "",
      description: "",
      leader: "",
      startDate: "",
      endDate: "",
      status: "Planning",
    });
    setOpenDialog(false);
  };

  const activeCount = projects.filter(
    (project) => project.status !== "Completed"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return (
    <Box>
      {/* Page Header */}
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
          onClick={() => setOpenDialog(true)}
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

      {/* Summary Cards */}
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
            title: "Total Projects",
            value: projects.length,
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

      {/* Projects Container */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        {/* Filters */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Projects Table */}
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
              {filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  hover
                  sx={{
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

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {project.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="body2" fontWeight={500}>
                      {project.leader}
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
                      {project.startDate}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="body2">
                      {project.endDate}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 150 }}>
                    <Stack spacing={0.8}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Progress
                        </Typography>

                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="#17365D"
                        >
                          {project.progress}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          height: 7,
                          borderRadius: 5,
                          backgroundColor: "#E2E8F0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            backgroundColor:
                              project.progress === 100
                                ? "#16A34A"
                                : "#2563EB",
                          },
                        }}
                      />
                    </Stack>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreHorizRounded />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No projects found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTop: "1px solid #E2E8F0",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {filteredProjects.length} of {projects.length} projects
          </Typography>
        </Box>
      </Paper>

      {/* Add Project Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#17365D" }}>
          Create New Project
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
            />

            <TextField
              label="Team Leader"
              fullWidth
              value={newProject.leader}
              onChange={(e) =>
                setNewProject({ ...newProject, leader: e.target.value })
              }
            />

            <TextField
              label="Status"
              select
              fullWidth
              value={newProject.status}
              onChange={(e) =>
                setNewProject({ ...newProject, status: e.target.value })
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
              InputLabelProps={{ shrink: true }}
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  startDate: e.target.value,
                })
              }
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newProject.endDate}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  endDate: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddProject}
            disabled={
              !newProject.name.trim() ||
              !newProject.leader.trim() ||
              !newProject.startDate ||
              !newProject.endDate
            }
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamLeaderProjects;