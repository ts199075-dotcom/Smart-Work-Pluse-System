import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

/**
 * Shared KPI / summary card used across Admin, HR, Member, and Team Leader.
 * Accepts aliases so existing call sites can migrate with minimal changes:
 * - subtitle | description
 * - bgColor | bg | background
 */
function StatCard({
  title,
  value,
  subtitle,
  description,
  icon,
  color = "#2563EB",
  bgColor,
  bg,
  background,
  iconPosition = "end",
  hover = true,
  sx = {},
}) {
  const resolvedSubtitle = subtitle ?? description ?? "";
  const resolvedBg = bgColor || bg || background || "#EFF6FF";
  const isStart = iconPosition === "start";

  const iconNode = (
    <Avatar
      variant="rounded"
      sx={{
        bgcolor: resolvedBg,
        color,
        width: isStart ? 42 : 48,
        height: isStart ? 42 : 48,
        borderRadius: isStart ? 1.5 : 2.5,
        flexShrink: 0,
      }}
    >
      {icon}
    </Avatar>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        minWidth: 0,
        transition: hover ? "all 0.25s ease" : undefined,
        ...(hover
          ? {
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
              },
            }
          : {}),
        ...sx,
      }}
    >
      <Stack
        direction="row"
        justifyContent={isStart ? "flex-start" : "space-between"}
        alignItems="center"
        spacing={isStart ? 1.5 : 0}
      >
        {isStart && iconNode}

        <Box minWidth={0}>
          <Typography
            color="text.secondary"
            fontSize={isStart ? 12 : 13}
            fontWeight={isStart ? 400 : 600}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={isStart ? 700 : 800}
            color={isStart ? "text.primary" : "#17365D"}
            sx={{ mt: isStart ? 0 : 1 }}
          >
            {value}
          </Typography>

          {resolvedSubtitle ? (
            <Typography
              fontSize={11}
              color="text.secondary"
              sx={{ mt: isStart ? 0 : 0.8 }}
            >
              {resolvedSubtitle}
            </Typography>
          ) : null}
        </Box>

        {!isStart && iconNode}
      </Stack>
    </Paper>
  );
}

export default StatCard;
