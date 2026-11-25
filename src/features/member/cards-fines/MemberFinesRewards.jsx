import { useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import {
  WarningAmberRounded,
  AccountBalanceWalletRounded,
  CardGiftcardRounded,
  ReceiptLongRounded,
  CheckCircleRounded,
} from "@mui/icons-material";

import StatCard from "../../../components/common/StatCard";

const finesData = [
  {
    id: 1,
    type: "Blue card fine",
    amount: 200,
    date: "14 Oct 2026",
    due: "31 Oct 2026",
    status: "Unpaid",
    reference: "",
  },
  {
    id: 2,
    type: "Absence fine",
    amount: 100,
    date: "12 Sep 2026",
    due: "30 Sep 2026",
    status: "Paid",
    reference: "REF-2026-0412",
  },
  {
    id: 3,
    type: "Blue card fine",
    amount: 200,
    date: "14 Aug 2026",
    due: "31 Aug 2026",
    status: "Paid",
    reference: "REF-2026-0288",
  },
];

const rewardsData = [
  {
    id: "RW-0071",
    amount: 500,
    date: "02 Oct 2026",
    status: "Partly used",
  },
  {
    id: "RW-0058",
    amount: 500,
    date: "04 Jul 2026",
    status: "Claimed",
  },
  {
    id: "RW-0044",
    amount: 500,
    date: "03 Apr 2026",
    status: "Claimed",
  },
];

const statusStyles = {
  Unpaid: { color: "#B45309", background: "#FEF3C7" },
  Paid: { color: "#15803D", background: "#DCFCE7" },
  "Partly used": { color: "#1D4ED8", background: "#DBEAFE" },
  Claimed: { color: "#15803D", background: "#DCFCE7" },
};

function StatusChip({ status }) {
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 23,
        fontSize: 10,
        fontWeight: 600,
        borderRadius: 1.5,
        color: statusStyles[status].color,
        bgcolor: statusStyles[status].background,
      }}
    />
  );
}

function MemberFinesRewards() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const showMessage = (message) => {
    setSnackbar({ open: true, message });
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h3" fontWeight={700} mb={0.4}>
          Fines & Rewards
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          Everything earned or owed because of your attendance cards.
        </Typography>
      </Box>

      {/* Information Alert */}
      <Alert
        severity="success"
        icon={<CheckCircleRounded sx={{ fontSize: 17 }} />}
        sx={{
          py: 0,
          mb: 2,
          borderRadius: 1.5,
          alignItems: "center",
          "& .MuiAlert-message": {
            py: 0.8,
            fontSize: 12,
          },
          "& .MuiAlert-icon": {
            py: 0.8,
            mr: 1,
          },
        }}
      >
        No fine is blocking your check-in. You can record attendance normally.
      </Alert>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.75,
          mb: 2.5,
        }}
      >
        <StatCard
          title="Unpaid fines"
          value="EGP 200"
          subtitle="1 fine · due 31 Oct"
          icon={<WarningAmberRounded />}
          color="#D97706"
          bg="#FEF3C7"
          iconPosition="start"
          hover={false}
        />

        <StatCard
          title="Reward balance"
          value="EGP 350"
          subtitle="Available to claim in payroll"
          icon={<AccountBalanceWalletRounded />}
          color="#2563EB"
          bg="#DBEAFE"
          iconPosition="start"
          hover={false}
        />

        <Card
          elevation={0}
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            minHeight: 112,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              variant="rounded"
              sx={{
                width: 38,
                height: 38,
                bgcolor: "#DCFCE7",
                color: "#16A34A",
                borderRadius: 1.5,
              }}
            >
              <CardGiftcardRounded />
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography fontSize={12} color="text.secondary">
                Next reward
              </Typography>

              <Typography fontSize={21} fontWeight={700} lineHeight={1.35}>
                12 / 20
              </Typography>

              <LinearProgress
                variant="determinate"
                value={60}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 5,
                  bgcolor: "#E2E8F0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#16A34A",
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.15fr 0.85fr",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* Fines */}
        <Card
          elevation={0}
          sx={{
            p: 2.25,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            minWidth: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <WarningAmberRounded color="warning" fontSize="small" />
            <Typography fontSize={16} fontWeight={700}>
              Fines
            </Typography>
          </Stack>

          {/* Table Header */}
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: "1.4fr 0.8fr 1fr 0.8fr 0.8fr",
              gap: 1,
              pb: 1.25,
            }}
          >
            {["TYPE", "AMOUNT", "DUE", "STATUS", "ACTION"].map((item) => (
              <Typography
                key={item}
                fontSize={10}
                fontWeight={700}
                color="text.secondary"
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Divider />

          {finesData.map((fine) => (
            <Box
              key={fine.id}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "1.4fr 0.8fr 1fr 0.8fr 0.8fr",
                },
                gap: 1,
                alignItems: "center",
                py: 1.5,
              }}
            >
              <Box>
                <Typography fontSize={12} fontWeight={600}>
                  {fine.type}
                </Typography>

                <Typography fontSize={10} color="text.secondary" mt={0.4}>
                  {fine.reference || `Issued ${fine.date}`}
                </Typography>
              </Box>

              <Typography fontSize={12} fontWeight={600}>
                EGP {fine.amount}
              </Typography>

              <Typography fontSize={11}>
                {fine.due}
              </Typography>

              <Box>
                <StatusChip status={fine.status} />
              </Box>

              <Box>
                {fine.status === "Unpaid" ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      showMessage("Payment integration will be available soon.")
                    }
                    sx={{
                      minWidth: 0,
                      px: 1.2,
                      py: 0.45,
                      fontSize: 10,
                      borderRadius: 1.5,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Pay now
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<ReceiptLongRounded sx={{ fontSize: 14 }} />}
                    onClick={() =>
                      showMessage(`Receipt: ${fine.reference}`)
                    }
                    sx={{
                      minWidth: 0,
                      px: 0.5,
                      fontSize: 10,
                      textTransform: "none",
                    }}
                  >
                    Receipt
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Card>

        {/* Rewards */}
        <Card
          elevation={0}
          sx={{
            p: 2.25,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            minWidth: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <CardGiftcardRounded color="primary" fontSize="small" />
            <Typography fontSize={16} fontWeight={700}>
              Rewards
            </Typography>
          </Stack>

          {rewardsData.map((reward, index) => (
            <Box key={reward.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                py={1.5}
              >
                <Box minWidth={0}>
                  <Typography fontSize={12} fontWeight={600}>
                    Payout {reward.id}
                  </Typography>

                  <Typography fontSize={10} color="text.secondary" mt={0.4}>
                    Earned {reward.date}
                  </Typography>

                  <Box mt={0.8}>
                    <StatusChip status={reward.status} />
                  </Box>
                </Box>

                <Typography
                  fontSize={12}
                  fontWeight={700}
                  whiteSpace="nowrap"
                >
                  EGP {reward.amount}
                </Typography>
              </Stack>

              {index !== rewardsData.length - 1 && <Divider />}
            </Box>
          ))}
        </Card>
      </Box>

      {/* Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}

export default MemberFinesRewards;