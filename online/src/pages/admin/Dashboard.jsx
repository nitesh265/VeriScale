import {
  FaUsers,
  FaBalanceScale,
  FaClipboardList,
  FaCertificate,
  FaArrowRight,
  FaChartLine,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import { getAdminDashboard, getAdminInstrumentRequestItems, getAdminInspectors } from "../../services/adminApi";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [instrumentRequests, setInstrumentRequests] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminInstrumentRequestItems(), getAdminInspectors()])
      .then(([dashboardData, instrumentData, inspectorData]) => {
        setMetrics(dashboardData);
        const instruments = Array.isArray(instrumentData) ? instrumentData : instrumentData?.instruments || [];
        setInstrumentRequests(instruments.filter((instrument) => instrument.status?.toUpperCase() !== "VERIFIED"));
        setInspectors(Array.isArray(inspectorData) ? inspectorData : inspectorData?.inspectors || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load dashboard metrics"));
  }, []);

  const cards = [
    ["Total Users", metrics?.totalUsers ?? "-", <FaUsers />, "from-blue-500 to-cyan-500"],
    ["Instruments", metrics?.totalInstruments ?? "-", <FaBalanceScale />, "from-violet-500 to-indigo-500"],
    ["Certificates", metrics?.totalCertificates ?? "-", <FaCertificate />, "from-amber-500 to-orange-500"],
    ["Instrument Requests", instrumentRequests.length, <FaClipboardList />, "from-emerald-500 to-green-500"],
    ["Inspectors", inspectors.length, <FaUsers />, "from-rose-500 to-red-500"],
  ];

  const monthlyTrend = [42, 55, 50, 68, 64, 82, 90];

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont("helvetica", "normal");

    const dark = [15, 23, 42];
    const slate = [71, 85, 105];
    const muted = [100, 116, 139];
    const border = [203, 213, 225];
    const soft = [248, 250, 252];
    const primary = [37, 99, 235];
    const reportPerformance = [
      ["Approval rate", 87],
      ["Inspection coverage", 72],
      ["Certificate issuance", 91],
    ];

    doc.setFillColor(...dark);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Online Verification System", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Admin Operations Report", 14, 28);

    doc.setTextColor(...slate);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 62, 18);

    doc.setDrawColor(...border);
    doc.setFillColor(...soft);
    doc.roundedRect(14, 44, 182, 24, 4, 4, "FD");
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Executive Summary", 20, 55);
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text("System stability remains strong across users, instruments, and certificates.", 20, 62, { maxWidth: 170 });

    let y = 82;
    cards.forEach(([title, value], index) => {
      const x = 14 + (index % 2) * 96;
      const rowY = y + Math.floor(index / 2) * 32;

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, rowY, 88, 24, 4, 4, "FD");
      doc.setTextColor(...muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(title, x + 8, rowY + 9);
      doc.setTextColor(...dark);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(String(value), x + 8, rowY + 18);
    });

    y = 170;
    doc.setDrawColor(...border);
    doc.roundedRect(14, y, 182, 50, 4, 4, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...dark);
    doc.text("Performance Summary", 20, y + 12);
    doc.setFont("helvetica", "normal");

    reportPerformance.forEach(([label, percent], index) => {
      const barWidth = 110;
      const barX = 20;
      const barY = y + 20 + index * 12;

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(barX, barY, barWidth, 6, 2, 2, "F");

      doc.setFillColor(37, 99, 235);
      if (label === "Approval rate") doc.setFillColor(34, 197, 94);
      if (label === "Inspection coverage") doc.setFillColor(59, 130, 246);
      if (label === "Certificate issuance") doc.setFillColor(168, 85, 247);

      doc.roundedRect(barX, barY, (barWidth * percent) / 100, 6, 2, 2, "F");
      doc.setTextColor(...slate);
      doc.setFontSize(9);
      doc.text(`${label}`, barX, barY - 2);
      doc.setFont("helvetica", "bold");
      doc.text(`${percent}%`, 160, barY + 4);
      doc.setFont("helvetica", "normal");
    });

    doc.setDrawColor(...border);
    doc.roundedRect(14, 228, 182, 28, 4, 4, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Monthly Trend", 20, 238);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...slate);
    doc.text("Jan 42 | Feb 55 | Mar 50 | Apr 68 | May 64 | Jun 82 | Jul 90", 20, 247);

    doc.setTextColor(...muted);
    doc.setFontSize(8);
    doc.text("Generated by Online Verification System", 14, pageHeight - 10);

    doc.save("online-verification-admin-report.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Operations center</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        </div>

        <button
          onClick={handleGenerateReport}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          Generate report
          <FaArrowRight />
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([title, value, icon, tone]) => (
          <div key={title} className="metric-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{title}</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">{value}</h2>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-xl text-white shadow-lg`}>
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Performance</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Monthly trend</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FaChartLine />
              +18.2%
            </div>
          </div>

          <div className="h-56 w-full rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-3">
            <svg viewBox="0 0 600 220" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((line) => (
                <line
                  key={line}
                  x1="0"
                  y1={40 + line * 50}
                  x2="600"
                  y2={40 + line * 50}
                  stroke="#cbd5e1"
                  strokeDasharray="4 6"
                />
              ))}

              <path
                d="M0,180 C120,160 170,120 240,126 S350,75 420,88 S520,40 600,30 L600,220 L0,220 Z"
                fill="url(#trendFill)"
              />
              <path
                d="M0,180 C120,160 170,120 240,126 S350,75 420,88 S520,40 600,30"
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {monthlyTrend.map((value, index) => {
                const x = (index / (monthlyTrend.length - 1)) * 600;
                const y = 220 - value * 1.8;

                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="5" fill="#2563eb" />
                    <text x={x - 8} y="210" fontSize="10" fill="#64748b" textAnchor="middle">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Review instrument requests", path: "/admin/instrument-requests" },
              { label: "Audit instrument registry", path: "/admin/instruments" },
              { label: "Monitor inspector assignments", path: "/admin/inspectors" },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span>{label}</span>
                <FaArrowRight className="text-xs text-blue-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;