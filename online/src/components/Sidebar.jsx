import { useState } from "react";
import {
  FaHome,
  FaBalanceScale,
  FaClipboardList,
  FaCertificate,
  FaUsers,
  FaUserTie,
  FaChartBar,
  FaSignOutAlt,
  FaHistory,
  FaThumbtack,
} from "react-icons/fa";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isPinned, setIsPinned] = useState(true);

  const applicantMenu = [
    { name: "Dashboard", path: "/applicant/dashboard", icon: <FaHome /> },
    { name: "My Instruments", path: "/applicant/instruments", icon: <FaBalanceScale /> },
    { name: "Certificates", path: "/applicant/certificates", icon: <FaCertificate /> },
  ];

  const inspectorMenu = [
    { name: "Dashboard", path: "/inspector/dashboard", icon: <FaHome /> },
    { name: "Assigned Applications", path: "/inspector/applications", icon: <FaClipboardList /> },
    { name: "Inspection History", path: "/inspector/history", icon: <FaHistory /> },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Applicants", path: "/admin/applicants", icon: <FaUsers /> },
    { name: "Instruments", path: "/admin/instruments", icon: <FaBalanceScale /> },
    { name: "Instrument Requests", path: "/admin/instrument-requests", icon: <FaClipboardList /> },
    { name: "Inspectors", path: "/admin/inspectors", icon: <FaUserTie /> },
    { name: "Certificates", path: "/admin/certificates", icon: <FaCertificate /> },
    { name: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
  ];

  const menu = role === "admin" ? adminMenu : role === "inspector" ? inspectorMenu : applicantMenu;
  const roleLabel = role === "admin" ? "Admin" : role === "inspector" ? "Inspector" : "Applicant";
  const sidebarWidthClass = isPinned ? "w-72" : "w-24";
  const isMenuItemActive = (item, isRouteActive = false) => (
    isRouteActive || (
      role === "inspector" &&
      item.path === "/inspector/applications" &&
      pathname.startsWith("/inspector/inspection/")
    ) || (
      role === "inspector" &&
      item.path === "/inspector/history" &&
      pathname.startsWith("/inspector/history/")
    )
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`flex ${sidebarWidthClass} min-h-screen flex-col overflow-hidden bg-slate-950 text-white shadow-[12px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300`}>
      <div className="border-b border-slate-800/80 px-3 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-3 ${!isPinned && "justify-center w-full"}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 text-lg font-bold shadow-lg shadow-blue-500/30">
              O
            </div>

            {isPinned && (
              <div>
                <h1 className="text-xl font-bold tracking-tight">OVS</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Verification System
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsPinned((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 transition hover:border-blue-500/80 hover:text-white"
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <FaThumbtack className={isPinned ? "rotate-0 text-blue-400" : "rotate-90 text-slate-400"} />
          </button>
        </div>

        {isPinned && (
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Access</p>
            <p className="mt-1 text-sm font-semibold text-white">{roleLabel} Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isPinned ? "" : item.name}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isMenuItemActive(item, isActive)
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
              } ${!isPinned ? "justify-center" : ""}`
            }
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${
              isMenuItemActive(item) ? "bg-white/15" : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
            }`}>
              {item.icon}
            </span>

            {isPinned && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-3 text-sm font-medium text-slate-300 transition hover:border-rose-500/60 hover:bg-rose-500/10 hover:text-white ${!isPinned ? "justify-center" : ""}`}
          title={isPinned ? "" : "Logout"}
        >
          <FaSignOutAlt />
          {isPinned && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;