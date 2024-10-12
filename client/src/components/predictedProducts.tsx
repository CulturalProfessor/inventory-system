import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PaginatedTable from "../components/paginatedTable";
import { predictProduct, ProductToPredict } from "../utils/api"; // API function to call prediction service

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
  pathname,
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
    format?: (value: any) => string;
  }[] = [
    { id: "_id", label: "Product ID" },
    { id: "store", label: "Store" },
    { id: "dept", label: "Department" },
    { id: "size", label: "Size" },
    { id: "type", label: "Type" },
    { id: "predictedSales", label: "Predicted Sales" },
    {
      id: "date",
      label: "Date",
      format: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  const getLink = (row: { _id: string }) =>
    `/dashboard/predicted-products/${row._id}`;

  useEffect(() => {
    async function fetchPredictedProducts() {
      try {
        const productsToPredict: ProductToPredict[] = products.map(
          (product) => ({
            ...product,
            isholiday: 0,
            week: 1,
            year: 2012,
          })
        );

        const response = await predictProduct(productsToPredict);
        const updatedProducts = predictedProducts.map((product, index) => ({
          ...product,
          predictedSales: response.data.predicted_sales[index],
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
      <Typography variant="h4">Dashboard content for {pathname}</Typography>
      <Box sx={{ mt: 4, width: "100%", maxWidth: 800 }}>
        {predictedProducts.length === 0 ? (
          <Typography>No predicted products available.</Typography>
        ) : (
          <PaginatedTable<PredictedProduct>
            columns={columns}
            data={predictedProducts}
            getLink={getLink}
          />
        )}
      </Box>
    </Box>
  );
}

export default PredictedProductContent;
