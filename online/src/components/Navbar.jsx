import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const pageLabel = pathname.split("/").filter(Boolean).pop() || "dashboard";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/55 px-5 py-4 backdrop-blur-xl lg:px-7">
      <div className="flex items-center gap-3">
        <div className="brand-badge flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm">
          OVS
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {pageLabel.replaceAll("-", " ")}
          </p>
          <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
            Online Verification System
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-100 text-slate-600">
            <FaUserCircle className="text-2xl" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] capitalize text-slate-500">
              {user?.role || "Applicant"}
            </p>
          </div>

          <FaChevronDown className="hidden text-xs text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;