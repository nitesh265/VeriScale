import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInstrument } from "../../services/instrumentApi";
import { getMyCertificates } from "../../services/certificateApi";
import StatusBadge from "../../components/StatusBadge";
import { PanelSkeleton } from "../../components/Skeleton";

const InstrumentDetails = () => {
  const { id } = useParams();
  const [instrument, setInstrument] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [instrumentData, certificates] = await Promise.all([
          getInstrument(id),
          getMyCertificates(),
        ]);
        const certificateList = Array.isArray(certificates) ? certificates : certificates?.certificates || [];
        setInstrument(instrumentData);
        setCertificate(certificateList.find((item) => item.instrumentId === id) || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || requestError.message || "Unable to load instrument");
      }
    };

    loadDetails();
  }, [id]);

  if (error) {
    return <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (!instrument) {
    return <PanelSkeleton className="h-96" />;
  }

  const details = [
    ["Instrument name", instrument.instrumentName],
    ["Instrument type", instrument.instrumentType],
    ["Manufacturer", instrument.manufacturer],
    ["Model number", instrument.modelNumber],
    ["Serial number", instrument.serialNumber],
    ["Capacity", instrument.capacity],
    ["Accuracy class", instrument.accuracyClass],
    ["Location", instrument.location],
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Instrument details</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{instrument.instrumentName || instrument.instrumentType}</h1>
          <p className="mt-1 text-slate-500">ID: {instrument.id}</p>
        </div>
        {!certificate && (
          <Link to={`/applicant/instruments/${id}/edit`} className="rounded-lg bg-blue-600 px-5 py-3 text-center text-white hover:bg-blue-700">
            Edit instrument
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between border-b pb-5">
          <div>
            <p className="text-sm text-slate-500">Verification status</p>
            <div className="mt-2"><StatusBadge status={instrument.status || "PENDING"} /></div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Certificate generated</p>
            <p className={`mt-2 font-semibold ${certificate ? "text-emerald-600" : "text-slate-400"}`}>{certificate ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="border-b border-slate-100 pb-3">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 font-medium text-slate-900">{value || "-"}</p>
            </div>
          ))}
        </div>

        {certificate && (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-700">
            Certificate {certificate.certificateNumber || "generated"}. This instrument is view-only now.
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetails;
