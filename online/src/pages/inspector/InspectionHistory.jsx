import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { getMyInspections } from "../../services/inspectionApi";
import { getInstruments } from "../../services/instrumentApi";
import { TableSkeleton } from "../../components/Skeleton";

const InspectionHistory = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyInspections(), getInstruments()])
      .then(([inspectionResponse, instrumentResponse]) => {
        const inspections = Array.isArray(inspectionResponse) ? inspectionResponse : inspectionResponse?.inspections || [];
        const instruments = Array.isArray(instrumentResponse) ? instrumentResponse : instrumentResponse?.instruments || [];
        const instrumentMap = new Map(instruments.map((instrument) => [instrument.id, instrument]));

        setData(inspections.map((inspection) => ({
          ...inspection,
          instrumentName: instrumentMap.get(inspection.instrumentId)?.instrumentName || instrumentMap.get(inspection.instrumentId)?.instrumentType,
        })));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load inspection history"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "id", label: "Inspection ID" },
    { key: "instrument", label: "Instrument" },
    { key: "applicant", label: "Applicant" },
    { key: "date", label: "Date" },
    { key: "result", label: "Result" },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Inspection History
      </h1>

      <p className="text-gray-500 mb-6">
        View previously completed inspections.
      </p>

      {loading && <TableSkeleton columns={5} />}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && <Table
        columns={columns}
        data={data}
        renderRow={(item) => (

          <tr key={item.id} className="border-b">

            <td className="px-5 py-4">
              {item.id}
            </td>

            <td className="px-5 py-4">
              {item.instrumentName || item.instrumentId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.applicantName || "-"}
            </td>

            <td className="px-5 py-4">
              {item.inspectionDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-")}
            </td>

            <td className="px-5 py-4">
              <StatusBadge status={item.passed ? "VERIFIED" : "REJECTED"} />
            </td>

            <td className="px-5 py-4">
              <Link
                to={`/inspector/history/${item.id}`}
                className="text-blue-600 hover:text-blue-800"
                title="View inspection details"
              >
                <FaEye />
              </Link>
            </td>

          </tr>

        )}
      />}

    </div>
  );
};

export default InspectionHistory;