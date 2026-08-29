import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInstrument, updateInstrument } from "../../services/instrumentApi";

const fields = [
  ["instrumentName", "Instrument Name"],
  ["instrumentType", "Instrument Type"],
  ["manufacturer", "Manufacturer"],
  ["modelNumber", "Model"],
  ["serialNumber", "Serial Number"],
  ["capacity", "Capacity"],
  ["accuracyClass", "Accuracy / Least Count"],
  ["location", "Installation Location"],
];

const EditInstrument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getInstrument(id)
      .then((instrument) => setForm(instrument))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || "Unable to load instrument"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateInstrument(id, form);
      navigate("/applicant/instruments");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update instrument");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-slate-500">Loading instrument...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit Instrument</h1>
      <p className="mb-6 mt-1 text-slate-500">Update this instrument before its certificate is generated.</p>

      {error && <div className="mb-5 rounded-lg bg-red-50 p-3 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-4xl rounded-xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-medium">{label}</label>
              <input
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/applicant/instruments")} className="rounded-lg border px-6 py-3">
            Cancel
          </button>
          <button disabled={saving} className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstrument;