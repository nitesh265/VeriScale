import {
  FaBalanceScale,
  FaCertificate,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getMyInstruments } from "../../services/instrumentApi";
import { getMyCertificates } from "../../services/certificateApi";
import { PanelSkeleton } from "../../components/Skeleton";

const Dashboard = () => {
  const [instruments, setInstruments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyInstruments(), getMyCertificates()])
      .then(([instrumentData, certificateData]) => {
        setInstruments(Array.isArray(instrumentData) ? instrumentData : instrumentData?.instruments || []);
        setCertificates(Array.isArray(certificateData) ? certificateData : certificateData?.certificates || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const certifiedIds = new Set(certificates.map((certificate) => certificate.instrumentId));
  const verifiedCount = instruments.filter((instrument) => certifiedIds.has(instrument.id) || instrument.status?.toUpperCase() === "VERIFIED").length;
  const pendingCount = instruments.filter((instrument) => ["PENDING", "SUBMITTED"].includes(instrument.status?.toUpperCase())).length;
  const rejectedCount = instruments.filter((instrument) => instrument.status?.toUpperCase() === "REJECTED").length;
  const total = instruments.length || 1;
  const percent = (count) => Math.round((count / total) * 100);

  const cards = [
    {
      title: "My Instruments",
      value: loading ? "-" : instruments.length,
      change: "Registered instruments",
      icon: <FaBalanceScale />,
      tone: "from-blue-500 to-cyan-500",
    },
    {
      title: "Verified",
      value: loading ? "-" : verifiedCount,
      change: "Certificate generated",
      icon: <FaCertificate />,
      tone: "from-emerald-500 to-green-500",
    },
    {
      title: "Pending",
      value: loading ? "-" : pendingCount,
      change: "Awaiting verification",
      icon: <FaClock />,
      tone: "from-amber-500 to-orange-500",
    },
    {
      title: "Rejected",
      value: loading ? "-" : rejectedCount,
      change: "Needs attention",
      icon: <FaTimesCircle />,
      tone: "from-rose-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Applicant overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Applicant Dashboard</h1>
        </div>

      </div>

      {error && <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="metric-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">{card.value}</h2>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-xl text-white shadow-lg`}>
                {card.icon}
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Verification overview</h2>

          {loading ? <PanelSkeleton className="h-56" /> : <div className="space-y-5">
            {[
              ["Verified", percent(verifiedCount), "bg-emerald-500"],
              ["Pending", percent(pendingCount), "bg-amber-500"],
              ["Rejected", percent(rejectedCount), "bg-rose-500"],
            ].map(([name, width, color]) => (
              <div key={name}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{name}</span>
                  <span>{width}%</span>
                </div>

                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;