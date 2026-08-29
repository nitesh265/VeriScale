import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInstrument } from "../../services/instrumentApi";

const AddInstrument = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    instrumentName: "",
    instrumentType: "",
    manufacturer: "",
    modelNumber: "",
    serialNumber: "",
    capacity: "",
    accuracyClass: "",
    location: "", 
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await createInstrument(form);

      navigate("/applicant/instruments");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Add Instrument
      </h1>

      <p className="text-gray-500 mb-6">
        Register a weighing or measuring instrument.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 max-w-4xl"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {[
            ["instrumentName", "Instrument Name"],
            ["instrumentType", "Instrument Type"],
            ["manufacturer", "Manufacturer"],
            ["modelNumber", "Model"],
            ["serialNumber", "Serial Number"],
            ["capacity", "Capacity"],
            ["accuracyClass", "Accuracy / Least Count"],
            ["location", "Installation Location"],
          ].map(([name, label]) => (

            <div key={name}>

              <label className="block text-sm font-medium mb-2">
                {label}
              </label>

              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          ))}

        </div>

        <div className="flex justify-end mt-6">

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Saving..." : "Add Instrument"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddInstrument;