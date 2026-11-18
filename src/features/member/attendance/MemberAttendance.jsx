import {
  Box,
  Typography,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from "@mui/material";

import {
  CalendarMonthRounded,
  AccessTimeRounded,
  CheckCircleRounded,
  WarningRounded,
  CancelRounded,
  ScheduleRounded,
} from "@mui/icons-material";

import { useState } from "react";

// Sample attendance data
const attendanceData = {
  2: { status: "present", checkIn: "07:52 AM", checkOut: "05:00 PM", hours: "9h 08m" },
  3: { status: "present", checkIn: "07:48 AM", checkOut: "05:05 PM", hours: "9h 17m" },
  4: { status: "late", checkIn: "08:35 AM", checkOut: "05:00 PM", hours: "8h 25m" },
  5: { status: "present", checkIn: "07:55 AM", checkOut: "05:10 PM", hours: "9h 15m" },
  6: { status: "present", checkIn: "07:50 AM", checkOut: "05:00 PM", hours: "9h 10m" },
  9: { status: "absent", checkIn: "--", checkOut: "--", hours: "0h" },
  10: { status: "present", checkIn: "07:45 AM", checkOut: "05:00 PM", hours: "9h 15m" },
  11: { status: "late", checkIn: "08:42 AM", checkOut: "05:00 PM", hours: "8h 18m" },
  12: { status: "present", checkIn: "07:58 AM", checkOut: "05:00 PM", hours: "9h 02m" },
  13: { status: "present", checkIn: "07:51 AM", checkOut: "05:00 PM", hours: "9h 09m" },
  16: { status: "present", checkIn: "07:49 AM", checkOut: "05:00 PM", hours: "9h 11m" },
  17: { status: "absent", checkIn: "--", checkOut: "--", hours: "0h" },
  18: { status: "late", checkIn: "08:28 AM", checkOut: "05:00 PM", hours: "8h 32m" },
  19: { status: "present", checkIn: "07:53 AM", checkOut: "05:00 PM", hours: "9h 07m" },
  20: { status: "present", checkIn: "07:50 AM", checkOut: "05:00 PM", hours: "9h 10m" },
  23: { status: "present", checkIn: "07:55 AM", checkOut: "05:00 PM", hours: "9h 05m" },
  24: { status: "late", checkIn: "08:45 AM", checkOut: "05:00 PM", hours: "8h 15m" },
  25: { status: "present", checkIn: "07:52 AM", checkOut: "05:00 PM", hours: "9h 08m" },
  26: { status: "present", checkIn: "07:50 AM", checkOut: "05:00 PM", hours: "9h 10m" },
};

// Summary cards
const summaryCards = [
  {
    title: "Present Days",
    value: "20",
    icon: CheckCircleRounded,
    color: "#16A34A",
    background: "#DCFCE7",
  },
  {
    title: "Late Days",
    value: "6",
    icon: WarningRounded,
    color: "#D97706",
    background: "#FEF3C7",
  },
  {
    title: "Absent Days",
    value: "2",
    icon: CancelRounded,
    color: "#DC2626",
    background: "#FEE2E2",
  },
  {
    title: "Total Hours",
    value: "168h",
    icon: AccessTimeRounded,
    color: "#2563EB",
    background: "#DBEAFE",
  },
];

const statusStyles = {
  present: {
    background: "#DCFCE7",
    color: "#15803D",
    label: "Present",
  },
  late: {
    background: "#FEF3C7",
    color: "#B45309",
    label: "Late",
  },
  absent: {
    background: "#FEE2E2",
    color: "#B91C1C",
    label: "Absent",
  },
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MemberAttendance() {
  const [selectedDay, setSelectedDay] = useState(26);
  const [selectedMonth, setSelectedMonth] = useState("November 2026");

  const selectedRecord = attendanceData[selectedDay];

  // Build calendar days
  const firstDay = new Date(2026, 10, 1).getDay();
  const startingOffset = (firstDay + 6) % 7;

  const calendarDays = [
    ...Array(startingOffset).fill(null),
    ...Array.from({ length: 30 }, (_, index) => index + 1),
  ];

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
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
          <Typography variant="h3" mb={0.5}>
            My Attendance
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Track your monthly attendance and working hours.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <Select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            startAdornment={
              <CalendarMonthRounded
                sx={{ color: "#64748B", mr: 1, fontSize: 20 }}
              />
            }
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              fontSize: 13,
            }}
          >
            <MenuItem value="October 2026">October 2026</MenuItem>
            <MenuItem value="November 2026">November 2026</MenuItem>
            <MenuItem value="December 2026">December 2026</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    backgroundColor: card.background,
                    color: card.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </Box>

                <Box>
                  <Typography fontSize={12} color="text.secondary">
                    {card.title}
                  </Typography>

                  <Typography variant="h4" mt={0.3}>
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Calendar and Daily Details */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.6fr) minmax(280px, 1fr)",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        {/* Attendance Calendar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
            minWidth: 0,
          }}
        >
          <Typography variant="h5" mb={3}>
            Monthly Overview
          </Typography>

          {/* Calendar Weekdays */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 1,
              mb: 1.5,
            }}
          >
            {weekdays.map((day) => (
              <Typography
                key={day}
                textAlign="center"
                fontSize={12}
                fontWeight={600}
                color="text.secondary"
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {calendarDays.map((day, index) => {
              const record = day ? attendanceData[day] : null;
              const isSelected = day === selectedDay;
              const style = record ? statusStyles[record.status] : null;

              return (
                <Box
                  key={index}
                  onClick={() => day && setSelectedDay(day)}
                  sx={{
                    minHeight: { xs: 42, sm: 58 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    cursor: day ? "pointer" : "default",
                    backgroundColor: isSelected
                      ? "#2563EB"
                      : style
                        ? style.background
                        : "transparent",
                    color: isSelected
                      ? "#FFFFFF"
                      : style
                        ? style.color
                        : "#64748B",
                    border: isSelected
                      ? "2px solid #1D4ED8"
                      : "1px solid transparent",
                    fontWeight: isSelected || record ? 700 : 400,
                    fontSize: 13,
                    transition: "0.2s",
                    "&:hover": day
                      ? { borderColor: "#2563EB" }
                      : {},
                  }}
                >
                  {day}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Calendar Legend */}
          <Box display="flex" flexWrap="wrap" gap={2}>
            {Object.entries(statusStyles).map(([key, item]) => (
              <Box
                key={key}
                display="flex"
                alignItems="center"
                gap={0.8}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />

                <Typography fontSize={11} color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Daily Details */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "14px",
          }}
        >
          <Typography variant="h5" mb={1}>
            Daily Details
          </Typography>

          <Typography fontSize={12} color="text.secondary" mb={2.5}>
            {selectedMonth} · {selectedDay}
          </Typography>

          {selectedRecord ? (
            <>
              <Chip
                label={statusStyles[selectedRecord.status].label}
                size="small"
                sx={{
                  mb: 3,
                  backgroundColor:
                    statusStyles[selectedRecord.status].background,
                  color: statusStyles[selectedRecord.status].color,
                  fontWeight: 600,
                }}
              />

              {[
                {
                  label: "Check-in",
                  value: selectedRecord.checkIn,
                  icon: ScheduleRounded,
                },
                {
                  label: "Check-out",
                  value: selectedRecord.checkOut,
                  icon: AccessTimeRounded,
                },
                {
                  label: "Working Hours",
                  value: selectedRecord.hours,
                  icon: CalendarMonthRounded,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Box
                    key={item.label}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                    borderBottom="1px solid"
                    borderColor="divider"
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ fontSize: 19, color: "#64748B" }} />

                      <Typography fontSize={13} color="text.secondary">
                        {item.label}
                      </Typography>
                    </Box>

                    <Typography fontSize={13} fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Box>
                );
              })}
            </>
          ) : (
            <Typography color="text.secondary" fontSize={13}>
              No attendance record is available for this day.
            </Typography>
          )}

          <Box
            mt={3}
            p={2}
            borderRadius="10px"
            bgcolor="#F5F7FB"
          >
            <Typography fontSize={12} color="text.secondary">
              Select any day from the calendar to view its attendance
              information.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default MemberAttendance;