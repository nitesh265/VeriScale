import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getInspection } from "../../services/inspectionApi";
import { getInstrument } from "../../services/instrumentApi";
import StatusBadge from "../../components/StatusBadge";
import { PanelSkeleton } from "../../components/Skeleton";

const InspectionDetails = () => {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const inspectionData = await getInspection(id);
        setInspection(inspectionData);
        if (inspectionData.instrumentId) {
          setInstrument(await getInstrument(inspectionData.instrumentId));
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || "Unable to load inspection details");
      }
    };

    loadDetails();
  }, [id]);

  if (error) return <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>;
  if (!inspection) return <PanelSkeleton className="h-96" />;

  const details = [
    ["Inspection ID", inspection.id],
    ["Instrument", instrument?.instrumentName || inspection.instrumentId],
    ["Serial number", instrument?.serialNumber],
    ["Inspection date", inspection.inspectionDate || (inspection.createdAt ? new Date(inspection.createdAt).toLocaleDateString() : "-")],
    ["Standard value", inspection.standardValue],
    ["Observed value", inspection.observedValue],
    ["Error", inspection.error],
    ["Condition", inspection.condition],
    ["Remarks", inspection.remarks],
  ];

  return (
    <div>
      <Link to="/inspector/history" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
        <FaArrowLeft /> Back to inspection history
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between border-b pb-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Inspection record</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Inspection Details</h1>
          </div>
          <StatusBadge status={inspection.passed ? "VERIFIED" : "REJECTED"} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="border-b border-slate-100 pb-3">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 break-words font-semibold text-slate-900">{value === null || value === undefined || value === "" ? "-" : String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
