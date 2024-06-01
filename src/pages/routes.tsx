import Announcement from "./Announcement.tsx";
import Products from "./Products.tsx";
import Intro from "./Intro.tsx";
import Homepage from "./Homepage.tsx";
import Recruitment from "./Recruitment.tsx";
import PageNotFound from "./PageNotFound.tsx";
import { Fragment } from "react/jsx-runtime";
import Dashboard from "./Dashboard.tsx";
import AdminLayout from "@/layout/AdminLayout.tsx";
import UserManagement from "./UserManagement.tsx";
import CategoryManagement from "./CategoryManagement.tsx";
import { ProductManagement } from "./ProductManagement.tsx";
import OrderManagement from "./OrderManagement.tsx";
import ReviewManagement from "./ReviewManagement.tsx";
import Statis from "./Statis.tsx";
import StoreManagement from "./StoreManagement.tsx";
import ProviderManagement from "./ProviderManagement.tsx";
import Login from "./Login.tsx";
import signup from "./signup.tsx";
import AttributeManagement from "./AttributeManagement.tsx";
import { ProductAddition } from "./ProductAddition.tsx";

const publicRoutes = [
  {
    path: "/",
    element: Homepage,
  },
  {
    path: "/intro",
    element: Intro,
  },
  {
    path: "/products",
    element: Products,
  },
  {
    path: "/recruitment",
    element: Recruitment,
  },
  {
    path: "/announcement",
    element: Announcement,
  },
  {
    path: "/admin",
    element: Dashboard,
    layout: AdminLayout,
  },
  {
    path: "/admin/user",
    element: UserManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/category",
    element: CategoryManagement,
    layout: AdminLayout,
  },

  {
    path: "/admin/order",
    element: OrderManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/review",
    element: ReviewManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/statis",
    element: Statis,
    layout: AdminLayout,
  },
  {
    path: "/admin/store",
    element: StoreManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/provider",
    element: ProviderManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/product/add",
    element: ProductAddition,
    layout: AdminLayout,
  },
  {
    path: "/admin/product",
    element: ProductManagement,
    layout: AdminLayout,
  },
  {
    path: "/admin/product/attribute",
    element: AttributeManagement,
    layout: AdminLayout,
  },
  {
    path: "/login",
    element: Login,
  },
  {
    path: "/signup",
    element: signup,
  },
  {
    path: "/*",
    element: PageNotFound,
    layout: Fragment,
  },
];

const privateRoutes = [{}];

export { publicRoutes, privateRoutes };
