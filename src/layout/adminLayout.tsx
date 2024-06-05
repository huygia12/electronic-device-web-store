import AdminHeader from "@/components/container/adminHeader";
import AppFooter from "@/components/container/appFooter";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <>
      <AdminHeader />
      <main className="flex min-h-[100vh] w-full flex-col">
        <div className="w-adminLayout mx-auto pb-10">
          <Outlet />
        </div>
      </main>
      <AppFooter className="bg-theme-softer" />
    </>
  );
};

export default AdminLayout;