import { createTheme } from '@mui/material/styles';
import { CAO_THANG_COLORS } from './colors';

// Tạo theme Material UI với màu sắc Cao Thắng
export const theme = createTheme({
  palette: {
    primary: {
      main: CAO_THANG_COLORS.primary,
      light: CAO_THANG_COLORS.light,
      dark: CAO_THANG_COLORS.primary,
      contrastText: '#fff',
    },
    secondary: {
      main: CAO_THANG_COLORS.secondary,
      light: CAO_THANG_COLORS.accent,
      dark: CAO_THANG_COLORS.secondary,
      contrastText: '#fff',
    },
    error: {
      main: CAO_THANG_COLORS.error,
    },
    warning: {
      main: CAO_THANG_COLORS.warning,
    },
    info: {
      main: CAO_THANG_COLORS.info,
    },
    success: {
      main: CAO_THANG_COLORS.success,
    },
    text: {
      primary: CAO_THANG_COLORS.text.primary,
      secondary: CAO_THANG_COLORS.text.secondary,
    },
    background: {
      default: CAO_THANG_COLORS.background,
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.accent})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${CAO_THANG_COLORS.primary}, ${CAO_THANG_COLORS.light})`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': {
              borderColor: CAO_THANG_COLORS.accent,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: CAO_THANG_COLORS.secondary,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: CAO_THANG_COLORS.secondary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
}); 