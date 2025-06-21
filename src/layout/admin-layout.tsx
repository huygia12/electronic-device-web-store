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
        {/* <div className="mx-auto w-[90vw] lgg_w-md lg_w-lg xl_w-xl 2xl_w-2xl 4xl_w-3xl "> */}
        {navigation.state === "loading" ? <TopBarProgress /> : <Outlet />}
      </main>
      <AppFooter className="bg-theme-softer" />
      <Toaster
        richColors
        toastOptions={{
          className:
            "right-10 bottom-5 text-sm h-[3rem] md_text-xl md_h-[4rem]",
        }}
      />
    </>
  );
};

export default AdminLayout;
