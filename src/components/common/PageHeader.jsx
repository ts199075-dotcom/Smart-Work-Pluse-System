import { Box, Stack, Typography } from "@mui/material";

/**
 * Shared page title row: title, optional subtitle, optional action slot.
 */
function PageHeader({ title, subtitle, action, sx = {} }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 3, ...sx }}
    >
      <Box minWidth={0}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="#17365D"
          sx={{ fontSize: { xs: 24, md: 30 } }}
        >
          {title}
        </Typography>

        {subtitle ? (
          <Typography
            color="text.secondary"
            fontSize={14}
            sx={{ mt: 0.7 }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
    </Stack>
  );
}

export default PageHeader;
