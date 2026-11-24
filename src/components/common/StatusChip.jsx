import { Chip } from "@mui/material";

const STATUS_COLORS = {
  Present: "success",
  Active: "success",
  Approved: "success",
  Paid: "success",

  Late: "warning",
  Pending: "warning",
  "On Leave": "warning",

  Absent: "error",
  Rejected: "error",

  Inactive: "default",
};

export default function StatusChip({
  status,
  label,
  color,
  size = "small",
  variant = "filled",
  sx = {},
}) {
  const displayLabel = label ?? status;
  const statusColor = color ?? STATUS_COLORS[status] ?? "default";

  return (
    <Chip
      label={displayLabel}
      color={statusColor}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 600,
        ...sx,
      }}
    />
  );
}