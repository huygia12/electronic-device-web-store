import Announcement from "./Announcement.tsx";
import Products from "./Products.tsx";
import Intro from "./Intro.tsx";
import Homepage from "./Homepage.tsx";
import Recruitment from "./Recruitment.tsx";
import Dashboard from "./Dashboard.tsx";
import UserManagement from "./UserManagement.tsx";
import CategoryManagement from "./CategoryManagement.tsx";
import { ProductManagement } from "./ProductManagement.tsx";
import OrderManagement from "./OrderManagement.tsx";
import ReviewManagement from "./ReviewManagement.tsx";
import Statis from "./Statis.tsx";
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
import {
  attributesLoader,
  categoriesLoader,
  ordersLoader,
  productsLoader,
  providersLoader,
  usersLoader,
} from "@/api/preApiLoader.ts";
import { ProductEdittion } from "./ProductEdittion.tsx";

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
        element: <Products />,
      },
      {
        path: "recruitment",
        element: <Recruitment />,
      },
      {
        path: "announcement",
        element: <Announcement />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "managed-users",
        id: "user_management",
        loader: usersLoader,
        element: <UserManagement />,
      },
      {
        path: "managed-categories",
        id: "category_management",
        loader: categoriesLoader,
        element: <CategoryManagement />,
      },
      {
        path: "received-orders",
        id: "order_management",
        loader: ordersLoader,
        element: <OrderManagement />,
      },
      {
        path: "received-reviews",
        element: <ReviewManagement />,
      },
      {
        path: "statistic",
        element: <Statis />,
      },
      {
        path: "store",
        element: <StoreManagement />,
      },
      {
        path: "managed-providers",
        id: "provider_management",
        loader: providersLoader,
        element: <ProviderManagement />,
      },
      {
        path: "managed-products",
        children: [
          {
            index: true,
            id: "product_management",
            loader: productsLoader,
            element: <ProductManagement />,
          },
          {
            path: ":id",
            element: <ProductEdittion />,
          },
          {
            path: "add",
            element: <ProductAddition />,
          },
          {
            path: "attributes",
            id: "attribute_management",
            loader: attributesLoader,
            element: <AttributeManagement />,
          },
        ],
      },
    ],
  },
]);

const privateRoutes = [{}];

export { publicRoutes, privateRoutes };
