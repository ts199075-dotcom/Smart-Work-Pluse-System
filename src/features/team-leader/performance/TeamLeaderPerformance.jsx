import { useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  TextField,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import {
  TrendingUpRounded,
  GroupsRounded,
  TaskAltRounded,
  ScheduleRounded,
  CloseRounded,
} from "@mui/icons-material";

// Mock Data - Temporary until Backend Integration
const teamMembers = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    role: "Frontend Developer",
    initials: "AM",
    color: "#2563EB",
    week: { completed: 7, pending: 2, overdue: 0, productivity: 94 },
    month: { completed: 24, pending: 4, overdue: 1, productivity: 92 },
    quarter: { completed: 68, pending: 10, overdue: 3, productivity: 90 },
  },
  {
    id: 2,
    name: "Sara Ali",
    role: "UI/UX Designer",
    initials: "SA",
    color: "#9333EA",
    week: { completed: 6, pending: 1, overdue: 0, productivity: 88 },
    month: { completed: 20, pending: 3, overdue: 0, productivity: 88 },
    quarter: { completed: 59, pending: 8, overdue: 2, productivity: 86 },
  },
  {
    id: 3,
    name: "Mohamed Hassan",
    role: "Backend Developer",
    initials: "MH",
    color: "#0891B2",
    week: { completed: 5, pending: 3, overdue: 1, productivity: 76 },
    month: { completed: 18, pending: 6, overdue: 2, productivity: 76 },
    quarter: { completed: 52, pending: 14, overdue: 5, productivity: 74 },
  },
  {
    id: 4,
    name: "Omar Khaled",
    role: "Mobile Developer",
    initials: "OK",
    color: "#D97706",
    week: { completed: 4, pending: 3, overdue: 2, productivity: 65 },
    month: { completed: 15, pending: 5, overdue: 3, productivity: 68 },
    quarter: { completed: 43, pending: 13, overdue: 7, productivity: 70 },
  },
  {
    id: 5,
    name: "Mona Ahmed",
    role: "Software Tester",
    initials: "MA",
    color: "#16A34A",
    week: { completed: 6, pending: 1, overdue: 0, productivity: 90 },
    month: { completed: 22, pending: 2, overdue: 1, productivity: 90 },
    quarter: { completed: 64, pending: 7, overdue: 2, productivity: 91 },
  },
];

const periodOptions = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
];

function getPerformanceColor(value) {
  if (value >= 85) return "success";
  if (value >= 70) return "info";
  return "warning";
}

function getPerformanceLabel(value) {
  if (value >= 85) return "Excellent";
  if (value >= 70) return "Good";
  return "Needs Improvement";
}

function TeamLeaderPerformance() {
  const [period, setPeriod] = useState("month");
  const [search, setSearch] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("highest");
  const [selectedMember, setSelectedMember] = useState(null);

  // Calculate current period statistics
  const membersWithStats = useMemo(() => {
    return teamMembers.map((member) => ({
      ...member,
      ...member[period],
    }));
  }, [period]);

  // Calculate overview dynamically
  const overview = useMemo(() => {
    const totalCompleted = membersWithStats.reduce(
      (sum, member) => sum + member.completed,
      0
    );

    const totalPending = membersWithStats.reduce(
      (sum, member) => sum + member.pending,
      0
    );

    const totalOverdue = membersWithStats.reduce(
      (sum, member) => sum + member.overdue,
      0
    );

    const averageProductivity =
      membersWithStats.length > 0
        ? Math.round(
            membersWithStats.reduce(
              (sum, member) => sum + member.productivity,
              0
            ) / membersWithStats.length
          )
        : 0;

    return {
      totalMembers: membersWithStats.length,
      totalCompleted,
      totalPending,
      totalOverdue,
      averageProductivity,
    };
  }, [membersWithStats]);

  // Search, filter and sorting
  const filteredMembers = useMemo(() => {
    let result = membersWithStats.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase());

      const matchesPerformance =
        performanceFilter === "All" ||
        (performanceFilter === "Excellent" &&
          member.productivity >= 85) ||
        (performanceFilter === "Good" &&
          member.productivity >= 70 &&
          member.productivity < 85) ||
        (performanceFilter === "Needs Improvement" &&
          member.productivity < 70);

      return matchesSearch && matchesPerformance;
    });

    result.sort((a, b) =>
      sortOrder === "highest"
        ? b.productivity - a.productivity
        : a.productivity - b.productivity
    );

    return result;
  }, [membersWithStats, search, performanceFilter, sortOrder]);

  const completionRate = (member) => {
    const total =
      member.completed + member.pending + member.overdue;

    if (!total) return 0;

    return Math.round((member.completed / total) * 100);
  };

  const overviewCards = [
    {
      title: "Team Members",
      value: overview.totalMembers,
      subtitle: "Active members",
      icon: <GroupsRounded />,
      color: "#2563EB",
      background: "#DBEAFE",
    },
    {
      title: "Completed Tasks",
      value: overview.totalCompleted,
      subtitle: "Tasks completed",
      icon: <TaskAltRounded />,
      color: "#16A34A",
      background: "#DCFCE7",
    },
    {
      title: "Average Productivity",
      value: `${overview.averageProductivity}%`,
      subtitle: "Team productivity",
      icon: <TrendingUpRounded />,
      color: "#9333EA",
      background: "#F3E8FF",
    },
    {
      title: "Overdue Tasks",
      value: overview.totalOverdue,
      subtitle: "Need attention",
      icon: <ScheduleRounded />,
      color: "#DC2626",
      background: "#FEE2E2",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Team Performance
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Monitor your team productivity and track individual performance.
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="Time Period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          sx={{ minWidth: 170 }}
        >
          {periodOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Overview Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {overviewCards.map((card) => (
          <Card
            key={card.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography fontSize={13} color="text.secondary">
                  {card.title}
                </Typography>

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    backgroundColor: card.background,
                    fontSize: 23,
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>

              <Typography variant="h4" fontWeight={700} mb={0.5}>
                {card.value}
              </Typography>

              <Typography fontSize={12} color="text.secondary">
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Overall Team Performance */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Overall Team Performance
          </Typography>

          <Typography fontSize={13} color="text.secondary" mb={3}>
            Team productivity for{" "}
            {periodOptions.find((option) => option.value === period)?.label}.
          </Typography>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              Average Productivity
            </Typography>

            <Typography
              fontSize={14}
              fontWeight={700}
              color="success.main"
            >
              {overview.averageProductivity}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={overview.averageProductivity}
            color="success"
            sx={{
              height: 12,
              borderRadius: 5,
              backgroundColor: "#E2E8F0",
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 3,
              mt: 3,
            }}
          >
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Completed Tasks
              </Typography>

              <Typography fontSize={22} fontWeight={700} color="success.main">
                {overview.totalCompleted}
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={12} color="text.secondary">
                Pending Tasks
              </Typography>

              <Typography fontSize={22} fontWeight={700}>
                {overview.totalPending}
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={12} color="text.secondary">
                Overdue Tasks
              </Typography>

              <Typography fontSize={22} fontWeight={700} color="error.main">
                {overview.totalOverdue}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Members Performance */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Members Performance
            </Typography>

            <Typography fontSize={13} color="text.secondary">
              Search, filter and compare individual team performance.
            </Typography>
          </Box>

          {/* Filters */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "2fr 1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search Member"
              placeholder="Search by name or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Performance"
              value={performanceFilter}
              onChange={(event) =>
                setPerformanceFilter(event.target.value)
              }
            >
              <MenuItem value="All">All Levels</MenuItem>
              <MenuItem value="Excellent">Excellent</MenuItem>
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Needs Improvement">
                Needs Improvement
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Sort By"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <MenuItem value="highest">Highest Productivity</MenuItem>
              <MenuItem value="lowest">Lowest Productivity</MenuItem>
            </TextField>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Results Count */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography fontSize={13} fontWeight={600}>
              Team Members
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              {filteredMembers.length} members found
            </Typography>
          </Stack>

          {/* Members List */}
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <Box key={member.id}>
                <Box
                  onClick={() => setSelectedMember(member)}
                  sx={{
                    py: 2.5,
                    cursor: "pointer",
                    borderRadius: 2,
                    px: 1,
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: "#F8FAFC",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.3fr 1fr 1.2fr 1fr",
                      },
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    {/* Member Info */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "center", minWidth: 0 }}
                    >
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          backgroundColor: member.color,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {member.initials}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={14} fontWeight={600}>
                          {member.name}
                        </Typography>

                        <Typography fontSize={12} color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Tasks Statistics */}
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Typography fontSize={11} color="text.secondary">
                          Completed
                        </Typography>

                        <Typography
                          fontSize={14}
                          fontWeight={700}
                          color="success.main"
                        >
                          {member.completed}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography fontSize={11} color="text.secondary">
                          Pending
                        </Typography>

                        <Typography fontSize={14} fontWeight={700}>
                          {member.pending}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography fontSize={11} color="text.secondary">
                          Overdue
                        </Typography>

                        <Typography
                          fontSize={14}
                          fontWeight={700}
                          color="error.main"
                        >
                          {member.overdue}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Productivity */}
                    <Box>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography fontSize={12} color="text.secondary">
                          Productivity
                        </Typography>

                        <Typography fontSize={12} fontWeight={700}>
                          {member.productivity}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={member.productivity}
                        color={getPerformanceColor(member.productivity)}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "#E2E8F0",
                        }}
                      />
                    </Box>

                    {/* Performance Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                      }}
                    >
                      <Chip
                        label={getPerformanceLabel(member.productivity)}
                        color={getPerformanceColor(member.productivity)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {index !== filteredMembers.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <GroupsRounded
                sx={{ fontSize: 42, color: "text.disabled", mb: 1 }}
              />

              <Typography fontWeight={600} mb={1}>
                No Members Found
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                Try changing your search or filter options.
              </Typography>

              <Button
                sx={{ mt: 2 }}
                onClick={() => {
                  setSearch("");
                  setPerformanceFilter("All");
                  setSortOrder("highest");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Member Details Dialog */}
      <Dialog
        open={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedMember && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Member Performance Details
                </Typography>

                <Button
                  color="inherit"
                  onClick={() => setSelectedMember(null)}
                  sx={{ minWidth: 0 }}
                >
                  <CloseRounded />
                </Button>
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", mb: 3 }}
              >
                <Avatar
                  sx={{
                    width: 58,
                    height: 58,
                    backgroundColor: selectedMember.color,
                    fontSize: 18,
                  }}
                >
                  {selectedMember.initials}
                </Avatar>

                <Box>
                  <Typography fontWeight={700} fontSize={17}>
                    {selectedMember.name}
                  </Typography>

                  <Typography fontSize={13} color="text.secondary">
                    {selectedMember.role}
                  </Typography>
                </Box>
              </Stack>

              <Typography fontWeight={600} mb={1}>
                Productivity
              </Typography>

              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography fontSize={13} color="text.secondary">
                  Overall Score
                </Typography>

                <Typography fontWeight={700}>
                  {selectedMember.productivity}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={selectedMember.productivity}
                color={getPerformanceColor(selectedMember.productivity)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mb: 1,
                }}
              />

              <Chip
                label={getPerformanceLabel(selectedMember.productivity)}
                color={getPerformanceColor(selectedMember.productivity)}
                size="small"
                sx={{ mb: 3 }}
              />

              <Typography fontWeight={600} mb={2}>
                Tasks Overview
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                  mb: 3,
                }}
              >
                {[
                  {
                    label: "Completed Tasks",
                    value: selectedMember.completed,
                    color: "success.main",
                  },
                  {
                    label: "Pending Tasks",
                    value: selectedMember.pending,
                    color: "text.primary",
                  },
                  {
                    label: "Overdue Tasks",
                    value: selectedMember.overdue,
                    color: "error.main",
                  },
                  {
                    label: "Completion Rate",
                    value: `${completionRate(selectedMember)}%`,
                    color: "primary.main",
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <Typography fontSize={12} color="text.secondary">
                      {item.label}
                    </Typography>

                    <Typography
                      fontSize={23}
                      fontWeight={700}
                      color={item.color}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography fontSize={12} color="text.secondary">
                Showing data for{" "}
                {periodOptions.find((option) => option.value === period)?.label}.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                onClick={() => setSelectedMember(null)}
                sx={{
                  backgroundColor: "#17365D",
                  "&:hover": {
                    backgroundColor: "#102945",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default TeamLeaderPerformance;