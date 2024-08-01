import { AdminLayout, PhasesLayout, UserLayout } from "@/layout";
import {
  AttributeManagement,
  CartCheckout,
  CartVisiting,
  CategoryManagement,
  Dashboard,
  HomePage,
  Intro,
  InvoiceLookup,
  Login,
  OrderManagement,
  PageNotFound,
  PersonalInvoice,
  ProductAddition,
  ProductDetail,
  ProductEdittion,
  ProductManagement,
  Products,
  ProviderManagement,
  ReviewManagement,
  Signup,
  StoreManagement,
  Unauthorized,
  UserManagement,
} from "@/pages";
import {
  getAttributes,
  getCategories,
  getOrders,
  getProductDetail,
  getProducts,
  getProviders,
  getUsers,
} from "@/services/apis";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
            loader: getProductDetail,
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
            <PersonalInvoice />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: <PhasesLayout />,
        children: [
          {
            path: "view",
            element: <CartVisiting />,
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
        element: <InvoiceLookup />,
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
        loader: getUsers,
        element: <UserManagement />,
      },
      {
        path: "categories",
        id: "category_management",
        loader: getCategories,
        element: <CategoryManagement />,
      },
      {
        path: "orders",
        id: "invoice_management",
        loader: getOrders,
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
        loader: getProviders,
        element: <ProviderManagement />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            id: "product_management",
            loader: getProducts,
            element: <ProductManagement />,
          },
          {
            path: ":id",
            id: "product_edition",
            loader: getProductDetail,
            element: <ProductEdittion />,
          },
          {
            path: "add",
            element: <ProductAddition />,
          },
          {
            path: "attributes",
            id: "attribute_management",
            loader: getAttributes,
            element: <AttributeManagement />,
          },
        ],
      },
    ],
  },
]);

export default routes;
