import { useEffect, useState } from "react";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { getAdminInstruments } from "../../services/adminApi";
import { TableSkeleton } from "../../components/Skeleton";

const Instruments = () => {

  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminInstruments()
      .then((data) => setInstruments(Array.isArray(data) ? data : data?.instruments || []))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load instruments"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "id", label: "Instrument ID" },
    { key: "type", label: "Type" },
    { key: "owner", label: "Owner" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Instruments
      </h1>

      <p className="text-gray-500 mb-6">
        Manage all registered instruments.
      </p>

      {loading && <TableSkeleton columns={5} />}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && <Table
        columns={columns}
        data={instruments}
        renderRow={(item) => (

          <tr key={item.id} className="border-b">

            <td className="px-5 py-4">
              {item.id}
            </td>

            <td className="px-5 py-4">
              {item.instrumentName || item.instrumentType || "-"}
            </td>

            <td className="px-5 py-4">
              {item.applicantId || "-"}
            </td>

            <td className="px-5 py-4">
              {item.location}
            </td>

            <td className="px-5 py-4">
              <StatusBadge status={item.status} />
            </td>

          </tr>

        )}
      />}

    </div>
  );
};

export default Instruments;