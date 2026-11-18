import { Box, Typography, Paper } from "@mui/material";

function PlaceholderPage({ title = "Coming Soon" }) {
  return (
    <Box>
      <Typography variant="h3" mb={3}>
        {title}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Typography color="text.secondary">
          This page is under development.
        </Typography>
      </Paper>
    </Box>
  );
}

export default PlaceholderPage;