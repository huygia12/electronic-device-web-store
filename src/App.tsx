import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./pages/routes";
import defaultLayout from "./layout/ClientLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout ?? defaultLayout;
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
