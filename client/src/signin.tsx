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

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

// Initial form values
const initialValues = {
  username: "",
  password: "",
};

const Login: React.FC = () => {
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Data:", values);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
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
                  helperText={
                    <ErrorMessage name="username" component="div" />
                  }
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
                  helperText={
                    <ErrorMessage name="password" component="div" />
                  }
                  error={touched.password && !!errors.password}
                />
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
