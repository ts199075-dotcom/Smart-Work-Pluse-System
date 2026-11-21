import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  BusinessRounded,
  ScheduleRounded,
  AccessTimeRounded,
  NotificationsActiveRounded,
  SaveRounded,
  RestartAltRounded,
} from "@mui/icons-material";

const initialSettings = {
  companyName: "Smart WorkSpace",
  companyEmail: "info@smartworkspace.com",
  companyPhone: "+20 100 000 0000",
  website: "www.smartworkspace.com",
  timezone: "Africa/Cairo",
  currency: "EGP",

  workDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  startTime: "09:00",
  endTime: "17:00",

  gracePeriod: 15,
  overtimeRequiresApproval: true,
  trackAttendance: true,

  emailNotifications: true,
  attendanceAlerts: true,
  systemAnnouncements: true,
};

const weekDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const SectionHeader = ({ icon, title, description }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "12px",
        bgcolor: "#EFF4FF",
        color: "#2563EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography fontWeight={700} fontSize={17} color="#17365D">
        {title}
      </Typography>

      <Typography fontSize={13} color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Stack>
);

const SectionCard = ({ children }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid #E8EDF5",
      borderRadius: "14px",
      height: "100%",
    }}
  >
    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
      {children}
    </CardContent>
  </Card>
);

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
  },
};

export default function CompanySettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkDayChange = (day) => {
    setSettings((prev) => {
      const selected = prev.workDays.includes(day);

      return {
        ...prev,
        workDays: selected
          ? prev.workDays.filter((item) => item !== day)
          : [...prev.workDays, day],
      };
    });
  };

  const handleSave = () => {
    if (!settings.companyName.trim() || !settings.companyEmail.trim()) {
      setSnackbar({
        open: true,
        message: "Company name and email are required.",
        severity: "error",
      });
      return;
    }

    if (settings.workDays.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one working day.",
        severity: "error",
      });
      return;
    }

    if (settings.startTime >= settings.endTime) {
      setSnackbar({
        open: true,
        message: "Work end time must be later than start time.",
        severity: "error",
      });
      return;
    }

    setSavedSettings({ ...settings });

    setSnackbar({
      open: true,
      message: "Company settings saved successfully.",
      severity: "success",
    });
  };

  const handleReset = () => {
    setSettings({ ...savedSettings });

    setSnackbar({
      open: true,
      message: "Changes have been discarded.",
      severity: "info",
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
      {/* Page Header */}
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
            Company Settings
          </Typography>

          <Typography color="text.secondary" mt={0.5} fontSize={14}>
            Manage your company's general information and system preferences.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={handleReset}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Discard Changes
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveRounded />}
            onClick={handleSave}
            sx={{
              bgcolor: "#2563EB",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              "&:hover": { bgcolor: "#1D4ED8" },
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        {/* Company Information */}
        <SectionCard>
          <SectionHeader
            icon={<BusinessRounded />}
            title="Company Information"
            description="Basic information about your organization."
          />

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="Company Email"
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleChange("companyEmail", e.target.value)}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={settings.companyPhone}
              onChange={(e) => handleChange("companyPhone", e.target.value)}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="Website"
              value={settings.website}
              onChange={(e) => handleChange("website", e.target.value)}
              sx={fieldStyles}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.timezone}
                  label="Timezone"
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="Africa/Cairo">Cairo (GMT+2)</MenuItem>
                  <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
                  <MenuItem value="Europe/Paris">Paris (GMT+1)</MenuItem>
                  <MenuItem value="Asia/Dubai">Dubai (GMT+4)</MenuItem>
                  <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Currency"
                  onChange={(e) => handleChange("currency", e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="EGP">EGP - Egyptian Pound</MenuItem>
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="SAR">SAR - Saudi Riyal</MenuItem>
                  <MenuItem value="AED">AED - UAE Dirham</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </SectionCard>

        {/* Work Schedule */}
        <SectionCard>
          <SectionHeader
            icon={<ScheduleRounded />}
            title="Work Schedule"
            description="Define the official working days and hours."
          />

          <Typography fontWeight={600} fontSize={14} mb={1.5}>
            Working Days
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 0.5,
              mb: 3,
            }}
          >
            {weekDays.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={settings.workDays.includes(day)}
                    onChange={() => handleWorkDayChange(day)}
                    sx={{
                      color: "#94A3B8",
                      "&.Mui-checked": { color: "#2563EB" },
                    }}
                  />
                }
                label={
                  <Typography fontSize={13}>
                    {day}
                  </Typography>
                }
              />
            ))}
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <Typography fontWeight={600} fontSize={14} mb={2}>
            Working Hours
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={settings.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={settings.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </Box>
        </SectionCard>

        {/* Attendance Rules */}
        <SectionCard>
          <SectionHeader
            icon={<AccessTimeRounded />}
            title="Attendance Rules"
            description="Configure attendance tracking and overtime policies."
          />

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              type="number"
              label="Late Arrival Grace Period (Minutes)"
              value={settings.gracePeriod}
              onChange={(e) =>
                handleChange(
                  "gracePeriod",
                  Math.max(0, Number(e.target.value))
                )
              }
              inputProps={{ min: 0 }}
              helperText="Allowed delay before an employee is marked as late."
              sx={fieldStyles}
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.trackAttendance}
                  onChange={(e) =>
                    handleChange("trackAttendance", e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    Attendance Tracking
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Enable employee attendance monitoring.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.overtimeRequiresApproval}
                  onChange={(e) =>
                    handleChange("overtimeRequiresApproval", e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    Overtime Approval
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Require approval before overtime is accepted.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />
          </Stack>
        </SectionCard>

        {/* Notifications */}
        <SectionCard>
          <SectionHeader
            icon={<NotificationsActiveRounded />}
            title="System Notifications"
            description="Choose which company notifications should be enabled."
          />

          <Stack spacing={2.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleChange("emailNotifications", e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    Email Notifications
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Enable system notification emails.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.attendanceAlerts}
                  onChange={(e) =>
                    handleChange("attendanceAlerts", e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    Attendance Alerts
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Receive alerts about attendance and absence issues.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.systemAnnouncements}
                  onChange={(e) =>
                    handleChange("systemAnnouncements", e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    System Announcements
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Receive important company-wide announcements.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", ml: 0 }}
            />
          </Stack>
        </SectionCard>
      </Box>

      {/* Bottom Actions */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        spacing={1.5}
        mt={3}
      >
        <Button
          variant="outlined"
          startIcon={<RestartAltRounded />}
          onClick={handleReset}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Discard Changes
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveRounded />}
          onClick={handleSave}
          sx={{
            bgcolor: "#2563EB",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "#1D4ED8" },
          }}
        >
          Save Changes
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}