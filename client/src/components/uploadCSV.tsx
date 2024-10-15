import { useState } from "react";
import { Button, Box, Typography, LinearProgress, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadCSV } from "../utils/api";

const UploadCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await uploadCSV(formData);
      if (response.data.success) {
        setSuccessMessage(
          "File uploaded successfully: " + response.data.message
        );
      } else {
        setErrorMessage("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      m={2}
      border="1px solid #ddd"
      borderRadius="10px"
      width="400px"
      mx="auto"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
    >
      <Typography variant="h6" mb={2} color="primary">
        Upload Historical Inventory Data
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2, padding: "10px 20px" }}
        >
          Select File
        </Button>
      </label>

      {file && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Selected file: {file.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading}
        fullWidth
        sx={{ padding: "10px 20px" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>

      {uploading && <LinearProgress sx={{ width: "100%", mt: 2 }} />}
    </Box>
  );
};

export default UploadCSV;
