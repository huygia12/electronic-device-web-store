import Products from "./Products.tsx";
import Intro from "./Intro.tsx";
import Dashboard from "./Dashboard.tsx";
import UserManagement from "./UserManagement.tsx";
import CategoryManagement from "./CategoryManagement.tsx";
import { ProductManagement } from "./ProductManagement.tsx";
import OrderManagement from "./OrderManagement.tsx";
import ReviewManagement from "./ReviewManagement.tsx";
import StoreManagement from "./StoreManagement.tsx";
import ProviderManagement from "./ProviderManagement.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import { ClientLayout } from "@/layout/clientLayout.tsx";
import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./PageNotFound.tsx";
import AdminLayout from "@/layout/adminLayout.tsx";
import { ProductAddition } from "./ProductAddition.tsx";
import AttributeManagement from "./AttributeManagement.tsx";
import loader from "@/api/preApiLoader.ts";
import { ProductEdittion } from "./ProductEdittion.tsx";
import Homepage from "./Homepage.tsx";
import { PhasesLayout } from "../layout/cartPhasesLayout.tsx";
import ProductDetail from "./ProductDetail.tsx";
import { CartVisting } from "./CartVisting.tsx";
import { CartCheckout } from "./CartCheckout.tsx";
import InvoicesLookup from "./InvoicesLookup.tsx";
import MyInvoices from "./MyInvoices.tsx";
import { ProtectedRoute } from "@/components/container/protectedRoute.tsx";
import Unauthorized from "./Unauthorized.tsx";

const publicRoutes = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "intro",
        element: <Intro />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: ":id",
            id: "product_detail",
            loader: loader.getProductDetail,
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: "orders",
        id: "my_invoices",
        // loader: loader.getOrders,
        element: (
          <ProtectedRoute>
            <MyInvoices />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: <PhasesLayout />,
        children: [
          {
            path: "view",
            element: <CartVisting />,
          },
          {
            path: "checkout",
            element: (
              <ProtectedRoute>
                <CartCheckout />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "lookup",
        element: <InvoicesLookup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        id: "user_management",
        loader: loader.getUsers,
        element: <UserManagement />,
      },
      {
        path: "categories",
        id: "category_management",
        loader: loader.getCategories,
        element: <CategoryManagement />,
      },
      {
        path: "orders",
        id: "invoice_management",
        loader: loader.getOrders,
        element: <OrderManagement />,
      },
      {
        path: "reviews",
        element: <ReviewManagement />,
      },
      {
        path: "store",
        element: <StoreManagement />,
      },
      {
        path: "providers",
        id: "provider_management",
        loader: loader.getProviders,
        element: <ProviderManagement />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            id: "product_management",
            loader: loader.getProducts,
            element: <ProductManagement />,
          },
          {
            path: ":id",
            id: "product_edition",
            loader: loader.getProductDetail,
            element: <ProductEdittion />,
          },
          {
            path: "add",
            element: <ProductAddition />,
          },
          {
            path: "attributes",
            id: "attribute_management",
            loader: loader.getAttributes,
            element: <AttributeManagement />,
          },
        ],
      },
    ],
  },
]);

export { publicRoutes };
