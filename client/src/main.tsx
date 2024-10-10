// index.tsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/dashboard";
import SignUp from "./pages/signup";
import Login from "./pages/signin";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize the primary color
    },
    success: {
      main: "#4caf50", // Customize success color
    },
    error: {
      main: "#f44336", // Customize error color
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={"helpp"} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<App />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  </ThemeProvider>
);
