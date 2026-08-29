import { useEffect, useState } from "react";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { getAdminInstrumentRequestItems, getAdminInspectors } from "../../services/adminApi";
import { assignInstrument } from "../../services/adminApi";
import { TableSkeleton } from "../../components/Skeleton";

const InstrumentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspectors, setSelectedInspectors] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAdminInstrumentRequestItems(), getAdminInspectors()])
      .then(([instrumentData, inspectorData]) => {
        const inspectorList = Array.isArray(inspectorData) ? inspectorData : inspectorData?.inspectors || [];
        const instrumentList = Array.isArray(instrumentData) ? instrumentData : instrumentData?.instruments || [];

        setInspectors(inspectorList);
        setRequests(instrumentList.filter((instrument) => instrument.status?.toUpperCase() !== "VERIFIED"));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load instrument requests"))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (requestId) => {
    const inspectorId = selectedInspectors[requestId];
    if (!inspectorId) {
      setError("Select an inspector before assigning the instrument.");
      return;
    }

    try {
      setAssigningId(requestId);
      setError("");
      const updatedRequest = await assignInstrument(requestId, inspectorId);
      setRequests((current) => current
        .map((request) => request.id === requestId ? { ...request, ...updatedRequest } : request)
        .filter((request) => request.status?.toUpperCase() !== "VERIFIED"));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to assign inspector");
    } finally {
      setAssigningId("");
    }
  };

  const columns = [
    { key: "id", label: "Instrument ID" },
    { key: "applicant", label: "Applicant ID" },
    { key: "instrument", label: "Instrument" },
    { key: "date", label: "Added On" },
    { key: "status", label: "Status" },
    { key: "assignment", label: "Assign Inspector" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Instrument Requests</h1>
      <p className="mb-6 text-gray-500">Review instrument requests and assign them to inspectors.</p>

      {loading && <TableSkeleton columns={6} />}
      {!loading && error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && requests.length === 0 && <p className="rounded-lg bg-white p-6 text-gray-500">No instrument requests found.</p>}
      {!loading && !error && requests.length > 0 && (
        <Table
          columns={columns}
          data={requests}
          renderRow={(request) => (
            <tr key={request.id} className="border-b">
              <td className="px-5 py-4">{request.id}</td>
              <td className="px-5 py-4">{request.applicantId || "-"}</td>
              <td className="px-5 py-4">{request.instrumentName || request.instrumentId || "-"}</td>
              <td className="px-5 py-4">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}</td>
              <td className="px-5 py-4"><StatusBadge status={request.status} /></td>
              <td className="px-5 py-4">
                <div className="flex min-w-56 items-center gap-2">
                  <select
                    value={selectedInspectors[request.id] || request.inspectorId || ""}
                    onChange={(event) => setSelectedInspectors((current) => ({ ...current, [request.id]: event.target.value }))}
                    className="min-w-32 rounded-lg border border-slate-200 px-2 py-2 text-xs"
                  >
                    <option value="">Select inspector</option>
                    {inspectors.map((inspector) => <option key={inspector.id || inspector.email} value={inspector.email || inspector.id}>{inspector.name || inspector.email}</option>)}
                  </select>
                  <button type="button" onClick={() => handleAssign(request.id)} disabled={assigningId === request.id} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60">
                    {assigningId === request.id ? "..." : "Assign"}
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default InstrumentRequests;
