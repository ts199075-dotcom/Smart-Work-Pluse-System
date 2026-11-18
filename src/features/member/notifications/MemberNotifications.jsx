import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";

const initialNotifications = [
  {
    id: 1,
    title: "Task Assigned",
    message: "You have been assigned a new task: Update Dashboard UI.",
    category: "Tasks",
    time: "10 minutes ago",
    read: false,
    icon: <TaskAltOutlinedIcon />,
  },
  {
    id: 2,
    title: "Attendance Reminder",
    message: "Don't forget to check in when you arrive at the office.",
    category: "Attendance",
    time: "1 hour ago",
    read: false,
    icon: <AccessTimeOutlinedIcon />,
  },
  {
    id: 3,
    title: "Payroll Processed",
    message: "Your October salary has been processed successfully.",
    category: "Payroll",
    time: "Yesterday",
    read: true,
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
  {
    id: 4,
    title: "Project Update",
    message: "The Customer Portal project deadline has been updated.",
    category: "Projects",
    time: "Yesterday",
    read: true,
    icon: <WorkOutlineOutlinedIcon />,
  },
  {
    id: 5,
    title: "New Task Comment",
    message: "Your team leader commented on your latest task.",
    category: "Tasks",
    time: "2 days ago",
    read: false,
    icon: <TaskAltOutlinedIcon />,
  },
];

const filters = ["All", "Tasks", "Projects", "Attendance", "Payroll"];

function MemberNotifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );
  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications =
    activeFilter === "All"
      ? notifications
      : notifications.filter(
          (notification) => notification.category === activeFilter
        );

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h3" mb={0.5}>
            Notifications
          </Typography>
          <Typography color="text.secondary">
            Stay updated with your latest activities and announcements.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<DoneAllOutlinedIcon />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "secondary.light",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsNoneOutlinedIcon />
          </Box>

          <Box>
            <Typography variant="h5">
              {unreadCount} Unread Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have {notifications.length} notifications in total.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 2.5, pt: 2 }}>
          <Tabs
            value={activeFilter}
            onChange={(_, value) => setActiveFilter(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {filters.map((filter) => (
              <Tab
                key={filter}
                label={filter}
                value={filter}
              />
            ))}
          </Tabs>
        </Box>

        <Divider />

        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <Box key={notification.id}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{
                  p: 2.5,
                  bgcolor: notification.read
                    ? "background.paper"
                    : "rgba(37, 99, 235, 0.045)",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: "secondary.light",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {notification.icon}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    flexWrap="wrap"
                    mb={0.5}
                  >
                    <Typography fontWeight={600}>
                      {notification.title}
                    </Typography>

                    {!notification.read && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "secondary.main",
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    {notification.message}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Chip
                      label={notification.category}
                      size="small"
                      variant="outlined"
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {notification.time}
                    </Typography>
                  </Stack>
                </Box>

                {!notification.read && (
                  <Button
                    size="small"
                    onClick={() => markAsRead(notification.id)}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Mark as read
                  </Button>
                )}
              </Stack>

              {index !== filteredNotifications.length - 1 && (
                <Divider />
              )}
            </Box>
          ))
        ) : (
          <Box sx={{ py: 7, textAlign: "center" }}>
            <NotificationsNoneOutlinedIcon
              sx={{ fontSize: 42, color: "text.disabled", mb: 1 }}
            />
            <Typography fontWeight={600}>
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no notifications in this category.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default MemberNotifications;