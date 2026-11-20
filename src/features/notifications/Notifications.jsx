
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";

import { USER_ROLES } from "../../config/navigation";

const notificationData = {
  [USER_ROLES.MEMBER]: [
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
  ],

  [USER_ROLES.TEAM_LEADER]: [
    {
      id: 1,
      title: "New Task Submission",
      message: "Ahmed Mohamed has submitted a task for your review.",
      category: "Tasks",
      time: "10 minutes ago",
      read: false,
      icon: <TaskAltOutlinedIcon />,
    },
    {
      id: 2,
      title: "Project Deadline Approaching",
      message: "Website Redesign is approaching its delivery deadline.",
      category: "Projects",
      time: "1 hour ago",
      read: false,
      icon: <WorkOutlineOutlinedIcon />,
    },
    {
      id: 3,
      title: "Team Member Update",
      message: "Sara Ali has updated her task progress.",
      category: "Teams",
      time: "Yesterday",
      read: true,
      icon: <GroupsOutlinedIcon />,
    },
    {
      id: 4,
      title: "Attendance Alert",
      message: "One of your team members has a late check-in.",
      category: "Attendance",
      time: "Yesterday",
      read: true,
      icon: <AccessTimeOutlinedIcon />,
    },
    {
      id: 5,
      title: "Overtime Request",
      message: "A new overtime request is waiting for your approval.",
      category: "Overtime",
      time: "2 days ago",
      read: false,
      icon: <EventNoteOutlinedIcon />,
    },
  ],

  [USER_ROLES.HR]: [
    {
      id: 1,
      title: "New Employee",
      message: "A new employee has been added to the company.",
      category: "Employees",
      time: "10 minutes ago",
      read: false,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      id: 2,
      title: "Attendance Alert",
      message: "Some employee attendance records need your attention.",
      category: "Attendance",
      time: "1 hour ago",
      read: false,
      icon: <AccessTimeOutlinedIcon />,
    },
    {
      id: 3,
      title: "Leave Request",
      message: "A new employee leave request is waiting for review.",
      category: "Leaves",
      time: "Yesterday",
      read: true,
      icon: <EventNoteOutlinedIcon />,
    },
    {
      id: 4,
      title: "Payroll Reminder",
      message: "The monthly payroll process is ready for review.",
      category: "Payroll",
      time: "Yesterday",
      read: true,
      icon: <AccountBalanceWalletOutlinedIcon />,
    },
    {
      id: 5,
      title: "Overtime Records",
      message: "New overtime records have been submitted for approval.",
      category: "Overtime",
      time: "2 days ago",
      read: false,
      icon: <AccessTimeOutlinedIcon />,
    },
  ],
};

function Notifications({ role = USER_ROLES.MEMBER }) {
  const roleNotifications =
    notificationData[role] || notificationData[USER_ROLES.MEMBER];

  const [notifications, setNotifications] = useState(roleNotifications);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    ...new Set(roleNotifications.map((notification) => notification.category)),
  ];

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
        <Stack direction="row" alignItems="center" spacing={2}>
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
              <Tab key={filter} label={filter} value={filter} />
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

                    <Typography variant="caption" color="text.secondary">
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

              {index !== filteredNotifications.length - 1 && <Divider />}
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

export default Notifications;
