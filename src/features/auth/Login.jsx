import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Business,
} from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password, rememberMe);

      const destination = location.state?.from?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F7FB",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
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
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: "#17365D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
             <Business sx={{ color: "#FFFFFF", fontSize: 32 }} />
            </Box>
          </Box>

          {/* Heading */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              sx={{
                color: "#17365D",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Smart WorkSpace
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Welcome back! Sign in to access your workspace.
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mb: 1, color: "#172B4D" }}
            >
              Email Address
            </Typography>

            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 3 }}
            />

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ mb: 1, color: "#172B4D" }}
            >
              Password
            </Typography>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Remember me
                  </Typography>
                }
              />
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !email.trim() || !password}
              sx={{
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#17365D",
                fontWeight: 600,
                fontSize: 15,
                "&:hover": {
                  backgroundColor: "#102945",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            display="block"
            sx={{ mt: 4 }}
          >
            Smart WorkSpace Management System
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;