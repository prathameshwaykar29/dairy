import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import CustomersPage from "@/routes/customers/page";
import MonthlyBillPage from "@/routes/monthly-bill/page";
import MonthlyCustomersPage from "@/routes/monthly-customers/page";
import RatesPage from "@/routes/rates/page";

function App() {
  const router = createBrowserRouter([

    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "customers",
          element: <CustomersPage />,
        },
        {
          path: "monthly-customers",
          element: <MonthlyCustomersPage />,
        },
        {
          path: "monthly-bill",
          element: <MonthlyBillPage />,
        },
        {
          path: "rates",
          element: <RatesPage />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
