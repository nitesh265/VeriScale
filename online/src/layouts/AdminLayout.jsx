import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <div className="sticky top-0 h-screen">
        <Sidebar role="admin" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 lg:p-5">
        <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px]">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;