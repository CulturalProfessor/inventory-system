import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useMemo, useEffect, useState } from "react";
import { Product, ProductToPredict } from "../utils/commonTypes";
import { predictProduct } from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardAnalyticsProps {
  products: Product[];
}

export default function DashboardAnalytics({
  products,
}: DashboardAnalyticsProps) {
  const [predictedSales, setPredictedSales] = useState<number[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const productsToPredict: ProductToPredict[] = products.map((product) => ({
        ...product,
        isholiday: 0,
        week: 1,
        year: 2021,
      }));

      try {
        const response = await predictProduct(productsToPredict);
        setPredictedSales(response.predicted_sales);
      } catch (error) {
        console.error("Error fetching predicted sales:", error);
      }
    };

    if (products.length > 0) {
      fetchPredictions();
    }
  }, [products]);

  // Memoized Pie chart data
  const pieChartData = useMemo(() => {
    const storeSales = products.reduce(
      (acc, product, index) => {
        const storeLabel = `Store ${product.store}`;
        if (!acc[storeLabel]) {
          acc[storeLabel] = 0;
        }
        acc[storeLabel] += predictedSales[index];
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      labels: Object.keys(storeSales),
      datasets: [
        {
          label: "Sales Distribution by Store",
          data: Object.values(storeSales),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };
  }, [products, predictedSales]);

  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: { label: unknown; raw: unknown }) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
  };

  // Memoized Grouped Bar Chart Data
  const groupedBarChartData = useMemo(() => {
    const labels = products.map((_product, index) => `Product ${index}`);
    return {
      labels,
      datasets: [
        {
          label: "Actual Sales",
          data: products.map((product) => product.size),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
        {
          label: "Predicted Sales",
          data: predictedSales,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }, [products, predictedSales]);

  const groupedBarChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Memoized Line Chart Data
  const lineChartData = useMemo(() => {
    return {
      labels: products.map((_product, index) => `Product ${index}`),
      datasets: [
        {
          label: "Predicted Sales",
          data: predictedSales,
          fill: false,
          borderColor: "#742774",
          backgroundColor: "#742774",
          borderWidth: 2,
        },
      ],
    };
  }, [products, predictedSales]);

  const lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  // Memoized bar chart data
  const barChartData = useMemo(() => {
    return {
      labels: products.map((_product, index) => `Product ${index}`),
      datasets: [
        {
          label: "Product Sizes by Department",
          data: products.map((product) => product.size),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [products]);
  // Chart options
  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Sales Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Sizes by Department
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                height: 300,
              }}
            >
              <Bar
                data={groupedBarChartData}
                options={groupedBarChartOptions}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Predicted Sales Trend (2024)
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                height: 300,
              }}
            >
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Distribution by Store
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                height: 300,
                margin: "0 auto",
              }}
            >
              <Pie
                data={pieChartData}
                options={pieChartOptions}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Sizes by Department
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                height: 300,
              }}
            >
              <Bar data={barChartData} options={barChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
