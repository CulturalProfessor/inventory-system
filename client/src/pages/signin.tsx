import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../hooks/useUser";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const initialValues = {
  username: "",
  password: "",
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const loginResponse = await loginUser(values);
      const { token, user } = loginResponse;
      login(
        {
          username: user.username,
          email: user.email,
          id: user._id,
          image: user.image,
        },
        token
      );
      navigate("/dashboard");
    } catch (error) {
      const customError = error as { message?: string };
      const errorMessage =
        customError.message || "An unexpected error occurred";
      enqueueSnackbar(errorMessage, { variant: "error" });
      console.error("Login failed:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  helperText={<ErrorMessage name="username" component="div" />}
                  error={touched.username && !!errors.username}
                />
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  variant="outlined"
                  helperText={<ErrorMessage name="password" component="div" />}
                  error={touched.password && !!errors.password}
                />
              </Box>
              <Box mb={2} textAlign="center">
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    SignUp
                  </Link>
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Login;
