
import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
  InputAdornment,
} from "@mui/material";

import {
  Notifications,
  Search,
  Done,
  Delete,
  AccessTime,
  Person,
  Event,
  Payment,
  Warning,
  Info,
  DoneAll,
} from "@mui/icons-material";

import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";


const initialNotifications = [
  {
    id: 1,
    title: "New Employee Added",
    message: "Sarah Ahmed has been added to the Marketing department.",
    category: "Employees",
    date: "Nov 21, 2026",
    time: "09:30 AM",
    read: false,
    icon: <Person />,
    color: "#2196F3",
  },
  {
    id: 2,
    title: "Leave Request Pending",
    message: "Mohamed Ali has submitted a new annual leave request.",
    category: "Leaves",
    date: "Nov 21, 2026",
    time: "10:15 AM",
    read: false,
    icon: <Event />,
    color: "#FF9800",
  },
  {
    id: 3,
    title: "Payroll Processed",
    message: "The monthly payroll has been successfully processed.",
    category: "Payroll",
    date: "Nov 20, 2026",
    time: "02:00 PM",
    read: true,
    icon: <Payment />,
    color: "#4CAF50",
  },
  {
    id: 4,
    title: "Attendance Alert",
    message: "An attendance issue was detected for 3 employees.",
    category: "Attendance",
    date: "Nov 20, 2026",
    time: "11:45 AM",
    read: false,
    icon: <Warning />,
    color: "#F44336",
  },
  {
    id: 5,
    title: "New Report Available",
    message: "The monthly HR performance report is ready to view.",
    category: "Reports",
    date: "Nov 19, 2026",
    time: "04:20 PM",
    read: true,
    icon: <Info />,
    color: "#9C27B0",
  },
];

export default function HRNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All Categories");

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && !item.read) ||
        (filter === "Read" && item.read);

      const matchesCategory =
        category === "All Categories" || item.category === category;

      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [notifications, searchTerm, filter, category]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Stay updated with the latest HR activities and alerts.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
                <Notifications />
              </Avatar>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Total Notifications
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {notifications.length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "#FFF3E0", color: "#ED6C02" }}>
                <Warning />
              </Avatar>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Unread Notifications
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {unreadCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "#E8F5E9", color: "#2E7D32" }}>
                <Done />
              </Avatar>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Read Notifications
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {notifications.length - unreadCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <TextField
              size="small"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Unread">Unread</MenuItem>
              <MenuItem value="Read">Read</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="All Categories">All Categories</MenuItem>
              <MenuItem value="Employees">Employees</MenuItem>
              <MenuItem value="Attendance">Attendance</MenuItem>
              <MenuItem value="Leaves">Leaves</MenuItem>
              <MenuItem value="Payroll">Payroll</MenuItem>
              <MenuItem value="Reports">Reports</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Recent Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredNotifications.length} notifications found
            </Typography>
          </Box>

          <Divider />

          {filteredNotifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 7, px: 2 }}>
              <Notifications
                sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
              />
              <Typography variant="h6" fontWeight={600}>
                No Notifications Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no notifications matching your filters.
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((item) => (
              <React.Fragment key={item.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2,
                    bgcolor: item.read ? "transparent" : "action.hover",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${item.color}18`,
                      color: item.color,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                    >
                      <Typography fontWeight={700}>
                        {item.title}
                      </Typography>

                      {!item.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="primary"
                          sx={{ height: 22 }}
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {item.message}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        label={item.category}
                        size="small"
                        variant="outlined"
                      />

                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTime
                          sx={{ fontSize: 15, color: "text.secondary" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.date} · {item.time}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={0.5}>
                    {!item.read && (
                      <IconButton
                        size="small"
                        title="Mark as Read"
                        onClick={() => markAsRead(item.id)}
                      >
                        <Done fontSize="small" />
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      color="error"
                      title="Delete Notification"
                      onClick={() => deleteNotification(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
                <Divider />
              </React.Fragment>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
