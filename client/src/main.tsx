import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/dashboard"; // Main dashboard component
import SignUp from "./pages/signup";
import Login from "./pages/signin";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { UserProvider } from "./hooks/useUser";
import SignOut from "./components/signout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
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
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />{" "}
            {/* You may want to set this as your main page */}
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signout" element={<SignOut />} />
            <Route path="/dashboard" element={<App />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SnackbarProvider>
  </ThemeProvider>
);
