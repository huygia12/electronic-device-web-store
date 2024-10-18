import { AdminLayout, PhasesLayout, UserLayout } from "@/layout";
import {
  AttributeManagement,
  CartCheckout,
  CartVisiting,
  CategoryManagement,
  Dashboard,
  EditProfile,
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
  FilteredProductList,
  ProviderManagement,
  Signup,
  StoreManagement,
  Unauthorized,
  UserManagement,
} from "@/pages";
import {
  attributeService,
  invoiceService,
  productService,
  providerService,
  statisticService,
  storeService,
  userService,
} from "@/services";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import { Role } from "@/types/enum";
import { AuthProvider } from "@/context";
import categoryService from "@/services/category";
import PreventLoginUserRoute from "./prevent-login-user-route";

const routes = createBrowserRouter([
  {
    path: "/",
    id: "userlayout",
    loader: storeService.apis.getStore,
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
            element: <FilteredProductList />,
          },
          {
            path: ":id",
            id: "product_detail",
            loader: productService.apis.getProductFullJoin,
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            path: ":id",
            children: [
              {
                index: true,
                id: "user_profile",
                loader: userService.apis.getUser,
                element: (
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                ),
              },
              {
                path: "orders",
                id: "user_invoices",
                loader: invoiceService.apis.getMyInvoices,
                element: (
                  <ProtectedRoute>
                    <PersonalInvoice />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
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
          <PreventLoginUserRoute>
            <Login />
          </PreventLoginUserRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PreventLoginUserRoute>
            <Signup />
          </PreventLoginUserRoute>
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
        id: "dash_board",
        loader: statisticService.apis.getStatistic,
        element: <Dashboard />,
      },
      {
        path: "users",
        id: "user_management",
        loader: userService.apis.getUsers,
        element: <UserManagement />,
      },
      {
        path: "categories",
        id: "category_management",
        loader: categoryService.apis.getCategories,
        element: <CategoryManagement />,
      },
      {
        path: "invoices",
        id: "invoice_management",
        loader: invoiceService.apis.getInvoices,
        element: <OrderManagement />,
      },
      {
        path: "store",
        id: "store_management",
        loader: storeService.apis.getStore,
        element: <StoreManagement />,
      },
      {
        path: "providers",
        id: "provider_management",
        loader: providerService.apis.getProviders,
        element: <ProviderManagement />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            id: "product_management",
            loader: productService.apis.getProductsSummary,
            element: <ProductManagement />,
          },
          {
            path: ":id",
            id: "product_edition",
            loader: productService.apis.getProductFullJoin,
            element: <ProductEdittion />,
          },
          {
            path: "add",
            element: <ProductAddition />,
          },
          {
            path: "attributes",
            id: "attribute_management",
            loader: attributeService.apis.getAttributes,
            element: <AttributeManagement />,
          },
        ],
      },
    ],
  },
]);

export default routes;
