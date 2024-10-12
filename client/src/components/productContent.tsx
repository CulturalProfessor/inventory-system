import { Box, Typography, Modal, Button } from "@mui/material";
import { useState } from "react";
import { Product, addNewProduct } from "../utils/api";
import PaginatedTable from "./paginatedTable";

export default function ProductContent({
  pathname,
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

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      setError(null);
      const { product } = (await addNewProduct(productDetails)) as {
        product: Product;
      };
      setProducts([...products, product]);
      setShowModal(false);
    } catch (err) {
      setError("Failed to add product. Please try again.");
    }
  };

  const columns = [
    { id: "_id", label: "Product ID" },
    { id: "store", label: "Store" },
    { id: "dept", label: "Department" },
    { id: "size", label: "Size" },
    { id: "type", label: "Type" },
    {
      id: "date",
      label: "Date",
      format: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  const getLink = (row: { _id: string }) => `/dashboard/products/${row._id}`;

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
      <Typography variant="h4">Dashboard content for {pathname}</Typography>

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
            Add a New Product
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <input
              type="number"
              name="store"
              placeholder="Store"
              value={productDetails.store}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="dept"
              placeholder="Department"
              value={productDetails.dept}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="size"
              placeholder="Size"
              value={productDetails.size}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="type"
              placeholder="Type"
              value={productDetails.type}
              onChange={handleInputChange}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
        <Button onClick={() => setShowModal(true)}>Add Product</Button>
      </Box>

      <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
        {products.length === 0 ? (
          <Typography>No products available.</Typography>
        ) : (
          <PaginatedTable columns={columns} data={products} getLink={getLink} />
        )}
      </Box>
    </Box>
  );
}
