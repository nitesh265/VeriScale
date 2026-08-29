import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { getAdminCertificates } from "../../services/adminApi";
import { downloadCertificate } from "../../services/certificateApi";
import { TableSkeleton } from "../../components/Skeleton";

const Certificates = () => {

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDownload = async (id, certificateNumber) => {
    try {
      const pdf = await downloadCertificate(id);
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateNumber || "certificate"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to download certificate");
    }
  };

  useEffect(() => {
    getAdminCertificates()
      .then((data) => setCertificates(Array.isArray(data) ? data : data?.certificates || []))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load certificates"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "number", label: "Certificate No." },
    { key: "instrument", label: "Instrument" },
    { key: "owner", label: "Owner" },
    { key: "issueDate", label: "Issue Date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Certificates
      </h1>

      <p className="text-gray-500 mb-6">
        Manage generated verification certificates.
      </p>

      {loading && <TableSkeleton columns={5} />}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && <Table
        columns={columns}
        data={certificates}
        renderRow={(item) => (

            <tr key={item.id || item.certificateNumber} className="border-b">

            <td className="px-5 py-4 font-medium">
              {item.certificateNumber || "-"}
            </td>

            <td className="px-5 py-4">
              {item.instrumentName || item.instrumentId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.owner || item.applicantId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : "-"}
            </td>

            <td className="px-5 py-4">
              <StatusBadge status={item.status} />
            </td>

            <td className="px-5 py-4">
              <div className="flex items-center gap-4">
                <Link to={`/admin/certificates/${item.id}`} className="text-blue-600 hover:text-blue-800" title="View certificate">
                  <FaEye />
                </Link>
                <button type="button" onClick={() => handleDownload(item.id, item.certificateNumber)} className="text-emerald-600 hover:text-emerald-800" title="Download certificate">
                  <FaDownload />
                </button>
              </div>
            </td>

          </tr>

        )}
      />}

    </div>
  );
};

export default Certificates;