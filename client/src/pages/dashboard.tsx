import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Session, Router, Navigation } from "@toolpad/core";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../utils/api";
import PaginatedTable from "../components/paginatedTable";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
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

function DemoPageContent({
  pathname,
  products,
}: {
  pathname: string;
  products: Product[];
}) {
  const columns: {
    id: keyof Product;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format?: (value: any) => string;
  }[] = [
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
        {products.length === 0 ? (
          <Typography>No products available.</Typography>
        ) : (
          <PaginatedTable<Product> columns={columns} data={products} />
        )}
      </Box>
    </Box>
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProducts().then((fetchedProducts) => {
      console.log("Fetched products:", fetchedProducts);
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
        <DemoPageContent pathname={pathname} products={products} />{" "}
        {/* Pass products to the component */}
      </DashboardLayout>
    </AppProvider>
  );
}
