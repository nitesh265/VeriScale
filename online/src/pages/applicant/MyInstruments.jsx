


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FaPlus, FaEye, FaEdit } from "react-icons/fa";

import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import { TableSkeleton } from "../../components/Skeleton";
import { getMyCertificates } from "../../services/certificateApi";

import api from "../../services/api";

const MyInstruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certifiedInstrumentIds, setCertifiedInstrumentIds] = useState([]);

  // ============================================
  // GET MY INSTRUMENTS
  // ============================================
  const fetchInstruments = async () => {
    try {
      setLoading(true);
      setError("");

      const [instrumentResponse, certificateResponse] = await Promise.all([
        api.get("/instruments/mine"),
        getMyCertificates(),
      ]);

      console.log("My instruments:", instrumentResponse.data);

      // Support both:
      // [ ... ]
      // and
      // { instruments: [ ... ] }
      const data = Array.isArray(instrumentResponse.data)
        ? instrumentResponse.data
        : instrumentResponse.data?.instruments || [];
      const certificates = Array.isArray(certificateResponse)
        ? certificateResponse
        : certificateResponse?.certificates || [];

      setCertifiedInstrumentIds(certificates.map((certificate) => certificate.instrumentId));
      setInstruments(data);
    } catch (err) {
      console.error("Failed to fetch instruments:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load instruments"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOAD WHEN PAGE OPENS
  // ============================================
  useEffect(() => {
    fetchInstruments();
  }, []);

  // ============================================
  // TABLE COLUMNS
  // ============================================
  const columns = [
    {
      key: "id",
      label: "SerialNumber",
    },
    {
      key: "type",
      label: "Instrument",
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
    },
    {
      key: "capacity",
      label: "Capacity",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "certificate",
      label: "Certificate Generated",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  return (
    <div className="p-6">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            My Instruments
          </h1>

          <p className="text-gray-500">
            Manage your registered instruments.
          </p>
        </div>

        <Link
          to="/applicant/instruments/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 justify-center"
        >
          <FaPlus />
          Add Instrument
        </Link>

      </div>

      {/* ========================================
          LOADING
      ======================================== */}
      {loading && (
        <TableSkeleton columns={6} />
      )}

      {/* ========================================
          ERROR
      ======================================== */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}

          <button
            onClick={fetchInstruments}
            className="ml-4 text-blue-600 font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================
          EMPTY
      ======================================== */}
      {!loading &&
        !error &&
        instruments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-10 text-center">

            <h2 className="text-lg font-semibold text-gray-700">
              No instruments found
            </h2>

            <p className="text-gray-500 mt-2 mb-5">
              You have not registered any instruments yet.
            </p>

            <Link
              to="/applicant/instruments/add"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              <FaPlus />
              Add Instrument
            </Link>

          </div>
        )}

      {/* ========================================
          TABLE
      ======================================== */}
      {!loading &&
        !error &&
        instruments.length > 0 && (
          <Table
            columns={columns}
            data={instruments}
            renderRow={(instrument) => (
              <tr
                key={instrument.id}
                className="border-b hover:bg-gray-50"
              >

                {/* ID */}
                <td className="px-5 py-4">
                  {instrument.serialNumber}
                </td>

                {/* TYPE */}
                <td className="px-5 py-4 font-medium">
                  {instrument.type ||
                    instrument.instrumentType ||
                    "-"}
                </td>

                {/* MANUFACTURER */}
                <td className="px-5 py-4">
                  {instrument.manufacturer || "-"}
                </td>

                {/* CAPACITY */}
                <td className="px-5 py-4">
                  {instrument.capacity || "-"}
                </td>

                {/* STATUS */}
                <td className="px-5 py-4">
                  <StatusBadge
                    status={
                      instrument.status || "PENDING"
                    }
                  />
                </td>

                <td className="px-5 py-4">
                  {certifiedInstrumentIds.includes(instrument.id) ? (
                    <span className="font-medium text-emerald-600">Yes</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">
                  <div className="flex gap-3">

                    <Link
                      to={`/applicant/instruments/${instrument.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </Link>

                    {certifiedInstrumentIds.includes(instrument.id) ? (
                      <span
                        className="cursor-not-allowed text-slate-300"
                        title="Editing is locked after certificate generation"
                      >
                        <FaEdit />
                      </span>
                    ) : (
                      <Link
                        to={`/applicant/instruments/${instrument.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                    )}

                  </div>
                </td>

              </tr>
            )}
          />
        )}

    </div>
  );
};

export default MyInstruments;
