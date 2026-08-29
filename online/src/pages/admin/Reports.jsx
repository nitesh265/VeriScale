import { useEffect, useState } from "react";
import { getAdminReports } from "../../services/adminApi";
import { PanelSkeleton } from "../../components/Skeleton";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminReports()
      .then(setReport)
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load reports"));
  }, []);

  const metrics = report ? [
    ["Total instruments", report.instruments ?? 0],
    ["Verified", report.verified ?? report.certificates ?? 0],
    ["Rejected", report.rejected ?? 0],
    ["Pending", report.pending ?? 0],
  ] : [];
  const monthlyData = report?.monthlyInstruments ? Object.entries(report.monthlyInstruments) : [];
  const monthlyMax = Math.max(...monthlyData.map(([, count]) => count), 1);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Reports & Analytics
      </h1>

      <p className="text-gray-500 mb-6">
        System verification statistics.
      </p>

      {report?.generatedOn && <p className="mb-5 text-sm text-slate-500">Report generated on {new Date(report.generatedOn).toLocaleDateString()}</p>}

      {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}

      {!report && !error ? <PanelSkeleton className="h-32" /> : <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">
            Total instruments
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {metrics[0]?.[1] ?? "-"}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">
            Verified
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {metrics[1]?.[1] ?? "-"}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">
            Rejected
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {metrics[2]?.[1] ?? "-"}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-3xl font-bold mt-2">{metrics[3]?.[1] ?? "-"}</h2>
        </div>

      </div>}

      {report && <div className="bg-white border rounded-xl mt-6 p-6">

        <h2 className="font-bold text-lg mb-2">
          Monthly Instrument Registrations
        </h2>
        <p className="mb-8 text-sm text-slate-500">Number of instruments added during each month.</p>

        <div className="flex min-h-60 items-end gap-5 overflow-x-auto border-b border-slate-200 px-2 pt-8">

          {monthlyData.length === 0 && <p className="pb-6 text-sm text-slate-500">No monthly registration data available.</p>}
          {monthlyData.map(([label, count]) => {
            const height = Math.max((count / monthlyMax) * 100, count ? 8 : 2);

            return (

              <div
                key={label}
                className="min-w-20 flex-1 rounded-t bg-blue-500"
                style={{
                  height: `${height}%`,
                }}
              >
                <span className="block -translate-y-6 text-center text-xs font-semibold text-slate-600">{count}</span>
                <span className="block translate-y-2 truncate text-center text-xs text-slate-500">{label}</span>
              </div>

            );
          })}

        </div>

      </div>}

    </div>
  );
};

export default Reports;