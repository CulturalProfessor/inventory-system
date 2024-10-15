import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  Grid,
  Alert,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import {
  addNewProduct,
  updateProduct,
  deleteProduct,
  addBulkProductsWithCSV,
} from "../utils/api";
import PaginatedTable from "./paginatedTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Column, Product } from "../utils/commonTypes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";

export default function ProductContent({
  products,
  setProducts,
}: {
  pathname: string;
  products: Product[];
  setProducts: (products: Product[]) => void;
}) {
  const [showProductModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState({
    store: 0,
    dept: 0,
    size: 0,
    type: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddOrUpdateProduct = async () => {
    try {
      setError(null);
      setLoading(true);
      if (editMode && selectedProduct) {
        await updateProduct({ _id: selectedProduct._id, ...productDetails });
        setProducts(
          products.map((p) =>
            p._id === selectedProduct._id ? { ...p, ...productDetails } : p
          )
        );
      } else {
        const { product } = (await addNewProduct(productDetails)) as {
          product: Product;
        };
        setProducts([...products, product]);
      }
      setShowModal(false);
    } catch (err) {
      setError(
        editMode ? "Failed to update product." : "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await deleteProduct({ _id: productId });
      if (response.deleted) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        setError("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductDetails({
      store: product.store,
      dept: product.dept,
      size: product.size,
      type: product.type,
    });
    setSelectedProduct(product);
    setEditMode(true);
    setShowModal(true);
  };

  const handleOpenAddModal = () => {
    setProductDetails({ store: 0, dept: 0, size: 0, type: 0 });
    setEditMode(false);
    setShowModal(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSuccessMessage("");
      handleUploadCSV(selectedFile);
    }
  };

  const handleUploadCSV = async (file: File) => {
    setUploading(true);
    setSuccessMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await addBulkProductsWithCSV(formData);
      console.log("Response:", response);
      if (response.success) {
        setProducts([...products, ...response.products]);
        setSuccessMessage("File uploaded successfully.");
        enqueueSnackbar("File uploaded successfully.", { variant: "success" });
      } else {
        enqueueSnackbar("Error uploading file.", { variant: "error" });
        setUploading(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      enqueueSnackbar("Error uploading file.", { variant: "error" });
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      id: "_id",
      label: "Product ID",
      format: (value: string | number) => String(value),
    },
    {
      id: "store",
      label: "Store",
      format: (value: string | number) => String(value),
    },
    {
      id: "dept",
      label: "Department",
      format: (value: string | number) => String(value),
    },
    {
      id: "size",
      label: "Size",
      format: (value: string | number) => String(value),
    },
    {
      id: "type",
      label: "Type",
      format: (value: string | number) => String(value),
    },
    {
      id: "date",
      label: "Date",
      format: (value: string | number | Date) =>
        new Date(value).toLocaleDateString().toString(),
    },
    {
      id: "actions" as keyof Product,
      label: "Actions",
      format: (_value: unknown, row: Product) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEditProduct(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Modal open={showProductModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            {editMode ? "Update Product" : "Add a New Product"}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Store"
                type="number"
                name="store"
                value={productDetails.store}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Department"
                type="number"
                name="dept"
                value={productDetails.dept}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Size"
                type="number"
                name="size"
                value={productDetails.size}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type"
                type="number"
                name="type"
                value={productDetails.type}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddOrUpdateProduct}
              disabled={loading}
              fullWidth
            >
              {loading
                ? "Processing..."
                : editMode
                  ? "Update Product"
                  : "Add Product"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowModal(false)}
              fullWidth
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 800,
          mb: 3,
        }}
      >
        <Typography variant="h5">Product List</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddModal}
            sx={{ mr: 2 }}
          >
            Add Product
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="bulk-upload-button"
          />
          <label htmlFor="bulk-upload-button">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Bulk Upload"}
            </Button>
          </label>
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
        {products.length === 0 ? (
          <Typography>No products available.</Typography>
        ) : (
          <PaginatedTable columns={columns} data={products} />
        )}
      </Box>
    </Box>
  );
}
