import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  Typography,
  Snackbar,
} from "@mui/material";

import {
  NotificationsActiveRounded,
  EmailRounded,
  CampaignRounded,
  AssignmentRounded,
  AccessTimeRounded,
  SaveRounded,
  RestartAltRounded,
} from "@mui/icons-material";

const SETTINGS_KEY = "smart-workspace-member-settings";

const defaultSettings = {
  inAppNotifications: true,
  emailNotifications: true,
  taskUpdates: true,
  attendanceReminders: true,
  projectUpdates: true,
};

function MemberSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);

      if (savedSettings) {
        return {
          ...defaultSettings,
          ...JSON.parse(savedSettings),
        };
      }
    } catch {
      localStorage.removeItem(SETTINGS_KEY);
    }

    return defaultSettings;
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const handleChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
      );

      setSnackbar({
        open: true,
        message: "Settings saved successfully.",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Unable to save settings.",
      });
    }
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    localStorage.removeItem(SETTINGS_KEY);

    setSnackbar({
      open: true,
      message: "Settings restored to default.",
    });
  };

  const notificationOptions = [
    {
      key: "inAppNotifications",
      title: "In-App Notifications",
      description: "Receive notifications inside Smart WorkSpace.",
      icon: <NotificationsActiveRounded />,
    },
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Receive important updates through your email.",
      icon: <EmailRounded />,
    },
    {
      key: "taskUpdates",
      title: "Task Updates",
      description: "Get notified when your assigned tasks change.",
      icon: <AssignmentRounded />,
    },
    {
      key: "projectUpdates",
      title: "Project Updates",
      description: "Stay informed about changes in your projects.",
      icon: <CampaignRounded />,
    },
    {
      key: "attendanceReminders",
      title: "Attendance Reminders",
      description: "Receive reminders related to your attendance.",
      icon: <AccessTimeRounded />,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Settings
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Manage your preferences and notification settings.
        </Typography>
      </Box>

      {/* Notifications */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            mb={1}
          >
            <NotificationsActiveRounded color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Notifications
            </Typography>
          </Stack>

          <Typography color="text.secondary" mb={3}>
            Choose which notifications you want to receive.
          </Typography>

          <Stack divider={<Divider flexItem />} spacing={2}>
            {notificationOptions.map((option) => (
              <Stack
                key={option.key}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                py={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {option.icon}
                  </Box>

                  <Box>
                    <Typography fontWeight={600}>
                      {option.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </Stack>

                <Switch
                  checked={settings[option.key]}
                  onChange={() => handleChange(option.key)}
                />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        mt={3}
        flexWrap="wrap"
        useFlexGap
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltRounded />}
          onClick={handleReset}
        >
          Reset to Default
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveRounded />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Stack>

      {/* Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({ open: false, message: "" })
        }
      >
        <Alert
          severity={
            snackbar.message.includes("Unable") ? "error" : "success"
          }
          onClose={() =>
            setSnackbar({ open: false, message: "" })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MemberSettings;