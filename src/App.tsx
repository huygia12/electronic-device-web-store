import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppClientLayout from "./layout/AppClientLayout";
import { publicRoutes } from "./pages/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout ?? AppClientLayout;
          const Page = route.element;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
