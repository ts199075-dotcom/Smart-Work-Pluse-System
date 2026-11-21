
import { useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import Add from "@mui/icons-material/Add";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import Gavel from "@mui/icons-material/Gavel";
import Payments from "@mui/icons-material/Payments";
import Visibility from "@mui/icons-material/Visibility";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";

const initialRecords = [
  {
    id: 1,
    employee: "Ahmed Mohamed",
    department: "IT",
    type: "Reward",
    amount: 1500,
    reason: "Outstanding performance",
    date: "2026-11-15",
    addedBy: "HR Admin",
  },
  {
    id: 2,
    employee: "Sara Ali",
    department: "HR",
    type: "Fine",
    amount: 300,
    reason: "Repeated lateness",
    date: "2026-11-12",
    addedBy: "HR Admin",
  },
  {
    id: 3,
    employee: "Omar Hassan",
    department: "Finance",
    type: "Reward",
    amount: 2000,
    reason: "Completed project successfully",
    date: "2026-11-10",
    addedBy: "HR Admin",
  },
  {
    id: 4,
    employee: "Mariam Samir",
    department: "Marketing",
    type: "Fine",
    amount: 500,
    reason: "Violation of company policy",
    date: "2026-11-09",
    addedBy: "HR Admin",
  },
  {
    id: 5,
    employee: "Youssef Adel",
    department: "IT",
    type: "Reward",
    amount: 1000,
    reason: "Helping team members",
    date: "2026-11-08",
    addedBy: "HR Admin",
  },
  {
    id: 6,
    employee: "Nour Tarek",
    department: "Sales",
    type: "Fine",
    amount: 200,
    reason: "Absence without permission",
    date: "2026-11-07",
    addedBy: "HR Admin",
  },
];

const departments = [
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
];

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={700} mt={1}>
              {value.toLocaleString("en-US")} EGP
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: `${color}15`,
              color,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

const emptyForm = {
  employee: "",
  department: "",
  type: "Reward",
  amount: "",
  reason: "",
  date: new Date().toISOString().split("T")[0],
};

export default function HRFinesRewards() {
  const [records, setRecords] = useState(initialRecords);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const totalRewards = records
    .filter((record) => record.type === "Reward")
    .reduce((sum, record) => sum + record.amount, 0);

  const totalFines = records
    .filter((record) => record.type === "Fine")
    .reduce((sum, record) => sum + record.amount, 0);

  const rewardsCount = records.filter(
    (record) => record.type === "Reward"
  ).length;

  const finesCount = records.filter(
    (record) => record.type === "Fine"
  ).length;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.employee.toLowerCase().includes(search.toLowerCase()) ||
        record.department.toLowerCase().includes(search.toLowerCase()) ||
        record.reason.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" ||
        record.department === departmentFilter;

      const matchesType =
        typeFilter === "All" || record.type === typeFilter;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [records, search, departmentFilter, typeFilter]);

  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleAddRecord = () => {
    if (
      !form.employee.trim() ||
      !form.department ||
      !form.amount ||
      Number(form.amount) <= 0 ||
      !form.reason.trim() ||
      !form.date
    ) {
      return;
    }

    const newRecord = {
      id: Date.now(),
      employee: form.employee.trim(),
      department: form.department,
      type: form.type,
      amount: Number(form.amount),
      reason: form.reason.trim(),
      date: form.date,
      addedBy: "HR Admin",
    };

    setRecords((previous) => [newRecord, ...previous]);

    setForm(emptyForm);
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    setRecords((previous) =>
      previous.filter((record) => record.id !== id)
    );

    setSelectedRecord(null);
  };

  const getTypeChip = (type) => (
    <Chip
      label={type}
      color={type === "Reward" ? "success" : "error"}
      size="small"
      sx={{ minWidth: 85, fontWeight: 600 }}
    />
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Fines & Rewards
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage employee rewards and disciplinary fines
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setForm(emptyForm);
            setOpenDialog(true);
          }}
        >
          Add Record
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rewards"
            value={totalRewards}
            icon={<EmojiEvents />}
            color="#10b981"
            subtitle={`${rewardsCount} reward records`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Fines"
            value={totalFines}
            icon={<Gavel />}
            color="#ef4444"
            subtitle={`${finesCount} fine records`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net Amount"
            value={totalRewards - totalFines}
            icon={<Payments />}
            color="#6366f1"
            subtitle="Rewards minus fines"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Records"
            value={records.length}
            icon={<Payments />}
            color="#f59e0b"
            subtitle="All transactions"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="All">All Departments</MenuItem>

                {departments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3.5}>
              <TextField
                select
                fullWidth
                size="small"
                label="Record Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Reward">Rewards</MenuItem>
                <MenuItem value="Fine">Fines</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box p={2}>
          <Typography variant="h6" fontWeight={700}>
            Transactions
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {filteredRecords.length} records found
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Added By</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {record.employee}
                      </Typography>
                    </TableCell>

                    <TableCell>{record.department}</TableCell>

                    <TableCell>
                      {getTypeChip(record.type)}
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight={700}
                        color={
                          record.type === "Reward"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {record.type === "Reward" ? "+" : "-"}
                        {record.amount.toLocaleString("en-US")} EGP
                      </Typography>
                    </TableCell>

                    <TableCell>{record.reason}</TableCell>

                    <TableCell>{record.date}</TableCell>

                    <TableCell>{record.addedBy}</TableCell>

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={0.5}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          title="View Details"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          title="Delete Record"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Record Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Add Fine / Reward

            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              fullWidth
              label="Employee Name"
              value={form.employee}
              onChange={(e) =>
                handleFormChange("employee", e.target.value)
              }
              placeholder="Enter employee name"
            />

            <TextField
              select
              fullWidth
              label="Department"
              value={form.department}
              onChange={(e) =>
                handleFormChange("department", e.target.value)
              }
            >
              {departments.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Record Type"
              value={form.type}
              onChange={(e) =>
                handleFormChange("type", e.target.value)
              }
            >
              <MenuItem value="Reward">Reward</MenuItem>
              <MenuItem value="Fine">Fine</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) =>
                handleFormChange("amount", e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    EGP
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) =>
                handleFormChange("date", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={form.reason}
              onChange={(e) =>
                handleFormChange("reason", e.target.value)
              }
              placeholder="Enter the reason for this record..."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddRecord}
            disabled={
              !form.employee.trim() ||
              !form.department ||
              !form.amount ||
              Number(form.amount) <= 0 ||
              !form.reason.trim() ||
              !form.date
            }
          >
            Save Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedRecord && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                Transaction Details

                <IconButton onClick={() => setSelectedRecord(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedRecord.employee}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedRecord.department}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  {getTypeChip(selectedRecord.type)}
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={
                      selectedRecord.type === "Reward"
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {selectedRecord.type === "Reward" ? "+" : "-"}
                    {selectedRecord.amount.toLocaleString("en-US")} EGP
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography>
                    {selectedRecord.reason}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedRecord.date}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Added By
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedRecord.addedBy}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDelete(selectedRecord.id)}
              >
                Delete Record
              </Button>

              <Button onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
