import AdminHeader from "@/components/container/AdminHeader";
// import AdminNav from "@/components/container/AdminNav";
import AppFooter from "@/components/container/AppFooter";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <main className="flex min-h-[100vh] w-full flex-col">
        <div className="w-adminLayout mx-auto pb-10">{children}</div>
      </main>
      <AppFooter className="bg-theme-softer" />
    </>
  );
};

export default AdminLayout;
