import { useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Business,
  Visibility,
  VisibilityOff,
  CloudUploadOutlined,
  ArrowBack,
  PersonAddAlt1Outlined,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { registerUser } from "../../services/authService";


const ROLE_OPTIONS = {
  admin: [
    { value: "Employee", label: "Employee" },
    { value: "manager", label: "Manager" },
    { value: "Hr", label: "HR" },
    { value: "Finance", label: "Finance" },
  ],
  hr: [
    { value: "Employee", label: "Employee" },
  ],
};

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  department: "",
  governorate: "",
  city: "",
  gender: "",
  role: "Employee",
};

const Register = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const allowedRoles = ROLE_OPTIONS[user?.role] || [];

  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image.",
      }));

      return;
    }

    setImage(selectedImage);

    setErrors((previous) => ({
      ...previous,
      image: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!form.department.trim()) {
      newErrors.department = "Department is required.";
    }

    if (!form.governorate.trim()) {
      newErrors.governorate = "Governorate is required.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!form.role) {
      newErrors.role = "Please select a role.";
    }

    if (!image) {
      newErrors.image = "Profile image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
        setLoading(true);

        const response = await registerUser(form, image);

        setSuccess(
        response?.message || "Account created successfully!"
        );

        // Reset form data
        setForm(initialForm);
        setImage(null);
        setErrors({});

        // Clear file input
        if (fileInputRef.current) {
        fileInputRef.current.value = "";
        }

        // Reset password visibility
        setShowPassword(false);
        setShowConfirmPassword(false);

    } catch (err) {
        console.error("Registration Error:", err);

        setError(
        err.message || "Something went wrong during registration."
        );
    } finally {
        setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state?.from?.pathname) {
      navigate(-1);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="md">

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            mb: 2,
            color: "#17365D",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Back
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "0 12px 40px rgba(23, 54, 93, 0.07)",
          }}
        >

          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: "#17365D",
              }}
            >
              <Business sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>

          {/* Heading */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              sx={{
                color: "#17365D",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Create New Account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Add a new member to your Smart WorkSpace.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
                {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            {/* Personal Information */}
            <Typography
              fontWeight={700}
              color="#17365D"
              fontSize={16}
              sx={{ mb: 2 }}
            >
              Personal Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2.2,
              }}
            >
              <TextField
                label="Full Name"
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleChange}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                fullWidth
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                fullWidth
              />

              <TextField
                select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                error={Boolean(errors.gender)}
                helperText={errors.gender}
                fullWidth
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Box>

            {/* Account Information */}
            <Typography
              fontWeight={700}
              color="#17365D"
              fontSize={16}
              sx={{ mt: 3.5, mb: 2 }}
            >
              Account Information
            </Typography>

            <Stack spacing={2.2}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 2.2,
                }}
              >
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Department"
                  name="department"
                  placeholder="Enter department"
                  value={form.department}
                  onChange={handleChange}
                  error={Boolean(errors.department)}
                  helperText={errors.department}
                  fullWidth
                />

                <TextField
                  select
                  label="User Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  error={Boolean(errors.role)}
                  helperText={errors.role}
                  fullWidth
                >
                  {allowedRoles.map((role) => (
                    <MenuItem
                      key={role.value}
                      value={role.value}
                    >
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Stack>

            {/* Location */}
            <Typography
              fontWeight={700}
              color="#17365D"
              fontSize={16}
              sx={{ mt: 3.5, mb: 2 }}
            >
              Location Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2.2,
              }}
            >
              <TextField
                label="Governorate"
                name="governorate"
                placeholder="Enter governorate"
                value={form.governorate}
                onChange={handleChange}
                error={Boolean(errors.governorate)}
                helperText={errors.governorate}
                fullWidth
              />

              <TextField
                label="City"
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleChange}
                error={Boolean(errors.city)}
                helperText={errors.city}
                fullWidth
              />
            </Box>

            {/* Profile Image */}
            <Typography
              fontWeight={700}
              color="#17365D"
              fontSize={16}
              sx={{ mt: 3.5, mb: 2 }}
            >
              Profile Image
            </Typography>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadOutlined />}
              fullWidth
              sx={{
                py: 2,
                borderRadius: 2,
                borderStyle: "dashed",
                borderColor: errors.image ? "#D32F2F" : "#CBD5E1",
                color: "#17365D",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {image ? image.name : "Upload Profile Image"}

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {errors.image && (
              <Typography
                color="error"
                fontSize={12}
                sx={{ mt: 0.7 }}
              >
                {errors.image}
              </Typography>
            )}

            {/* Submit */}
            <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<PersonAddAlt1Outlined />}
                sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#17365D",
                    fontWeight: 600,
                    fontSize: 15,
                    textTransform: "none",
                    "&:hover": {
                    backgroundColor: "#102945",
                    },
                }}
            >
                {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            display="block"
            sx={{ mt: 3 }}
          >
            Smart WorkSpace Management System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;