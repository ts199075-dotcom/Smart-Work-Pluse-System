
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Divider,
} from "@mui/material";

import {
  GroupsOutlined,
  PersonOutlined,
  CheckCircleRounded,
  RocketLaunchOutlined,
  ArrowForwardRounded,
  ScheduleOutlined,
  AssignmentOutlined,
} from "@mui/icons-material";

const summaryCards = [
  {
    title: "Total Teams",
    value: "18",
    subtitle: "Across the organization",
    icon: <GroupsOutlined />,
    color: "#2563EB",
    background: "#DBEAFE",
  },
  {
    title: "Team Members",
    value: "14",
    subtitle: "Under your supervision",
    icon: <PersonOutlined />,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Current Sprint",
    value: "04",
    subtitle: "Sprint currently running",
    icon: <RocketLaunchOutlined />,
    color: "#D97706",
    background: "#FEF3C7",
  },
];

const activityData = [
  {
    title: "This Week",
    percentage: 78,
    color: "#2563EB",
  },
  {
    title: "Last Week",
    percentage: 62,
    color: "#16A34A",
  },
  {
    title: "Monthly Progress",
    percentage: 88,
    color: "#D97706",
  },
];

const recentRecords = [
  {
    name: "Ahmed Mohamed",
    role: "Frontend Developer",
    status: "Approved",
    initials: "AM",
    color: "#2563EB",
  },
  {
    name: "Sara Ali",
    role: "UI/UX Designer",
    status: "Pending",
    initials: "SA",
    color: "#9333EA",
  },
  {
    name: "Mohamed Hassan",
    role: "Backend Developer",
    status: "In Progress",
    initials: "MH",
    color: "#0891B2",
  },
  {
    name: "Mona Ahmed",
    role: "Software Tester",
    status: "Needs Review",
    initials: "MA",
    color: "#D97706",
  },
];

function SummaryCard({ card }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography color="text.secondary" fontSize={14}>
            {card.title}
          </Typography>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: card.background,
              color: card.color,
              fontSize: 24,
            }}
          >
            {card.icon}
          </Box>
        </Stack>

        <Typography
          variant="h4"
          fontWeight={700}
          color="text.primary"
          mb={0.5}
        >
          {card.value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {card.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "Approved":
      return { color: "success", label: "Approved" };

    case "Pending":
      return { color: "warning", label: "Pending" };

    case "In Progress":
      return { color: "info", label: "In Progress" };

    case "Needs Review":
      return { color: "error", label: "Needs Review" };

    default:
      return { color: "default", label: status };
  }
}

function TeamLeaderTeams() {
  const navigate = useNavigate();

  const handleSprintOverview = () => {
    navigate("/sprints");
  };

  const handleViewAllRecords = () => {
    navigate("/reports");
  };

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
            Teams & Sprints
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            Manage your teams and track their sprint activities.
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardRounded />}
          onClick={handleSprintOverview}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            backgroundColor: "#17365D",
            "&:hover": {
              backgroundColor: "#102945",
            },
          }}
        >
          Sprint Overview
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} card={card} />
        ))}
      </Box>

      {/* Records and Activity */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.2fr 0.8fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Team Records */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Team Records
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Overview of your team activities
                </Typography>
              </Box>

              <AssignmentOutlined
                sx={{ color: "text.secondary", fontSize: 26 }}
              />
            </Stack>

            {activityData.map((activity, index) => (
              <Box key={activity.title} sx={{ mb: index === 2 ? 0 : 3 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    {activity.title}
                  </Typography>

                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    color="text.primary"
                  >
                    {activity.percentage}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={activity.percentage}
                  sx={{
                    height: 9,
                    borderRadius: 5,
                    backgroundColor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      backgroundColor: activity.color,
                    },
                  }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              Activity Overview
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Your team's overall performance
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                py: 2,
              }}
            >
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  border: "12px solid #DBEAFE",
                  borderTopColor: "#2563EB",
                  borderRightColor: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(45deg)",
                }}
              >
                <Box
                  sx={{
                    transform: "rotate(-45deg)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    78%
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Completion
                  </Typography>
                </Box>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mt: 3 }}
              >
                <CheckCircleRounded
                  sx={{ color: "success.main", fontSize: 19 }}
                />

                <Typography fontSize={13} color="text.secondary">
                  Team performance is on track
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Records */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Recent Records
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Latest team updates and activities
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForwardRounded />}
              onClick={handleViewAllRecords}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              View All
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {recentRecords.map((record, index) => {
            const status = getStatusStyle(record.status);

            return (
              <Box key={record.name}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    py: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        backgroundColor: record.color,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {record.initials}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontSize={14} fontWeight={600}>
                        {record.name}
                      </Typography>

                      <Typography fontSize={12} color="text.secondary">
                        {record.role}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      borderRadius: 1.5,
                    }}
                  />
                </Stack>

                {index !== recentRecords.length - 1 && <Divider />}
              </Box>
            );
          })}
        </CardContent>
      </Card>

      {/* Sprint Reminder */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 3,
          backgroundColor: "#EFF6FF",
          border: "1px solid #DBEAFE",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                backgroundColor: "#DBEAFE",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ScheduleOutlined />
            </Box>

            <Box>
              <Typography fontWeight={600} color="#17365D">
                Keep your team on track!
              </Typography>

              <Typography fontSize={13} color="text.secondary">
                Review sprint progress regularly to make sure your team
                achieves its goals on time.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TeamLeaderTeams;
