import { ScrollToTop, TopBarProgress } from "@/components/effect";
import { Outlet, useNavigation } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminHeader, AppFooter } from ".";

const AdminLayout: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>
      <ScrollToTop />
      <AdminHeader />
      <main className="flex min-h-[80vh] h-max w-full flex-col">
        <div className="w-adminLayout mx-auto pb-10">
          {navigation.state === "loading" ? <TopBarProgress /> : <Outlet />}
        </div>
      </main>
      <AppFooter className="bg-theme-softer" />
      <Toaster
        richColors
        toastOptions={{
          className: "text-xl h-[4rem] right-10 bottom-5",
        }}
      />
    </>
  );
};

export default AdminLayout;
