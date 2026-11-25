
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import Search from "@mui/icons-material/Search";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import CheckCircle from "@mui/icons-material/CheckCircle";
import PendingActions from "@mui/icons-material/PendingActions";
import ReceiptLong from "@mui/icons-material/ReceiptLong";

import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";

const initialPayroll = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    department: "IT",
    position: "Software Developer",
    basicSalary: 12000,
    overtime: 1500,
    bonus: 1000,
    deductions: 500,
    netSalary: 14000,
    status: "Paid",
  },
  {
    id: 2,
    name: "Sara Hassan",
    department: "Finance",
    position: "Accountant",
    basicSalary: 10000,
    overtime: 800,
    bonus: 500,
    deductions: 300,
    netSalary: 11000,
    status: "Pending",
  },
  {
    id: 3,
    name: "Omar Ali",
    department: "HR",
    position: "HR Specialist",
    basicSalary: 9000,
    overtime: 0,
    bonus: 0,
    deductions: 400,
    netSalary: 8600,
    status: "Paid",
  },
  {
    id: 4,
    name: "Mahmoud Samir",
    department: "Sales",
    position: "Sales Representative",
    basicSalary: 8500,
    overtime: 1200,
    bonus: 2000,
    deductions: 600,
    netSalary: 11100,
    status: "Pending",
  },
  {
    id: 5,
    name: "Mariam Adel",
    department: "Marketing",
    position: "Marketing Specialist",
    basicSalary: 9500,
    overtime: 500,
    bonus: 700,
    deductions: 200,
    netSalary: 10500,
    status: "Paid",
  },
  {
    id: 6,
    name: "Youssef Ibrahim",
    department: "IT",
    position: "UI/UX Designer",
    basicSalary: 11000,
    overtime: 1000,
    bonus: 500,
    deductions: 300,
    netSalary: 12200,
    status: "Pending",
  },
  {
    id: 7,
    name: "Nour Tarek",
    department: "Operations",
    position: "Operations Officer",
    basicSalary: 8000,
    overtime: 600,
    bonus: 0,
    deductions: 250,
    netSalary: 8350,
    status: "Paid",
  },
];

const statusColors = {
  Paid: "success",
  Pending: "warning",
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-EG").format(amount) + " EGP";

export default function HRPayroll() {
  const [payroll, setPayroll] = useState(initialPayroll);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const stats = useMemo(() => {
    const totalSalary = payroll.reduce(
      (sum, item) => sum + item.netSalary,
      0
    );

    const paid = payroll.filter((item) => item.status === "Paid");
    const pending = payroll.filter((item) => item.status === "Pending");

    const totalPaid = paid.reduce(
      (sum, item) => sum + item.netSalary,
      0
    );

    const totalPending = pending.reduce(
      (sum, item) => sum + item.netSalary,
      0
    );

    const totalDeductions = payroll.reduce(
      (sum, item) => sum + item.deductions,
      0
    );

    return {
      totalSalary,
      paidCount: paid.length,
      pendingCount: pending.length,
      totalPaid,
      totalPending,
      totalDeductions,
    };
  }, [payroll]);

  const filteredPayroll = payroll.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All" ||
      item.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const markAsPaid = (id) => {
    setPayroll((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Paid" } : item
      )
    );
  };

  const cards = [
    {
      title: "Total Payroll",
      value: formatMoney(stats.totalSalary),
      icon: <AccountBalanceWallet />,
      color: "#2563EB",
    },
    {
      title: "Paid Employees",
      value: stats.paidCount,
      icon: <CheckCircle />,
      color: "#16A34A",
    },
    {
      title: "Pending Payments",
      value: stats.pendingCount,
      icon: <PendingActions />,
      color: "#D97706",
    },
    {
      title: "Total Deductions",
      value: formatMoney(stats.totalDeductions),
      icon: <ReceiptLong />,
      color: "#DC2626",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Payroll"
        subtitle="Manage employee salaries and payroll processing"
      />

      {/* Statistics */}
      <Grid container spacing={2} mb={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>

                    <Typography variant="h5" fontWeight={700} mt={1}>
                      {card.value}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: `${card.color}18`,
                      color: card.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Paid
              </Typography>

              <Typography variant="h5" fontWeight={700} color="success.main" mt={1}>
                {formatMoney(stats.totalPaid)}
              </Typography>

              <Typography variant="body2" mt={1}>
                {stats.paidCount} employees paid
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Remaining Payments
              </Typography>

              <Typography variant="h5" fontWeight={700} color="warning.main" mt={1}>
                {formatMoney(stats.totalPending)}
              </Typography>

              <Typography variant="body2" mt={1}>
                {stats.pendingCount} employees awaiting payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search employee or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="All">All Departments</MenuItem>

                {[...new Set(payroll.map((item) => item.department))].map(
                  (department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Payment Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          p={2.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Salary Records
          </Typography>

          <Chip
            label={`${filteredPayroll.length} Employees`}
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Overtime</TableCell>
                <TableCell>Bonus</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPayroll.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: "#2563EB",
                          fontSize: 12,
                        }}
                      >
                        {employee.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {employee.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {employee.position}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{formatMoney(employee.basicSalary)}</TableCell>
                  <TableCell>{formatMoney(employee.overtime)}</TableCell>
                  <TableCell>{formatMoney(employee.bonus)}</TableCell>
                  <TableCell>
                    <Typography color="error.main">
                      {formatMoney(employee.deductions)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={700}>
                      {formatMoney(employee.netSalary)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={statusColors[employee.status]}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        Details
                      </Button>

                      {employee.status === "Pending" && (
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => markAsPaid(employee.id)}
                        >
                          Pay
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {filteredPayroll.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    No payroll records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Salary Details Dialog */}
      <Dialog
        open={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedEmployee && (
          <>
            <DialogTitle>
              Salary Details
            </DialogTitle>

            <DialogContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ width: 52, height: 52, bgcolor: "#2563EB" }}>
                  {selectedEmployee.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {selectedEmployee.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {selectedEmployee.position} • {selectedEmployee.department}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {[
                ["Basic Salary", selectedEmployee.basicSalary],
                ["Overtime", selectedEmployee.overtime],
                ["Bonus", selectedEmployee.bonus],
                ["Deductions", -selectedEmployee.deductions],
              ].map(([label, amount]) => (
                <Box
                  key={label}
                  display="flex"
                  justifyContent="space-between"
                  py={1.2}
                >
                  <Typography>{label}</Typography>

                  <Typography
                    fontWeight={600}
                    color={amount < 0 ? "error.main" : "text.primary"}
                  >
                    {formatMoney(amount)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Net Salary</Typography>

                <Typography fontWeight={700} color="success.main">
                  {formatMoney(selectedEmployee.netSalary)}
                </Typography>
              </Box>

              <Box mt={2}>
                <Chip
                  label={selectedEmployee.status}
                  color={statusColors[selectedEmployee.status]}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedEmployee(null)}>
                Close
              </Button>

              {selectedEmployee.status === "Pending" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    markAsPaid(selectedEmployee.id);
                    setSelectedEmployee(null);
                  }}
                >
                  Mark as Paid
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
