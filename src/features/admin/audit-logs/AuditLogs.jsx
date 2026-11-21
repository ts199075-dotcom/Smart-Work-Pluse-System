import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  SearchRounded,
  HistoryRounded,
  AddCircleOutlineRounded,
  EditRounded,
  DeleteOutlineRounded,
  LoginRounded,
  DownloadRounded,
  VisibilityRounded,
  CloseRounded,
  FilterAltOffRounded,
  SecurityRounded,
} from "@mui/icons-material";

const initialLogs = [
  {
    id: 1,
    user: "Ahmed Hassan",
    email: "ahmed@smartworkspace.com",
    role: "Admin",
    action: "Create",
    module: "Users",
    description: "Created a new user account for Omar Ali.",
    target: "Omar Ali",
    date: "2026-11-21",
    time: "09:15 AM",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    user: "Sara Ahmed",
    email: "sara@smartworkspace.com",
    role: "HR",
    action: "Update",
    module: "Employees",
    description: "Updated employee information.",
    target: "Mariam Mohamed",
    date: "2026-11-21",
    time: "09:42 AM",
    ip: "192.168.1.15",
  },
  {
    id: 3,
    user: "Mohamed Eid",
    email: "mohamed@smartworkspace.com",
    role: "Team Leader",
    action: "Update",
    module: "Projects",
    description: "Updated the progress of a project.",
    target: "Website Redesign",
    date: "2026-11-21",
    time: "10:05 AM",
    ip: "192.168.1.20",
  },
  {
    id: 4,
    user: "Ahmed Hassan",
    email: "ahmed@smartworkspace.com",
    role: "Admin",
    action: "Delete",
    module: "Users",
    description: "Removed a user account from the system.",
    target: "Inactive User",
    date: "2026-11-21",
    time: "10:30 AM",
    ip: "192.168.1.10",
  },
  {
    id: 5,
    user: "Omar Ali",
    email: "omar@smartworkspace.com",
    role: "Member",
    action: "Login",
    module: "Authentication",
    description: "Successfully logged into the system.",
    target: "User Session",
    date: "2026-11-21",
    time: "11:00 AM",
    ip: "192.168.1.25",
  },
  {
    id: 6,
    user: "Sara Ahmed",
    email: "sara@smartworkspace.com",
    role: "HR",
    action: "Create",
    module: "Payroll",
    description: "Created a new payroll record.",
    target: "November Payroll",
    date: "2026-11-20",
    time: "01:20 PM",
    ip: "192.168.1.15",
  },
  {
    id: 7,
    user: "Ahmed Hassan",
    email: "ahmed@smartworkspace.com",
    role: "Admin",
    action: "Update",
    module: "Settings",
    description: "Updated company working hours.",
    target: "Company Settings",
    date: "2026-11-20",
    time: "02:10 PM",
    ip: "192.168.1.10",
  },
  {
    id: 8,
    user: "Mohamed Eid",
    email: "mohamed@smartworkspace.com",
    role: "Team Leader",
    action: "Create",
    module: "Tasks",
    description: "Created a new task inside a project.",
    target: "Implement Login Page",
    date: "2026-11-20",
    time: "03:25 PM",
    ip: "192.168.1.20",
  },
  {
    id: 9,
    user: "Omar Ali",
    email: "omar@smartworkspace.com",
    role: "Member",
    action: "Login",
    module: "Authentication",
    description: "Successfully logged into the system.",
    target: "User Session",
    date: "2026-11-19",
    time: "08:50 AM",
    ip: "192.168.1.25",
  },
  {
    id: 10,
    user: "Sara Ahmed",
    email: "sara@smartworkspace.com",
    role: "HR",
    action: "Update",
    module: "Attendance",
    description: "Updated an employee attendance record.",
    target: "Ahmed Hassan",
    date: "2026-11-19",
    time: "10:15 AM",
    ip: "192.168.1.15",
  },
  {
    id: 11,
    user: "Ahmed Hassan",
    email: "ahmed@smartworkspace.com",
    role: "Admin",
    action: "Create",
    module: "Roles & Permissions",
    description: "Created a new permission configuration.",
    target: "Team Leader Permissions",
    date: "2026-11-18",
    time: "11:40 AM",
    ip: "192.168.1.10",
  },
  {
    id: 12,
    user: "Mohamed Eid",
    email: "mohamed@smartworkspace.com",
    role: "Team Leader",
    action: "Delete",
    module: "Tasks",
    description: "Deleted an unnecessary task.",
    target: "Old Testing Task",
    date: "2026-11-18",
    time: "02:35 PM",
    ip: "192.168.1.20",
  },
];

const actionConfig = {
  Create: {
    color: "success",
    icon: <AddCircleOutlineRounded fontSize="small" />,
    background: "#ECFDF3",
    text: "#15803D",
  },
  Update: {
    color: "info",
    icon: <EditRounded fontSize="small" />,
    background: "#EFF6FF",
    text: "#2563EB",
  },
  Delete: {
    color: "error",
    icon: <DeleteOutlineRounded fontSize="small" />,
    background: "#FEF2F2",
    text: "#DC2626",
  },
  Login: {
    color: "default",
    icon: <LoginRounded fontSize="small" />,
    background: "#F1F5F9",
    text: "#475569",
  },
};

const StatCard = ({ title, value, icon, color, background }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid #E8EDF5",
      borderRadius: "14px",
      height: "100%",
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={500}>
            {title}
          </Typography>

          <Typography
            fontSize={27}
            fontWeight={700}
            color="#17365D"
            mt={1}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "12px",
            bgcolor: background,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ActionBadge = ({ action }) => {
  const config = actionConfig[action] || actionConfig.Login;

  return (
    <Chip
      icon={config.icon}
      label={action}
      size="small"
      sx={{
        bgcolor: config.background,
        color: config.text,
        fontWeight: 600,
        borderRadius: "7px",
        "& .MuiChip-icon": { color: config.text },
      }}
    />
  );
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UserAvatar = ({ name }) => (
  <Avatar
    sx={{
      width: 36,
      height: 36,
      bgcolor: "#EAF0FF",
      color: "#2563EB",
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {getInitials(name)}
  </Avatar>
);

const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "130px 1fr" },
      gap: 1,
      py: 1.5,
    }}
  >
    <Typography fontSize={13} color="text.secondary" fontWeight={500}>
      {label}
    </Typography>

    <Typography
      fontSize={13}
      color="#17365D"
      fontWeight={600}
      sx={{ overflowWrap: "anywhere" }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

export default function AuditLogs() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          log.user,
          log.email,
          log.description,
          log.target,
          log.module,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesAction =
        actionFilter === "All" || log.action === actionFilter;

      const matchesRole =
        roleFilter === "All" || log.role === roleFilter;

      const matchesModule =
        moduleFilter === "All" || log.module === moduleFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesRole &&
        matchesModule
      );
    });
  }, [logs, search, actionFilter, roleFilter, moduleFilter]);

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = useMemo(
    () => ({
      total: logs.length,
      create: logs.filter((log) => log.action === "Create").length,
      update: logs.filter((log) => log.action === "Update").length,
      delete: logs.filter((log) => log.action === "Delete").length,
    }),
    [logs]
  );

  const handleResetFilters = () => {
    setSearch("");
    setActionFilter("All");
    setRoleFilter("All");
    setModuleFilter("All");
    setPage(0);
  };

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      setSnackbar({
        open: true,
        message: "There are no records to export.",
        severity: "warning",
      });
      return;
    }

    const headers = [
      "ID",
      "User",
      "Email",
      "Role",
      "Action",
      "Module",
      "Description",
      "Target",
      "Date",
      "Time",
      "IP Address",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredLogs.map((log) =>
      [
        log.id,
        log.user,
        log.email,
        log.role,
        log.action,
        log.module,
        log.description,
        log.target,
        log.date,
        log.time,
        log.ip,
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = [headers.map(escapeCSV).join(","), ...rows].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-workspace-audit-logs.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: "Audit logs exported successfully.",
      severity: "success",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "none",
        boxSizing: "border-box",
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: "#F5F7FB",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#17365D"
            sx={{ fontSize: { xs: 25, md: 30 } }}
          >
            Audit Logs
          </Typography>

          <Typography color="text.secondary" mt={0.5} fontSize={14}>
            Monitor and review activities performed across your company system.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<DownloadRounded />}
          onClick={handleExport}
          sx={{
            bgcolor: "#2563EB",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1.1,
            "&:hover": { bgcolor: "#1D4ED8" },
          }}
        >
          Export CSV
        </Button>
      </Stack>

      {/* Statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon={<HistoryRounded />}
          color="#2563EB"
          background="#EFF6FF"
        />

        <StatCard
          title="Create Actions"
          value={stats.create}
          icon={<AddCircleOutlineRounded />}
          color="#16A34A"
          background="#ECFDF3"
        />

        <StatCard
          title="Update Actions"
          value={stats.update}
          icon={<EditRounded />}
          color="#2563EB"
          background="#EFF6FF"
        />

        <StatCard
          title="Delete Actions"
          value={stats.delete}
          icon={<DeleteOutlineRounded />}
          color="#DC2626"
          background="#FEF2F2"
        />
      </Box>

      {/* Logs Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #E8EDF5",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SecurityRounded sx={{ color: "#2563EB" }} />

              <Typography fontWeight={700} color="#17365D" fontSize={17}>
                Activity History
              </Typography>
            </Stack>

            <Typography color="text.secondary" fontSize={12} mt={0.5}>
              Review system activities and user actions.
            </Typography>
          </Box>

          <Chip
            label={`${filteredLogs.length} Records`}
            size="small"
            sx={{
              bgcolor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 600,
            }}
          />
        </Box>

        <Divider />

        {/* Filters */}
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "2fr repeat(3, minmax(130px, 1fr)) auto",
            },
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search user, activity, or target..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            size="small"
            label="Action"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
          >
            <MenuItem value="All">All Actions</MenuItem>
            <MenuItem value="Create">Create</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
            <MenuItem value="Login">Login</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
          >
            <MenuItem value="All">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Team Leader">Team Leader</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            size="small"
            label="Module"
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
          >
            <MenuItem value="All">All Modules</MenuItem>
            {[...new Set(logs.map((log) => log.module))].map((module) => (
              <MenuItem key={module} value={module}>
                {module}
              </MenuItem>
            ))}
          </TextField>

          <Tooltip title="Reset Filters">
            <IconButton
              onClick={handleResetFilters}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                width: 40,
                height: 40,
              }}
            >
              <FilterAltOffRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Table */}
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                {[
                  "USER",
                  "ACTION",
                  "MODULE",
                  "DESCRIPTION",
                  "DATE & TIME",
                  "DETAILS",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      color: "#64748B",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      py: 1.8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow
                  key={log.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ py: 1.8 }}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <UserAvatar name={log.user} />

                      <Box>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color="#17365D"
                          whiteSpace="nowrap"
                        >
                          {log.user}
                        </Typography>

                        <Typography fontSize={11} color="text.secondary">
                          {log.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      color="#475569"
                      whiteSpace="nowrap"
                    >
                      {log.module}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      fontSize={12}
                      color="#475569"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.description}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontSize={12} color="#17365D" fontWeight={600}>
                      {log.date}
                    </Typography>

                    <Typography fontSize={11} color="text.secondary">
                      {log.time}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedLog(log)}
                        sx={{
                          color: "#2563EB",
                          bgcolor: "#EFF6FF",
                          "&:hover": { bgcolor: "#DBEAFE" },
                        }}
                      >
                        <VisibilityRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box py={6} textAlign="center">
                      <HistoryRounded
                        sx={{ fontSize: 42, color: "#CBD5E1", mb: 1 }}
                      />

                      <Typography fontWeight={600} color="#475569">
                        No activities found
                      </Typography>

                      <Typography
                        fontSize={12}
                        color="text.secondary"
                        mt={0.5}
                      >
                        Try changing your search or filters.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 8, 10, 15]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              minHeight: 58,
              px: { xs: 1, sm: 2 },
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: 12,
                color: "#64748B",
              },
          }}
        />
      </Card>

      {/* Log Details Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: "16px" },
        }}
      >
        {selectedLog && (
          <>
            <DialogTitle sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={700} color="#17365D" fontSize={19}>
                    Activity Details
                  </Typography>

                  <Typography color="text.secondary" fontSize={12} mt={0.5}>
                    Audit record #{selectedLog.id}
                  </Typography>
                </Box>

                <IconButton onClick={() => setSelectedLog(null)} size="small">
                  <CloseRounded />
                </IconButton>
              </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <UserAvatar name={selectedLog.user} />

                <Box>
                  <Typography fontWeight={700} color="#17365D" fontSize={14}>
                    {selectedLog.user}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary">
                    {selectedLog.email}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                <ActionBadge action={selectedLog.action} />

                <Chip
                  label={selectedLog.role}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Divider />

              <DetailRow label="Module" value={selectedLog.module} />
              <Divider />

              <DetailRow label="Target" value={selectedLog.target} />
              <Divider />

              <DetailRow
                label="Description"
                value={selectedLog.description}
              />
              <Divider />

              <DetailRow label="Date" value={selectedLog.date} />
              <Divider />

              <DetailRow label="Time" value={selectedLog.time} />
              <Divider />

              <DetailRow label="IP Address" value={selectedLog.ip} />
            </DialogContent>

            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                onClick={() => setSelectedLog(null)}
                variant="contained"
                sx={{
                  borderRadius: "9px",
                  textTransform: "none",
                  bgcolor: "#2563EB",
                  px: 3,
                  "&:hover": { bgcolor: "#1D4ED8" },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
          sx={{ borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography
        fontSize={11}
        color="text.secondary"
        textAlign="center"
        mt={2.5}
      >
        Audit logs are read-only records. Only authorized system processes
        should create or maintain these records.
      </Typography>
    </Box>
  );
}