import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PaginatedTable from "../components/paginatedTable";
import { predictProduct } from "../utils/api"; // API function to call prediction service
import { ProductToPredict } from "../utils/commonTypes";
import { TableCell } from "@mui/material";

interface Product {
  _id: string;
  store: number;
  dept: number;
  size: number;
  type: number;
  date: string;
}

interface PredictedProduct extends Product {
  predictedSales: number;
}

function PredictedProductContent({
  products,
}: {
  pathname: string;
  products: Product[];
}) {
  const [predictedProducts, setPredictedProducts] = useState<
    PredictedProduct[]
  >([]);

  const columns: {
    id: keyof PredictedProduct;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format?: (value: any, row: PredictedProduct) => React.ReactNode;
  }[] = [
    { id: "_id", label: "Product ID" },
    { id: "store", label: "Store" },
    { id: "dept", label: "Department" },
    { id: "type", label: "Type" },
    { id: "size", label: "Size" },
    {
      id: "predictedSales",
      label: "Predicted Sales",
      format: (value: number, row: PredictedProduct) => (
        <TableCell
          sx={{
            color: value > row.size ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {value}
        </TableCell>
      ),
    },
    {
      id: "date",
      label: "Date",
      format: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    async function fetchPredictedProducts() {
      try {
        const productsToPredict: ProductToPredict[] = products.map(
          (product) => ({
            ...product,
            isholiday: 0,
            week: 1,
            year: 2021,
          })
        );

        const response = await predictProduct(productsToPredict);
        const updatedProducts = products.map((product, index) => ({
          ...product,
          predictedSales: response.predicted_sales[index],
        }));
        setPredictedProducts(updatedProducts);
      } catch (error) {
        console.error("Failed to fetch predicted products:", error);
      }
    }

    fetchPredictedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Typography variant="h4">Predicted Products</Typography>
      <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
        {predictedProducts.length === 0 ? (
          <Typography>No predicted products available.</Typography>
        ) : (
          <PaginatedTable<PredictedProduct>
            columns={columns}
            data={predictedProducts}
          />
        )}
      </Box>
    </Box>
  );
}

export default PredictedProductContent;
