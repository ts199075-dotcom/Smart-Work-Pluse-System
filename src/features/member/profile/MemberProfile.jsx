import { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  PersonRounded,
  EmailRounded,
  PhoneRounded,
  BusinessRounded,
  LocationCityRounded,
  BadgeRounded,
  PaymentsRounded,
  WcRounded,
  SupervisorAccountRounded,
} from "@mui/icons-material";

import { getMyProfile } from "../../../services/profileService";
import { useAuth } from "../../../contexts/AuthContext";

function MemberProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile();

        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(
          err.message || "Failed to load profile information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return value;
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: "Admin",
      member: "Employee",
      "team-leader": "Manager",
      hr: "HR",
      finance: "Finance",
    };

    return roles[role] || role || "User";
  };

  const getGenderLabel = (gender) => {
    if (gender === 0 || gender === "0") return "Male";
    if (gender === 1 || gender === "1") return "Female";

    return getValue(gender);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Profile information not found.
        </Alert>
      </Box>
    );
  }

  // ASP.NET Core may serialize these properties using camelCase.
  const fullName = profile.fullName ?? profile.FullName;
  const email = profile.email ?? profile.Email;
  const phone = profile.phone ?? profile.Phone;
  const department = profile.department ?? profile.Department;
  const city = profile.city ?? profile.City;
  const governorate = profile.gavernate ?? profile.Gavernate;
  const gender = profile.gender ?? profile.Gender;
  const basicSalary = profile.basicSalary ?? profile.BasicSalary;
  const managerId = profile.managerId ?? profile.ManagerId;

  const infoSections = [
    {
      title: "Personal Information",
      description: "Your personal and contact details.",
      fields: [
        {
          label: "Full Name",
          value: fullName,
          icon: <PersonRounded />,
        },
        {
          label: "Email Address",
          value: email,
          icon: <EmailRounded />,
        },
        {
          label: "Phone Number",
          value: phone,
          icon: <PhoneRounded />,
        },
        {
          label: "Gender",
          value: getGenderLabel(gender),
          icon: <WcRounded />,
        },
      ],
    },
    {
      title: "Employment Information",
      description: "Your current employment details.",
      fields: [
        {
          label: "Department",
          value: department,
          icon: <BusinessRounded />,
        },
        {
          label: "Basic Salary",
          value:
            basicSalary !== null && basicSalary !== undefined
              ? `${Number(basicSalary).toLocaleString("en-US")} EGP`
              : "Not available",
          icon: <PaymentsRounded />,
        },
        {
          label: "Manager ID",
          value: managerId,
          icon: <SupervisorAccountRounded />,
        },
      ],
    },
    {
      title: "Location Information",
      description: "Your registered location details.",
      fields: [
        {
          label: "Governorate",
          value: governorate,
          icon: <LocationCityRounded />,
        },
        {
          label: "City",
          value: city,
          icon: <LocationCityRounded />,
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          My Profile
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          View your personal and employment information.
        </Typography>
      </Box>

      {/* Profile Hero */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            height: 110,
            background:
              "linear-gradient(110deg, #1976d2 0%, #42a5f5 100%)",
          }}
        />

        <CardContent sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "center", sm: "flex-end" }}
            spacing={2}
            sx={{ mt: -6 }}
          >
            <Avatar
              sx={{
                width: 112,
                height: 112,
                fontSize: 36,
                fontWeight: 700,
                bgcolor: "primary.dark",
                border: "5px solid",
                borderColor: "background.paper",
              }}
            >
              {getInitials(fullName)}
            </Avatar>

            <Box
              flex={1}
              textAlign={{ xs: "center", sm: "left" }}
              pb={1}
            >
              <Typography variant="h5" fontWeight={700}>
                {getValue(fullName)}
              </Typography>

              <Typography color="text.secondary" mt={0.5}>
                {getValue(department)}
              </Typography>
            </Box>

            <Chip
              icon={<BadgeRounded />}
              label={getRoleLabel(user?.role)}
              variant="outlined"
              size="small"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Information Sections */}
      <Grid container spacing={3}>
        {infoSections.map((section) => (
          <Grid item xs={12} key={section.title}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700}>
                  {section.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                  mb={3}
                >
                  {section.description}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {section.fields.map((field) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={field.label}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={1}
                      >
                        <Box
                          sx={{
                            color: "primary.main",
                            display: "flex",
                          }}
                        >
                          {field.icon}
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {field.label}
                        </Typography>
                      </Stack>

                      <Typography
                        fontWeight={600}
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {getValue(field.value)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MemberProfile;