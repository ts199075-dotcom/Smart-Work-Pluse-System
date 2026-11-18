import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  MenuItem,
  TextField,
  Divider,
  Stack,
} from "@mui/material";

import {
  DownloadRounded,
  CalendarMonthRounded,
  AccountBalanceWalletRounded,
} from "@mui/icons-material";

// Sample payslip data
const payslipData = {
  "2026-09": {
    month: "September 2026",
    paidOn: "30 Sep 2026",
    status: "Paid",
    baseSalary: 13000,
    overtime: 1250,
    rewards: 200,
    deductions: 200,
    netSalary: 14250,
    overtimeHours: "6h 30m",
    overtimeDetails: [
      {
        date: "20 Sep",
        project: "Mobile Check-in",
        duration: "3h 00m",
        amount: 620,
      },
      {
        date: "16 Sep",
        project: "HR Portal Revamp",
        duration: "1h 30m",
        amount: 310,
      },
      {
        date: "09 Sep",
        project: "Finance Automation",
        duration: "2h 00m",
        amount: 320,
      },
    ],
  },

  "2026-08": {
    month: "August 2026",
    paidOn: "31 Aug 2026",
    status: "Paid",
    baseSalary: 13000,
    overtime: 950,
    rewards: 150,
    deductions: 200,
    netSalary: 13900,
    overtimeHours: "5h 00m",
    overtimeDetails: [
      {
        date: "22 Aug",
        project: "Mobile Check-in",
        duration: "2h 00m",
        amount: 400,
      },
      {
        date: "18 Aug",
        project: "HR Portal Revamp",
        duration: "3h 00m",
        amount: 550,
      },
    ],
  },

  "2026-07": {
    month: "July 2026",
    paidOn: "31 Jul 2026",
    status: "Paid",
    baseSalary: 13000,
    overtime: 600,
    rewards: 100,
    deductions: 250,
    netSalary: 13450,
    overtimeHours: "3h 00m",
    overtimeDetails: [
      {
        date: "19 Jul",
        project: "Finance Automation",
        duration: "3h 00m",
        amount: 600,
      },
    ],
  },
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-US").format(amount);

function DetailRow({ label, value, color = "text.primary", bold = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        py: 1.2,
        width: "100%",
      }}
    >
      <Typography fontSize={13} color="text.secondary">
        {label}
      </Typography>

      <Typography
        fontSize={13}
        fontWeight={bold ? 700 : 500}
        color={color}
        textAlign="right"
        sx={{ whiteSpace: "nowrap" }}
      >
        {value}
      </Typography>
    </Box>
  );
}
function MemberPayslip() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const payslip = payslipData[selectedMonth];

  const handleDownload = () => {
    window.print();
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* Page Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h3" mb={0.5}>
            My Payslip
          </Typography>

          <Typography fontSize={13} color="text.secondary">
            Review your salary details and payment history.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            select
            size="small"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            sx={{
              minWidth: 170,
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
            }}
            InputProps={{
              startAdornment: (
                <CalendarMonthRounded
                  sx={{ color: "#64748B", mr: 1, fontSize: 19 }}
                />
              ),
            }}
          >
            {Object.entries(payslipData).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value.month}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<DownloadRounded />}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </Stack>
      </Box>

      {/* Payslip Information */}
      <Box mb={2.5}>
        <Typography variant="h5" mb={0.5}>
          Payslip · {payslip.month}
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          Sara Ahmed · Paid on {payslip.paidOn}
        </Typography>
      </Box>

      {/* Net Salary Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          borderRadius: "14px",
          backgroundColor: "#17365D",
          color: "#FFFFFF",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              fontSize={13}
              color="rgba(255,255,255,0.75)"
              mb={1}
            >
              Net salary
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 27, sm: 34 },
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              EGP {formatMoney(payslip.netSalary)}
            </Typography>
          </Box>

          <Chip
            label={payslip.status}
            sx={{
              backgroundColor: "#DCFCE7",
              color: "#15803D",
              fontWeight: 700,
              px: 1,
            }}
          />
        </Box>
      </Paper>

      {/* Salary Breakdown */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* Earnings and Deductions */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AccountBalanceWalletRounded
              sx={{ color: "primary.main" }}
            />

            <Typography variant="h5">
              Earnings & Deductions
            </Typography>
          </Box>

          <Typography
            fontSize={12}
            fontWeight={700}
            color="text.secondary"
            mb={0.5}
          >
            EARNINGS
          </Typography>

          <DetailRow
            label="Base salary"
            value={formatMoney(payslip.baseSalary)}
          />

          <DetailRow
            label={`Approved overtime · ${payslip.overtimeHours}`}
            value={`+${formatMoney(payslip.overtime)}`}
            color="success.main"
          />

          <DetailRow
            label="Rewards used"
            value={`+${formatMoney(payslip.rewards)}`}
            color="success.main"
          />

          <Divider sx={{ my: 2 }} />

          <Typography
            fontSize={12}
            fontWeight={700}
            color="text.secondary"
            mb={0.5}
          >
            DEDUCTIONS
          </Typography>

          <DetailRow
            label="Blue card fine"
            value={`−${formatMoney(payslip.deductions)}`}
            color="error.main"
          />

          <Divider sx={{ my: 2 }} />

          <DetailRow
            label="Net salary"
            value={`EGP ${formatMoney(payslip.netSalary)}`}
            bold
          />
        </Paper>

        {/* How It Adds Up */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
          }}
        >
          <Typography variant="h5" mb={2}>
            How it adds up
          </Typography>

          {/* Salary Composition */}
          <Box display="flex" height={12} borderRadius={10} overflow="hidden">
            <Box
              sx={{
                width: `${
                  (payslip.baseSalary /
                    (payslip.baseSalary + payslip.overtime + payslip.rewards)) *
                  100
                }%`,
                backgroundColor: "#17365D",
              }}
            />

            <Box
              sx={{
                width: `${
                  (payslip.overtime /
                    (payslip.baseSalary + payslip.overtime + payslip.rewards)) *
                  100
                }%`,
                backgroundColor: "#2563EB",
              }}
            />

            <Box
              sx={{
                flex: 1,
                backgroundColor: "#16A34A",
              }}
            />
          </Box>

          {/* Legend */}
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            mt={1.5}
            mb={3}
          >
            {[
              { label: "Base", color: "#17365D" },
              { label: "Overtime", color: "#2563EB" },
              { label: "Rewards", color: "#16A34A" },
            ].map((item) => (
              <Box
                key={item.label}
                display="flex"
                alignItems="center"
                gap={0.7}
              >
                <Box
                  width={8}
                  height={8}
                  borderRadius="50%"
                  bgcolor={item.color}
                />

                <Typography fontSize={11} color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Typography fontSize={13} fontWeight={600} mb={1.5}>
            Included overtime
          </Typography>

          {payslip.overtimeDetails.map((item) => (
            <Box
                key={`${item.date}-${item.project}`}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    width: "100%",
                }}
                >
                <Box sx={{ minWidth: 0 }}>
                    <Typography fontSize={12} fontWeight={600}>
                    {item.date} · {item.project}
                    </Typography>

                    <Typography fontSize={11} color="text.secondary" mt={0.5}>
                    {item.duration}
                    </Typography>
                </Box>

                <Typography
                    fontSize={12}
                    fontWeight={600}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    EGP {formatMoney(item.amount)}
                </Typography>
                </Box>
          ))}

          <Typography
            fontSize={11}
            color="text.secondary"
            mt={2}
            lineHeight={1.7}
          >
            You only see your own payslip. Questions about a line? Contact
            the payroll team.
          </Typography>
        </Paper>
      </Box>

      {/* Demo Notice */}
      <Box
        mt={2.5}
        p={2}
        borderRadius="10px"
        bgcolor="#EFF6FF"
      >
        <Typography fontSize={11} color="#1D4ED8">
          This is illustrative payslip data. Actual salary details depend
          on approved payroll records.
        </Typography>
      </Box>

      {/* Print Styles */}
      <Box
        sx={{
          "@media print": {
            "& .MuiButton-root": {
              display: "none",
            },
            "& .MuiPaper-root": {
              breakInside: "avoid",
              boxShadow: "none",
            },
          },
        }}
      />
    </Box>
  );
}

export default MemberPayslip;