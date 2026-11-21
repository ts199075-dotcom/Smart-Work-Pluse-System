import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

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

const SETTINGS_STORAGE_KEY = "smart-workspace-company-settings";

const getInitialSettings = () => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (savedSettings) {
      return {
        ...initialSettings,
        ...JSON.parse(savedSettings),
      };
    }
  } catch (error) {
    console.error("Failed to load company settings:", error);
  }

  return { ...initialSettings };
};

const workDaysOptions = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CompanySettings() {
  const [settings, setSettings] = useState(getInitialSettings);
  const [savedSettings, setSavedSettings] = useState(getInitialSettings);

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
      const isSelected = prev.workDays.includes(day);

      return {
        ...prev,
        workDays: isSelected
          ? prev.workDays.filter((item) => item !== day)
          : [...prev.workDays, day],
      };
    });
  };

  const handleSave = () => {
    if (!settings.companyName.trim()) {
      setSnackbar({
        open: true,
        message: "Company name is required.",
        severity: "error",
      });
      return;
    }

    if (!settings.companyEmail.trim()) {
      setSnackbar({
        open: true,
        message: "Company email is required.",
        severity: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(settings.companyEmail)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid company email.",
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
        message: "End time must be later than start time.",
        severity: "error",
      });
      return;
    }

    if (
      !Number.isFinite(Number(settings.gracePeriod)) ||
      Number(settings.gracePeriod) < 0
    ) {
      setSnackbar({
        open: true,
        message: "Grace period must be a valid non-negative number.",
        severity: "error",
      });
      return;
    }

    const updatedSettings = {
      ...settings,
      companyName: settings.companyName.trim(),
      companyEmail: settings.companyEmail.trim(),
      gracePeriod: Number(settings.gracePeriod),
      workDays: [...settings.workDays],
    };

    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updatedSettings)
      );

      setSettings(updatedSettings);
      setSavedSettings(updatedSettings);

      setSnackbar({
        open: true,
        message: "Company settings saved successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to save company settings:", error);

      setSnackbar({
        open: true,
        message: "Failed to save settings. Please try again.",
        severity: "error",
      });
    }
  };

  const handleReset = () => {
    const restoredSettings = {
      ...savedSettings,
      workDays: [...savedSettings.workDays],
    };

    setSettings(restoredSettings);

    setSnackbar({
      open: true,
      message: "Changes have been discarded.",
      severity: "info",
    });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const sectionCardSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "none",
  };

  const sectionTitleSx = {
    fontSize: "1.1rem",
    fontWeight: 700,
    mb: 0.5,
  };

  const sectionDescriptionSx = {
    color: "text.secondary",
    fontSize: "0.875rem",
    mb: 3,
  };

  const fieldGridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 2.5,
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Company Settings
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your company information and workspace preferences.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* Company Information */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitleSx}>
              Company Information
            </Typography>

            <Typography sx={sectionDescriptionSx}>
              Update your company's basic information and contact details.
            </Typography>

            <Box sx={fieldGridSx}>
              <TextField
                fullWidth
                label="Company Name"
                value={settings.companyName}
                onChange={(e) =>
                  handleChange("companyName", e.target.value)
                }
              />

              <TextField
                fullWidth
                label="Company Email"
                type="email"
                value={settings.companyEmail}
                onChange={(e) =>
                  handleChange("companyEmail", e.target.value)
                }
              />

              <TextField
                fullWidth
                label="Company Phone"
                value={settings.companyPhone}
                onChange={(e) =>
                  handleChange("companyPhone", e.target.value)
                }
              />

              <TextField
                fullWidth
                label="Website"
                value={settings.website}
                onChange={(e) =>
                  handleChange("website", e.target.value)
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitleSx}>
              Regional Settings
            </Typography>

            <Typography sx={sectionDescriptionSx}>
              Configure your company's timezone and preferred currency.
            </Typography>

            <Box sx={fieldGridSx}>
              <TextField
                fullWidth
                label="Timezone"
                value={settings.timezone}
                onChange={(e) =>
                  handleChange("timezone", e.target.value)
                }
              />

              <TextField
                fullWidth
                label="Currency"
                value={settings.currency}
                onChange={(e) =>
                  handleChange("currency", e.target.value)
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitleSx}>
              Working Hours
            </Typography>

            <Typography sx={sectionDescriptionSx}>
              Set your company's official working days and hours.
            </Typography>

            <Typography fontWeight={600} sx={{ mb: 1.5 }}>
              Working Days
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(4, 1fr)",
                },
                gap: 1,
                mb: 3,
              }}
            >
              {workDaysOptions.map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={settings.workDays.includes(day)}
                      onChange={() => handleWorkDayChange(day)}
                    />
                  }
                  label={day}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography fontWeight={600} sx={{ mb: 1.5 }}>
              Daily Working Hours
            </Typography>

            <Box sx={fieldGridSx}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={settings.startTime}
                onChange={(e) =>
                  handleChange("startTime", e.target.value)
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={settings.endTime}
                onChange={(e) =>
                  handleChange("endTime", e.target.value)
                }
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Attendance Rules */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitleSx}>
              Attendance Rules
            </Typography>

            <Typography sx={sectionDescriptionSx}>
              Configure attendance tracking and overtime policies.
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    Track Attendance
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Enable attendance tracking for employees.
                  </Typography>
                </Box>

                <Switch
                  checked={settings.trackAttendance}
                  onChange={(e) =>
                    handleChange("trackAttendance", e.target.checked)
                  }
                />
              </Box>

              <Divider />

              <Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Grace Period (Minutes)
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  value={settings.gracePeriod}
                  onChange={(e) =>
                    handleChange(
                      "gracePeriod",
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  inputProps={{ min: 0 }}
                  helperText="Allowed delay before an employee is marked as late."
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    Overtime Requires Approval
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Require approval before recording overtime hours.
                  </Typography>
                </Box>

                <Switch
                  checked={settings.overtimeRequiresApproval}
                  onChange={(e) =>
                    handleChange(
                      "overtimeRequiresApproval",
                      e.target.checked
                    )
                  }
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={sectionTitleSx}>
              Notifications
            </Typography>

            <Typography sx={sectionDescriptionSx}>
              Manage company notification preferences.
            </Typography>

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    Email Notifications
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Enable email notifications for company updates.
                  </Typography>
                </Box>

                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleChange("emailNotifications", e.target.checked)
                  }
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    Attendance Alerts
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Receive notifications about attendance activities.
                  </Typography>
                </Box>

                <Switch
                  checked={settings.attendanceAlerts}
                  onChange={(e) =>
                    handleChange("attendanceAlerts", e.target.checked)
                  }
                />
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    System Announcements
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Receive important system announcements.
                  </Typography>
                </Box>

                <Switch
                  checked={settings.systemAnnouncements}
                  onChange={(e) =>
                    handleChange(
                      "systemAnnouncements",
                      e.target.checked
                    )
                  }
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
            pb: 2,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleReset}
          >
            Discard Changes
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Stack>

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
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}