import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";

import {
  AccessTimeRounded,
  CheckCircleRounded,
  PendingActionsRounded,
  CancelRounded,
  AddRounded,
} from "@mui/icons-material";

// Sample overtime history
const initialRequests = [
  {
    id: 1,
    date: "24 Oct",
    project: "HR Portal Revamp",
    duration: "2h 30m",
    amount: "EGP 312",
    status: "Pending",
  },
  {
    id: 2,
    date: "20 Oct",
    project: "Mobile Check-in",
    duration: "3h 00m",
    amount: "EGP 620",
    status: "Approved",
  },
  {
    id: 3,
    date: "16 Oct",
    project: "HR Portal Revamp",
    duration: "1h 30m",
    amount: "EGP 310",
    status: "Approved",
  },
  {
    id: 4,
    date: "09 Oct",
    project: "Finance Automation",
    duration: "2h 00m",
    amount: "EGP 320",
    status: "Approved",
  },
  {
    id: 5,
    date: "05 Oct",
    project: "HR Portal Revamp",
    duration: "1h 00m",
    amount: "—",
    status: "Rejected",
  },
];

// Summary cards
const summaryCards = [
  {
    title: "Approved This Month",
    value: "6h 30m",
    description: "EGP 1,250 added to payroll",
    icon: CheckCircleRounded,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Pending Review",
    value: "2h 30m",
    description: "1 request awaiting approval",
    icon: PendingActionsRounded,
    color: "#D97706",
    background: "#FEF3C7",
  },
  {
    title: "Rejected",
    value: "1h 00m",
    description: "Not paid",
    icon: CancelRounded,
    color: "#DC2626",
    background: "#FEE2E2",
  },
];

const statusStyles = {
  Approved: {
    background: "#DCFCE7",
    color: "#15803D",
  },
  Pending: {
    background: "#FEF3C7",
    color: "#B45309",
  },
  Rejected: {
    background: "#FEE2E2",
    color: "#B91C1C",
  },
};

const projects = [
  "HR Portal Revamp",
  "Mobile Check-in",
  "Finance Automation",
  "People Ops",
];

function getDuration(start, end) {
  if (!start || !end) return 0;

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  if (endTotal <= startTotal) return 0;

  return endTotal - startTotal;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function SectionTitle({ title, subtitle }) {
  return (
    <Box mb={2.5}>
      <Typography variant="h5" mb={0.5}>
        {title}
      </Typography>

      {subtitle && (
        <Typography fontSize={12} color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function MemberOvertime() {
  const [requests, setRequests] = useState(initialRequests);

  const [formData, setFormData] = useState({
    project: "",
    date: "",
    startTime: "18:00",
    endTime: "20:30",
    isHoliday: false,
    reason: "",
  });

  const [message, setMessage] = useState("");

  const durationMinutes = getDuration(
    formData.startTime,
    formData.endTime
  );

  const duration = formatDuration(durationMinutes);

  // Illustrative estimate: EGP 125 per hour
  const estimatedAmount = Math.round(
    (durationMinutes / 60) * 125
  );

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.project ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.reason.trim()
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (durationMinutes <= 0) {
      setMessage("End time must be later than start time.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      date: new Date(`${formData.date}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      project: formData.project,
      duration,
      amount: "Pending",
      status: "Pending",
    };

    setRequests((previous) => [newRequest, ...previous]);

    setFormData({
      project: "",
      date: "",
      startTime: "18:00",
      endTime: "20:30",
      isHoliday: false,
      reason: "",
    });

    setMessage("Your overtime request has been submitted successfully.");
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
            My Overtime
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Submit extra hours for approval. Only approved hours are paid.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() =>
            document
              .getElementById("overtime-request-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          New Request
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    backgroundColor: card.background,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </Box>

                <Box minWidth={0}>
                  <Typography fontSize={12} color="text.secondary">
                    {card.title}
                  </Typography>

                  <Typography variant="h4" mt={0.3}>
                    {card.value}
                  </Typography>
                </Box>
              </Box>

              <Typography
                fontSize={11}
                color="text.secondary"
                mt={2}
              >
                {card.description}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Request Form and History */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(300px, 0.9fr) minmax(0, 1.5fr)",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* New Request Form */}
        <Paper
          id="overtime-request-form"
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
            minWidth: 0,
          }}
        >
          <SectionTitle
            title="New Overtime Request"
            subtitle="Provide the details of your extra working hours."
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              select
              fullWidth
              size="small"
              label="Charged to project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            >
              {projects.map((project) => (
                <MenuItem key={project} value={project}>
                  {project}
                </MenuItem>
              ))}
            </TextField>

           <Box>
            
            <Typography
                fontSize={12}
                fontWeight={600}
                color="text.secondary"
                mb={0.75}
            >
                Date
            </Typography>

            <TextField
                fullWidth
                size="small"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
                },
                "& input": {
                    fontSize: "13px",
                    padding: "10px 12px",
                },
                }}
            />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              <TextField
                fullWidth
                size="small"
                type="time"
                label="Start time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                fullWidth
                size="small"
                type="time"
                label="End time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  name="isHoliday"
                  checked={formData.isHoliday}
                  onChange={handleChange}
                  size="small"
                />
              }
              label={
                <Typography fontSize={13}>
                  This was on an official holiday
                </Typography>
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={3}
              size="small"
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe the extra work completed..."
              required
            />

            <Divider />

            {/* Duration and Estimate */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1.5,
              }}
            >
              <Box>
                <Typography fontSize={11} color="text.secondary" mb={0.5}>
                  Duration
                </Typography>

                <Typography fontSize={20} fontWeight={700}>
                  {duration}
                </Typography>
              </Box>

              <Box>
                <Typography fontSize={11} color="text.secondary" mb={0.5}>
                  Estimated if approved
                </Typography>

                <Typography fontSize={20} fontWeight={700} color="success.main">
                  EGP {estimatedAmount}
                </Typography>
              </Box>
            </Box>

            <Typography fontSize={11} color="text.secondary">
              The estimate is illustrative and uses a sample overtime rate.
              Actual payment depends on company rules and approval.
            </Typography>

            {message && (
              <Alert
                severity={
                  message.startsWith("Your") ? "success" : "warning"
                }
              >
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Submit for Approval
            </Button>
          </Box>
        </Paper>

        {/* Overtime History */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
            minWidth: 0,
          }}
        >
          <SectionTitle
            title="Overtime History"
            subtitle="Review your previous overtime requests and their status."
          />

          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 590 }}>
              {/* Table Header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "0.8fr 1.5fr 0.9fr 1fr 0.9fr",
                  gap: 1,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {["DATE", "PROJECT", "DURATION", "AMOUNT", "STATUS"].map(
                  (heading) => (
                    <Typography
                      key={heading}
                      fontSize={10}
                      fontWeight={700}
                      color="text.secondary"
                    >
                      {heading}
                    </Typography>
                  )
                )}
              </Box>

              {/* Table Rows */}
              {requests.map((request) => (
                <Box
                  key={request.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "0.8fr 1.5fr 0.9fr 1fr 0.9fr",
                    gap: 1,
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography fontSize={12}>
                    {request.date}
                  </Typography>

                  <Typography fontSize={12} fontWeight={600}>
                    {request.project}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary">
                    {request.duration}
                  </Typography>

                  <Typography fontSize={12} fontWeight={600}>
                    {request.amount}
                  </Typography>

                  <Chip
                    label={request.status}
                    size="small"
                    sx={{
                      width: "fit-content",
                      fontSize: 10,
                      fontWeight: 600,
                      backgroundColor:
                        statusStyles[request.status].background,
                      color: statusStyles[request.status].color,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={2.5}
            p={2}
            borderRadius="10px"
            bgcolor="#F5F7FB"
          >
            <AccessTimeRounded
              sx={{ fontSize: 18, color: "#64748B" }}
            />

            <Typography fontSize={11} color="text.secondary">
              Only approved overtime requests are added to your payroll.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default MemberOvertime;