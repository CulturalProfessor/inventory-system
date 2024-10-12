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
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
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
  const [session, setSession] = useState<Session | null>({
    user: {
      name: user?.username,
      email: user?.email,
      image: user?.image,
    },
  });
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
  }, [logout, navigate, user?.email, user?.image, user?.username]);

  useEffect(() => {
    fetchProducts().then((fetchedProducts) => {
      setProducts(fetchedProducts);
    });
  }, [pathname]);

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
      <DashboardLayout>
        {pathname.includes("predicted-products") ? (
          <PredictedProductContent
            pathname={pathname}
            products={products}
          />
        ) : (
          <ProductContent
            pathname={pathname}
            products={products}
            setProducts={setProducts}
          />
        )}
      </DashboardLayout>
    </AppProvider>
  );
}
