import { RouterProvider } from "react-router-dom";
import { publicRoutes } from "./pages/routes";

function App() {
  return <RouterProvider router={publicRoutes} />;
}

export default App;
