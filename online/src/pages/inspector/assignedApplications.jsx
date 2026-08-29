import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { getAssignedInstruments } from "../../services/instrumentApi";
import { TableSkeleton } from "../../components/Skeleton";

const AssignedApplications = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    getAssignedInstruments()
      .then((data) => {
        const instruments = Array.isArray(data) ? data : data?.instruments || [];
        setApplications(instruments.filter((instrument) => instrument.status?.toUpperCase() === "ASSIGNED"));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load applications"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const columns = [
    { key: "id", label: "Instrument ID" },
    { key: "instrument", label: "Assigned Instrument" },
    { key: "applicant", label: "Applicant" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Assigned Applications
      </h1>

      <p className="text-gray-500 mb-6">
        Applications assigned to you for inspection.
      </p>

      {loading && <TableSkeleton columns={6} />}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && <Table
        columns={columns}
        data={applications}
        renderRow={(item) => (

          <tr
            key={item.id}
            className="border-b"
          >

            <td className="px-5 py-4">
              {item.id}
            </td>

            <td className="px-5 py-4">
              {item.instrumentName || item.instrumentId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.applicantId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
            </td>

            <td className="px-5 py-4">
              <StatusBadge status={item.status} />
            </td>

            <td className="px-5 py-4">

              <Link
                to={`/inspector/inspection/${item.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Inspect
              </Link>

            </td>

          </tr>

        )}
      />}

    </div>
  );
};

export default AssignedApplications;