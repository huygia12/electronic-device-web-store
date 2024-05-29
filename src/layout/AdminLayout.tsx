import AdminHeader from "@/components/container/AdminHeader";
// import AdminNav from "@/components/container/AdminNav";
import AppFooter from "@/components/container/AppFooter";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {/* <AdminNav /> */}
        <div className="min-h-[100vh]">{children}</div>
      </div>
      <AppFooter className="bg-theme-softer" />
    </>
  );
};

export default AdminLayout;
