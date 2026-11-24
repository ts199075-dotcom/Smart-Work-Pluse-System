import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563EB",
  subtitle,
  valueFormatter,
}) {
  const displayValue = valueFormatter
    ? valueFormatter(value)
    : value;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>

            <Typography variant="h4" fontWeight={700} mt={1}>
              {displayValue}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: `${color}15`,
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}