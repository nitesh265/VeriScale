import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyInspections } from "../../services/inspectionApi";
import { getAssignedInstruments } from "../../services/instrumentApi";
import { PanelSkeleton } from "../../components/Skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [assignedInstruments, setAssignedInstruments] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([getAssignedInstruments(), getMyInspections()])
      .then(([instrumentData, inspectionData]) => {
        const inspectionsList = Array.isArray(inspectionData) ? inspectionData : inspectionData?.inspections || [];
        const assigned = Array.isArray(instrumentData) ? instrumentData : instrumentData?.instruments || [];

        setAssignedInstruments(assigned);
        setInspections(inspectionsList);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load inspector dashboard"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const completedCount = inspections.filter((inspection) => inspection.passed === true).length;
  const rejectedCount = inspections.filter((inspection) => !inspection.passed).length;
  const pendingInstruments = assignedInstruments.filter((instrument) => instrument.status?.toUpperCase() === "ASSIGNED");
  const passedRate = inspections.length ? Math.round((completedCount / inspections.length) * 100) : 0;
  const pendingRate = assignedInstruments.length ? Math.round((pendingInstruments.length / assignedInstruments.length) * 100) : 0;
  const rejectedRate = inspections.length ? Math.round((rejectedCount / inspections.length) * 100) : 0;

  const cards = [
    { title: "Assigned", value: loading ? "-" : assignedInstruments.length, icon: FaClipboardList, tone: "from-blue-500 to-cyan-500" },
    { title: "Completed", value: loading ? "-" : completedCount, icon: FaCheckCircle, tone: "from-emerald-500 to-green-500" },
    { title: "Pending", value: loading ? "-" : pendingInstruments.length, icon: FaClock, tone: "from-amber-500 to-orange-500" },
    { title: "Rejected", value: loading ? "-" : rejectedCount, icon: FaTimesCircle, tone: "from-rose-500 to-red-500" },
  ];

  const schedule = pendingInstruments.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Inspection overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Inspector Dashboard</h1>
        </div>

        <Link to="/inspector/applications" className="inline-flex items-center gap-2 self-start rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
          View schedule
          <FaArrowRight />
        </Link>
      </div>

      {error && <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="metric-card rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">{card.value}</h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-xl text-white shadow-lg`}>
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Today’s inspection queue</h2>
            <Link to="/inspector/applications" className="text-sm font-medium text-blue-600">Open list</Link>
          </div>

          {loading ? <PanelSkeleton className="h-56" /> : <div className="space-y-4">
            {schedule.length === 0 && <p className="rounded-xl bg-slate-50 p-5 text-slate-500">No pending instruments assigned.</p>}
            {schedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.instrumentName || item.instrumentType || "Instrument"}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.serialNumber || item.id}</p>
                </div>
                <Status status={item.status} />
              </div>
            ))}
          </div>}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Inspection mix</h2>
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-40 rounded-full" style={{ background: `conic-gradient(#22c55e 0 ${passedRate}%, #f59e0b ${passedRate}% ${passedRate + pendingRate}%, #ef4444 ${passedRate + pendingRate}% 100%)` }}>
              <div className="absolute inset-6 rounded-full bg-white" />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900">{passedRate}%</div>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Passed</span><span>{passedRate}%</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Pending</span><span>{pendingRate}%</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Rejected</span><span>{rejectedRate}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Status = ({ status }) => (
  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
    {(status || "PENDING").replaceAll("_", " ")}
  </span>
);

export default Dashboard;