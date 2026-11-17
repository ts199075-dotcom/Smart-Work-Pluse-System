import { createTheme } from "@mui/material/styles";
import colors from "./colors";
import typography from "./typography";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: "#FFFFFF",
    },

    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },

    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },

    success: {
      main: colors.status.success,
    },

    warning: {
      main: colors.status.warning,
    },

    error: {
      main: colors.status.error,
    },

    info: {
      main: colors.status.info,
    },

    divider: colors.border,

    brand: {
      navy: colors.primary.main,
      accent: colors.secondary.main,
    },

    attendance: {
      green: colors.attendance.green,
      blue: colors.attendance.blue,
      black: colors.attendance.black,
    },
  },

  typography,

  shape: {
    borderRadius: 14,
  },
});

export default theme;