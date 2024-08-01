import { ScrollToTop } from "@/components/effect";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminHeader, AppFooter } from ".";

const AdminLayout: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <AdminHeader />
      <main className="flex min-h-[80vh] h-max w-full flex-col">
        <div className="w-adminLayout mx-auto pb-10">
          <Outlet />
        </div>
      </main>
      <AppFooter className="bg-theme-softer" />
      <Toaster richColors />
    </>
  );
};

export default AdminLayout;
