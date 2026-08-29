import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createInspection } from "../../services/inspectionApi";

const Inspection = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    test10kg: "",
    test20kg: "",
    test50kg: "",
    result: "",
    remarks: "",
  });

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

    try {

      await createInspection({
        instrumentId: id,
        standardValue: Number(form.test10kg),
        observedValue: Number(form.test20kg),
        condition: form.test50kg,
        passed: form.result === "PASS",
        remarks: form.remarks,
      });

      navigate("/inspector/applications");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Instrument Inspection
      </h1>

      <p className="text-gray-500 mb-6">
        Application: {id}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 max-w-4xl"
      >

        <h2 className="font-bold text-lg mb-5">
          Instrument Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          <div>
            <p className="text-gray-500 text-sm">
              Instrument
            </p>

            <p className="font-medium">
              Digital Weighing Scale
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Capacity
            </p>

            <p className="font-medium">
              100 kg
            </p>
          </div>

        </div>

        <h2 className="font-bold text-lg mb-5">
          Test Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <Input
            label="10 kg Test"
            name="test10kg"
            value={form.test10kg}
            onChange={handleChange}
          />

          <Input
            label="20 kg Test"
            name="test20kg"
            value={form.test20kg}
            onChange={handleChange}
          />

          <Input
            label="50 kg Test"
            name="test50kg"
            value={form.test50kg}
            onChange={handleChange}
          />

        </div>

        <div className="mt-6">

          <label className="block text-sm font-medium mb-2">
            Inspection Result
          </label>

          <select
            name="result"
            value={form.result}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-3"
          >

            <option value="">
              Select Result
            </option>

            <option value="PASS">
              Pass
            </option>

            <option value="FAIL">
              Fail
            </option>

          </select>

        </div>

        <div className="mt-5">

          <label className="block text-sm font-medium mb-2">
            Remarks
          </label>

          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <button
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Submitting..."
            : "Submit Inspection"}
        </button>

      </form>

    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
}) => {

  return (
    <div>

      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type="number"
        step="0.01"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border rounded-lg px-4 py-3"
      />

    </div>
  );
};

export default Inspection;