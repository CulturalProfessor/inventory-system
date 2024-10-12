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
import { registerUser, loginUser } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../hooks/useUser";
import imageCompression from "browser-image-compression";

const MAX_IMAGE_SIZE_MB = 0.1 * 1024 * 1024;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileSize", "File size exceeds limit", (value) => {
      if (!value) return false;
      return (value as File).size <= MAX_IMAGE_SIZE_MB;
    }),
});

interface FormValues {
  username: string;
  password: string;
  email: string;
  image: File | undefined;
}

const initialValues: FormValues = {
  username: "",
  password: "",
  email: "",
  image: undefined,
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    const reader = new FileReader();
    reader.readAsDataURL(values.image as Blob);
    reader.onload = async () => {
      try {
        const imageBase64 = reader.result as string;

        await registerUser({
          username: values.username,
          password: values.password,
          email: values.email,
          image: imageBase64,
        });

        const loginResponse = await loginUser({
          username: values.username,
          password: values.password,
        });

        login(
          {
            id: loginResponse.user._id,
            username: values.username,
            email: values.email,
            image: imageBase64,
          },
          loginResponse.token
        );

        navigate("/dashboard");
      } catch (error) {
        console.error("Error registering user:", error);
        const errorMessage =
          (error as Error).message || "An unexpected error occurred.";
        enqueueSnackbar(errorMessage, { variant: "error" });
        resetForm();
      }
    };
  };

  const handleImageCompression = async (
    file: File,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const options = {
      maxSizeMB: MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > MAX_IMAGE_SIZE_MB) {
        enqueueSnackbar(`Image exceeds size limit after compression.`, {
          variant: "error",
        });
        return;
      }

      setFieldValue("image", compressedFile);
    } catch (error) {
      setFieldValue("image", undefined);
      enqueueSnackbar("Error compressing image", { variant: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign Up
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched, values }) => (
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

              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  helperText={<ErrorMessage name="email" component="div" />}
                  error={touched.email && !!errors.email}
                />
              </Box>

              <Box mb={2}>
                <input
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={async (event) => {
                    if (event.currentTarget.files) {
                      const file = event.currentTarget.files[0];
                      await handleImageCompression(file, setFieldValue);
                    }
                  }}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    fullWidth
                    color="primary"
                  >
                    Upload File
                  </Button>
                </label>
                <ErrorMessage name="image" component="div" />
                {values.image && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {values.image.name}
                  </Typography>
                )}
              </Box>
              <Box mb={2} textAlign="center">
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Have an account?{" "}
                  <Link
                    to="/signin"
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    SignIn
                  </Link>
                </Typography>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={
                  !values.image ||
                  !values.username ||
                  !values.password ||
                  !values.email
                }
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default SignUp;
