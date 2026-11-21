import { useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";

import {
  EditRounded,
  SaveRounded,
  CloseRounded,
  PersonRounded,
  EmailRounded,
  PhoneRounded,
  WorkRounded,
  BusinessRounded,
  CalendarMonthRounded,
  BadgeRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";

import { useAppData } from "../../../hooks/useAppData";

const CURRENT_MEMBER_ID = 1;

function MemberProfile() {
  const { employees, setEmployees } = useAppData();

  const employee = employees.find(
    (item) => item.id === CURRENT_MEMBER_ID
  );

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(employee?.phone || "");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!employee) {
    return (
      <Box p={3}>
        <Typography>Employee information not found.</Typography>
      </Box>
    );
  }

  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const handleEdit = () => {
    setPhone(employee.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPhone(employee.phone || "");
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      setSnackbar({
        open: true,
        message: "Phone number cannot be empty.",
        severity: "error",
      });
      return;
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(trimmedPhone)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid phone number.",
        severity: "error",
      });
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.map((item) =>
        item.id === CURRENT_MEMBER_ID
          ? { ...item, phone: trimmedPhone }
          : item
      )
    );

    setIsEditing(false);

    setSnackbar({
      open: true,
      message: "Profile updated successfully.",
      severity: "success",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "On Leave":
        return "warning";
      default:
        return "default";
    }
  };

  const infoSections = [
    {
      title: "Personal Information",
      description: "Your personal and contact details.",
      fields: [
        {
          label: "Full Name",
          value: employee.name,
          icon: <PersonRounded />,
        },
        {
          label: "Email Address",
          value: employee.email,
          icon: <EmailRounded />,
        },
        {
          label: "Phone Number",
          value: employee.phone,
          icon: <PhoneRounded />,
          editable: true,
        },
      ],
    },
    {
      title: "Employment Information",
      description: "Your current position and company details.",
      fields: [
        {
          label: "Employee ID",
          value: `EMP-${String(employee.id).padStart(3, "0")}`,
          icon: <BadgeRounded />,
        },
        {
          label: "Job Position",
          value: employee.position,
          icon: <WorkRounded />,
        },
        {
          label: "Department",
          value: employee.department,
          icon: <BusinessRounded />,
        },
        {
          label: "Join Date",
          value: formatDate(employee.joinDate),
          icon: <CalendarMonthRounded />,
        },
      ],
    },
  ];

  return (
    <Box>
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
          <Typography variant="h4" fontWeight={700}>
            My Profile
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage your personal and employment information.
          </Typography>
        </Box>

        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<EditRounded />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseRounded />}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveRounded />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Stack>
        )}
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
            bgcolor: "primary.main",
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
              {initials}
            </Avatar>

            <Box
              flex={1}
              textAlign={{ xs: "center", sm: "left" }}
              pb={1}
            >
              <Typography variant="h5" fontWeight={700}>
                {employee.name}
              </Typography>

              <Typography color="text.secondary" mt={0.5}>
                {employee.position}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              pb={1}
            >
              <Chip
                icon={<VerifiedUserRounded />}
                label={employee.status}
                color={getStatusColor(employee.status)}
                size="small"
              />

              <Chip
                label={employee.role}
                variant="outlined"
                size="small"
              />
            </Stack>
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
                      md={section.fields.length === 3 ? 4 : 3}
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

                      {field.editable && isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={phone}
                          onChange={(event) =>
                            setPhone(event.target.value)
                          }
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <Typography
                          fontWeight={600}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {field.value || "Not available"}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MemberProfile;