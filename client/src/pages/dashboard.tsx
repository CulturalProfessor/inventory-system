import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Session, Router, Navigation } from "@toolpad/core";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import PredictedProductContent from "../components/predictedProducts";
import ProductContent from "../components/productContent";
import { fetchProducts } from "../utils/api";
import { Box, Typography, Button } from "@mui/material";
import UploadCSV from "../components/uploadCSV";
import DashboardAnalytics from "../components/dashboardAnalytics";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "products",
    title: "Products",
    icon: <DashboardIcon />,
  },
  {
    segment: "predicted-products",
    title: "Predicted Products",
    icon: <OnlinePredictionIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "upload-inventory-data",
    title: "Upload Inventory Data",
    icon: <LayersIcon />,
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      // {
      //   segment: "traffic",
      //   title: "Traffic",
      //   icon: <DescriptionIcon />,
      // },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface Product {
  _id: string;
  store: number;
  dept: number;
  size: number;
  type: number;
  date: string;
}

export default function DashboardLayoutBasic() {
  const { user, logout } = useUser();
  const [session, setSession] = useState<Session | null>(
    user
      ? {
          user: {
            name: user?.username,
            email: user?.email,
            image: user?.image,
          },
        }
      : null
  );
  const [pathname, setPathname] = useState("/dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const renderAccordingToPath = () => {
    if (pathname.includes("predicted-products")) {
      return (
        <PredictedProductContent pathname={pathname} products={products} />
      );
    } else if (pathname.includes("upload-inventory-data")) {
      return <UploadCSV />;
    } else if (pathname.includes("reports")) {
      if (pathname.includes("sales")) {
        return <DashboardAnalytics products={products} />;
      }
    } else {
      return (
        <ProductContent
          pathname={pathname}
          products={products}
          setProducts={setProducts}
        />
      );
    }
  };

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: user?.username,
            email: user?.email,
            image: user?.image,
          },
        });
      },
      signOut: () => {
        setSession(null);
        logout();
        navigate("/signin");
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session) {
      fetchProducts().then((fetchedProducts) => {
        setProducts(fetchedProducts);
      });
    }
  }, [pathname, session]);

  if (!session) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          padding: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            padding: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You are signed out. Please sign in to continue accessing your
            dashboard.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/signin")}
            sx={{
              mt: 3,
              px: 5,
              py: 1.5,
              borderRadius: "20px",
              textTransform: "none",
            }}
          >
            Sign In
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      session={session}
      theme={demoTheme}
      authentication={authentication}
      branding={{
        logo: (
          <img
            src="https://avatars.githubusercontent.com/u/92238941?v=4"
            alt="Inventory Manager Logo"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              marginRight: "8px",
            }}
          />
        ),
        title: "Inventory Manager",
      }}
    >
      <DashboardLayout>{renderAccordingToPath()}</DashboardLayout>
    </AppProvider>
  );
}
