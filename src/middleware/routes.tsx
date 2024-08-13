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
  // ProductAddition,
  ProductDetail,
  // ProductEdittion,
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
  attributeApis,
  getOrders,
  productApis,
  providerApis,
  userApis,
} from "@/services/apis";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import { Role } from "@/utils/constants";
import { AuthProvider } from "@/context";
import categoryApis from "@/services/apis/category";
import PreventedRoute from "./prevented-route";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <UserLayout />
      </AuthProvider>
    ),
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
            loader: productApis.getProductFullJoin,
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
        element: (
          <PreventedRoute>
            <Login />
          </PreventedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PreventedRoute>
            <Signup />
          </PreventedRoute>
        ),
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
      <AuthProvider>
        <ProtectedRoute allowedRoles={[Role.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      </AuthProvider>
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
        loader: userApis.getUsers,
        element: <UserManagement />,
      },
      {
        path: "categories",
        id: "category_management",
        loader: categoryApis.getCategories,
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
        loader: providerApis.getProviders,
        element: <ProviderManagement />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            id: "product_management",
            loader: productApis.getProductsSummary,
            element: <ProductManagement />,
          },
          // {
          //   path: ":id",
          //   id: "product_edition",
          //   loader: productApis.getProductFullJoin,
          //   element: <ProductEdittion />,
          // },
          {
            path: "add",
            element: <ProductAddition />,
          },
          {
            path: "attributes",
            id: "attribute_management",
            loader: attributeApis.getAttributes,
            element: <AttributeManagement />,
          },
        ],
      },
    ],
  },
]);

export default routes;
