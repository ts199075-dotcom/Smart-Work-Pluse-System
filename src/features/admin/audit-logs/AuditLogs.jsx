import { useEffect, useMemo, useState } from "react";

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

import { getAuditLogs } from "../../../utils/auditLogger";

// Action Configuration
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

// Statistics Card
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
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

// Action Badge
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
        "& .MuiChip-icon": {
          color: config.text,
        },
      }}
    />
  );
};

// Get User Initials
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// User Avatar
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

// Details Row
const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "130px 1fr",
      },
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
  // Audit Logs State
  const [logs, setLogs] = useState(getAuditLogs);

  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");

  // Selected Log
  const [selectedLog, setSelectedLog] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Listen for New Audit Logs
  useEffect(() => {
    const updateLogs = () => {
      setLogs(getAuditLogs());
    };

    window.addEventListener("auditLogsUpdated", updateLogs);

    return () => {
      window.removeEventListener("auditLogsUpdated", updateLogs);
    };
  }, []);

  // Filter Logs
  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const searchableValues = [
        log.user,
        log.email,
        log.description,
        log.target,
        log.module,
      ];

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearch)
        );

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

  // Pagination
  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Statistics
  const stats = useMemo(
    () => ({
      total: logs.length,
      create: logs.filter((log) => log.action === "Create").length,
      update: logs.filter((log) => log.action === "Update").length,
      delete: logs.filter((log) => log.action === "Delete").length,
    }),
    [logs]
  );

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setActionFilter("All");
    setRoleFilter("All");
    setModuleFilter("All");
    setPage(0);
  };

  // Export CSV
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
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\n");

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

  // Close Snackbar
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "none",
        boxSizing: "border-box",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        bgcolor: "#F5F7FB",
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#17365D"
            sx={{
              fontSize: {
                xs: 25,
                md: 30,
              },
            }}
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
            "&:hover": {
              bgcolor: "#1D4ED8",
            },
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
        {/* Table Header */}
        <Box
          sx={{
            p: {
              xs: 2,
              md: 2.5,
            },
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
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
            p: {
              xs: 2,
              md: 2.5,
            },
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
          {/* Search */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Action Filter */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          >
            <MenuItem value="All">All Actions</MenuItem>
            <MenuItem value="Create">Create</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="Delete">Delete</MenuItem>
            <MenuItem value="Login">Login</MenuItem>
          </TextField>

          {/* Role Filter */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          >
            <MenuItem value="All">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Team Leader">Team Leader</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </TextField>

          {/* Module Filter */}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          >
            <MenuItem value="All">All Modules</MenuItem>

            {[
              ...new Set(
                logs
                  .map((log) => log.module)
                  .filter(Boolean)
              ),
            ].map((module) => (
              <MenuItem key={module} value={module}>
                {module}
              </MenuItem>
            ))}
          </TextField>

          {/* Reset Filters */}
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
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {/* User */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <UserAvatar name={log.user} />

                      <Box>
                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color="#17365D"
                          whiteSpace="nowrap"
                        >
                          {log.user || "Unknown User"}
                        </Typography>

                        <Typography fontSize={11} color="text.secondary">
                          {log.role || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>

                  {/* Module */}
                  <TableCell>
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      color="#475569"
                      whiteSpace="nowrap"
                    >
                      {log.module || "—"}
                    </Typography>
                  </TableCell>

                  {/* Description */}
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
                      {log.description || "—"}
                    </Typography>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell>
                    <Typography
                      fontSize={12}
                      color="#17365D"
                      fontWeight={600}
                    >
                      {log.date || "—"}
                    </Typography>

                    <Typography fontSize={11} color="text.secondary">
                      {log.time || "—"}
                    </Typography>
                  </TableCell>

                  {/* Details */}
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedLog(log)}
                        sx={{
                          color: "#2563EB",
                          bgcolor: "#EFF6FF",
                          "&:hover": {
                            bgcolor: "#DBEAFE",
                          },
                        }}
                      >
                        <VisibilityRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty State */}
              {paginatedLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box py={6} textAlign="center">
                      <HistoryRounded
                        sx={{
                          fontSize: 42,
                          color: "#CBD5E1",
                          mb: 1,
                        }}
                      />

                      <Typography fontWeight={600} color="#475569">
                        No activities found
                      </Typography>

                      <Typography
                        fontSize={12}
                        color="text.secondary"
                        mt={0.5}
                      >
                        {logs.length === 0
                          ? "No activities have been recorded yet."
                          : "Try changing your search or filters."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        {/* Pagination */}
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
              px: {
                xs: 1,
                sm: 2,
              },
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
          sx: {
            borderRadius: "16px",
          },
        }}
      >
        {selectedLog && (
          <>
            <DialogTitle sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    fontWeight={700}
                    color="#17365D"
                    fontSize={19}
                  >
                    Activity Details
                  </Typography>

                  <Typography
                    color="text.secondary"
                    fontSize={12}
                    mt={0.5}
                  >
                    Audit record #{selectedLog.id}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setSelectedLog(null)}
                  size="small"
                >
                  <CloseRounded />
                </IconButton>
              </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 2.5 }}>
              {/* User Information */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mb={2}
              >
                <UserAvatar name={selectedLog.user} />

                <Box>
                  <Typography
                    fontWeight={700}
                    color="#17365D"
                    fontSize={14}
                  >
                    {selectedLog.user || "Unknown User"}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary">
                    {selectedLog.email || "—"}
                  </Typography>
                </Box>
              </Stack>

              {/* Action & Role */}
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
                  label={selectedLog.role || "Unknown Role"}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <Divider />

              <DetailRow
                label="Module"
                value={selectedLog.module}
              />

              <Divider />

              <DetailRow
                label="Target"
                value={selectedLog.target}
              />

              <Divider />

              <DetailRow
                label="Description"
                value={selectedLog.description}
              />

              <Divider />

              <DetailRow
                label="Date"
                value={selectedLog.date}
              />

              <Divider />

              <DetailRow
                label="Time"
                value={selectedLog.time}
              />
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
                  "&:hover": {
                    bgcolor: "#1D4ED8",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleCloseSnackbar}
          sx={{
            borderRadius: "10px",
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Footer */}
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