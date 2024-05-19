import Announcement from "./Announcement.tsx";
import Products from "./Products.tsx";
import Intro from "./Intro.tsx";
import Homepage from "./Homepage.tsx";
import Recruitment from "./Recruitment.tsx";
import PageNotFound from "./PageNotFound.tsx";
import { Fragment } from "react/jsx-runtime";

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
    path: "/*",
    element: PageNotFound,
    layout: Fragment,
  },
];

const privateRoutes = [{}];

export { publicRoutes, privateRoutes };
