import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NotFound from "./components/NotFound";
import ShopContainer from "./components/ShopContainer";
import OrderPlaceCard from "./components/OrderPlaceCard";
import POSContextWrapper from "./contexts/PosContext";
import OrderList from "./components/OrderList";
import StockInfoTable from "./components/StockInfoTable";
import MandirOrder from "./components/Mandir/MandirOrder";
import OrderForm from "./components/OrderBook/OrderForm";
import OrderFormCards from "./components/OrderBook/OrderFormCards";
import StoreBulkOrder from "./components/StoreBulkOrder";
import ManageItems from "./components/ManageItems";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: ShopContainer,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "orders",
        Component: OrderPlaceCard,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "orderList",
            Component: OrderList,
          },
          {
            path: "stock",
            Component: StockInfoTable,
          },
          {
            path: "mandir",
            Component: MandirOrder,
          },
          {
            path: "orderForm",
            Component: OrderForm,
          },
          {
            path: "orderCard",
            Component: OrderFormCards,
          },
          {
            path: "store",
            Component: StoreBulkOrder,
          },
          {
            path: "manage-items",
            Component: ManageItems,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <POSContextWrapper>
      <RouterProvider router={router} />
    </POSContextWrapper>
  </React.StrictMode>
);

reportWebVitals();
