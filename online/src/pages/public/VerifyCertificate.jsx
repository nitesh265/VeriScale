import { useState } from "react";
import { verifyCertificate } from "../../services/certificateApi";

const VerifyCertificate = () => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!certificateNumber.trim()) {
      setError("Please enter certificate number");
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const data = await verifyCertificate(certificateNumber);

      console.log("Verification response:", data);

      if (data.valid) {
        setCertificate(data.certificate);
      } else {
        setError(data.message || "Certificate not found");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-5">
        <div className="max-w-5xl mx-auto px-5">
          <h1 className="text-xl font-bold">
            Online Verification System
          </h1>

          <p className="text-sm text-slate-400">
            Certificate Verification
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-5 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">

          {/* Title */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">
              ✓
            </div>

            <h1 className="text-2xl font-bold">
              Verify Certificate
            </h1>

            <p className="text-gray-500 mt-2">
              Enter the certificate number to verify its authenticity.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleVerify}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) =>
                setCertificateNumber(e.target.value)
              }
              placeholder="Enter Certificate Number"
              className="flex-1 border rounded-lg px-4 py-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-7 py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Certificate */}
          {certificate && (
            <div className="mt-8 border-2 border-green-200 rounded-xl overflow-hidden">

              {/* Certificate Header */}
              <div className="bg-green-50 text-center py-5">
                <div className="text-green-600 text-4xl">
                  ✓
                </div>

                <h2 className="text-xl font-bold text-green-700">
                  CERTIFICATE VERIFIED
                </h2>
              </div>

              {/* Certificate Information */}
              <div className="p-6 space-y-4">

                <Info
                  label="Certificate Number"
                  value={certificate.certificateNumber}
                />

                <Info
                  label="Instrument"
                  value={certificate.instrumentName}
                />

                <Info
                  label="Instrument ID"
                  value={certificate.instrumentId}
                />

                <Info
                  label="Owner"
                  value={certificate.owner}
                />

                <Info
                  label="Issue Date"
                  value={certificate.issueDate}
                />

                <Info
                  label="Valid Until"
                  value={certificate.validUntil}
                />

                <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center font-semibold">
                  VALID
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


/*
  This component safely handles:
  string
  number
  null
  undefined
  object
  array
*/
const Info = ({ label, value }) => {
  const displayValue = (() => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      /*
        If backend sends an object,
        convert it into readable JSON
        instead of rendering the object directly.
      */
      return JSON.stringify(value);
    }

    return String(value);
  })();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3 gap-1">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-semibold break-all">
        {displayValue}
      </span>

    </div>
  );
};

export default VerifyCertificate;