import { useEffect, useState } from "react";
import Table from "../../components/Table";
import { createInspector, getAdminInspectors } from "../../services/adminApi";
import { TableSkeleton } from "../../components/Skeleton";

const Inspectors = () => {

  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newInspector, setNewInspector] = useState({ name: "", email: "", phone: "", password: "" });

  const fetchInspectors = async () => {
    setLoading(true);
    try {
      const data = await getAdminInspectors();
      setInspectors(Array.isArray(data) ? data : data?.inspectors || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load inspectors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectors();
  }, []);

  const handleCreateInspector = async (event) => {
    event.preventDefault();
    try {
      setCreating(true);
      setError("");
      await createInspector(newInspector);
      setNewInspector({ name: "", email: "", phone: "", password: "" });
      setShowCreateForm(false);
      await fetchInspectors();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to create inspector");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { key: "id", label: "Inspector ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "assigned", label: "Assigned" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="p-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="text-2xl font-bold">Inspectors</h1>
        <button type="button" onClick={() => setShowCreateForm((current) => !current)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {showCreateForm ? "Close" : "Create inspector"}
        </button>
      </div>

      <p className="text-gray-500 mb-6">
        Manage verification inspectors.
      </p>

      {showCreateForm && (
        <form onSubmit={handleCreateInspector} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border bg-white p-5 md:grid-cols-2">
          {[["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["password", "Password"]].map(([name, label]) => (
            <input key={name} name={name} type={name === "password" ? "password" : "text"} placeholder={label} value={newInspector[name]} onChange={(event) => setNewInspector((current) => ({ ...current, [name]: event.target.value }))} required={name !== "phone"} className="rounded-lg border px-4 py-3" />
          ))}
          <button disabled={creating} className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-60">
            {creating ? "Creating..." : "Create inspector"}
          </button>
        </form>
      )}

      {loading && <TableSkeleton columns={5} />}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}
      {!loading && !error && <Table
        columns={columns}
        data={inspectors}
        renderRow={(item) => (

          <tr key={item.id} className="border-b">

            <td className="px-5 py-4">
              {item.id}
            </td>

            <td className="px-5 py-4 font-medium">
              {item.name}
            </td>

            <td className="px-5 py-4">
              {item.email}
            </td>

            <td className="px-5 py-4">
              {item.assigned ?? "-"}
            </td>

            <td className="px-5 py-4">
              {item.completed ?? "-"}
            </td>

          </tr>

        )}
      />}

    </div>
  );
};

export default Inspectors;