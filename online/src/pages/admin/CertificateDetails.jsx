import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { getCertificate, downloadCertificate } from "../../services/certificateApi";
import StatusBadge from "../../components/StatusBadge";
import { PanelSkeleton } from "../../components/Skeleton";

const CertificateDetails = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCertificate(id)
      .then(setCertificate)
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load certificate"));
  }, [id]);

  const handleDownload = async () => {
    try {
      const pdf = await downloadCertificate(id);
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificate.certificateNumber || "certificate"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to download certificate");
    }
  };

  if (error) return <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>;
  if (!certificate) return <PanelSkeleton className="h-96" />;

  const details = [
    ["Certificate number", certificate.certificateNumber],
    ["Applicant ID", certificate.applicantId],
    ["Instrument", certificate.instrumentName || certificate.instrumentId],
    ["Serial number", certificate.serialNumber],
    ["Issue date", certificate.issueDate],
    ["Valid until", certificate.validUntil],
  ];

  return (
    <div>
      <Link to="/admin/certificates" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
        <FaArrowLeft /> Back to certificates
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Verification certificate</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{certificate.certificateNumber}</h1>
          </div>
          <button type="button" onClick={handleDownload} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
            <FaDownload /> Download PDF
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="border-b border-slate-100 pb-3">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 break-words font-semibold text-slate-900">{value || "-"}</p>
            </div>
          ))}
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <div className="mt-2"><StatusBadge status={certificate.status || "ACTIVE"} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
