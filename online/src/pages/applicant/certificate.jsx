


// import React, { useState } from "react";
// import { FaDownload, FaEye, FaTimes } from "react-icons/fa";
// import jsPDF from "jspdf";

// const Certificates = () => {
//   const [selectedCertificate, setSelectedCertificate] = useState(null);

//   const certificates = [
//     {
//       number: "VC-2026-001",
//       instrument: "Digital Weighing Scale",
//       issueDate: "26 Aug 2026",
//       validUntil: "25 Aug 2027",
//       applicant: "Nilesh Yadav",
//       status: "Verified",
//     },
//     {
//       number: "VC-2026-002",
//       instrument: "Electronic Balance",
//       issueDate: "20 Aug 2026",
//       validUntil: "19 Aug 2027",
//       applicant: "Nilesh Yadav",
//       status: "Verified",
//     },
//   ];

//   // View Certificate
//   const handleView = (certificate) => {
//     setSelectedCertificate(certificate);
//   };

//   // Download Certificate
//   const handleDownload = (certificate) => {
//     const doc = new jsPDF();

//     doc.setFontSize(22);
//     doc.text("VERIFICATION CERTIFICATE", 105, 30, {
//       align: "center",
//     });

//     doc.setFontSize(14);
//     doc.text("Online Verification System", 105, 42, {
//       align: "center",
//     });

//     doc.line(20, 50, 190, 50);

//     doc.setFontSize(12);

//     doc.text(
//       `Certificate Number: ${certificate.number}`,
//       25,
//       70
//     );

//     doc.text(
//       `Applicant: ${certificate.applicant}`,
//       25,
//       85
//     );

//     doc.text(
//       `Instrument: ${certificate.instrument}`,
//       25,
//       100
//     );

//     doc.text(
//       `Issue Date: ${certificate.issueDate}`,
//       25,
//       115
//     );

//     doc.text(
//       `Valid Until: ${certificate.validUntil}`,
//       25,
//       130
//     );

//     doc.text(
//       `Status: ${certificate.status}`,
//       25,
//       145
//     );

//     doc.line(20, 160, 190, 160);

//     doc.setFontSize(10);

//     doc.text(
//       "This certificate confirms that the above instrument",
//       105,
//       180,
//       { align: "center" }
//     );

//     doc.text(
//       "has successfully completed the verification process.",
//       105,
//       188,
//       { align: "center" }
//     );

//     doc.save(`${certificate.number}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">
//         Certificates
//       </h1>

//       <p className="text-gray-500 mb-6">
//         View and download your verification certificates.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {certificates.map((certificate) => (
//           <div
//             key={certificate.number}
//             className="bg-white border rounded-xl p-6 shadow-sm"
//           >
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   Certificate Number
//                 </p>

//                 <h2 className="font-bold text-lg">
//                   {certificate.number}
//                 </h2>
//               </div>

//               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
//                 ✓
//               </div>
//             </div>

//             <div className="mt-5 space-y-2 text-sm">
//               <p>
//                 <b>Instrument:</b>{" "}
//                 {certificate.instrument}
//               </p>

//               <p>
//                 <b>Issue Date:</b>{" "}
//                 {certificate.issueDate}
//               </p>

//               <p>
//                 <b>Valid Until:</b>{" "}
//                 {certificate.validUntil}
//               </p>
//             </div>

//             <div className="flex gap-3 mt-6">
//               {/* VIEW */}
//               <button
//                 onClick={() => handleView(certificate)}
//                 className="flex-1 border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
//               >
//                 <FaEye />
//                 View
//               </button>

//               {/* DOWNLOAD */}
//               <button
//                 onClick={() => handleDownload(certificate)}
//                 className="flex-1 bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition"
//               >
//                 <FaDownload />
//                 Download
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* VIEW CERTIFICATE MODAL */}
//       {selectedCertificate && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl">

//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-5 border-b">
//               <div>
//                 <h2 className="text-xl font-bold">
//                   Verification Certificate
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   {selectedCertificate.number}
//                 </p>
//               </div>

//               <button
//                 onClick={() => setSelectedCertificate(null)}
//                 className="text-gray-500 hover:text-red-500 text-xl"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             {/* Certificate */}
//             <div className="p-8">
//               <div className="border-4 border-blue-600 rounded-xl p-8">

//                 <div className="text-center">
//                   <h1 className="text-2xl font-bold text-blue-700">
//                     VERIFICATION CERTIFICATE
//                   </h1>

//                   <p className="text-gray-500 mt-1">
//                     Online Verification System
//                   </p>
//                 </div>

//                 <div className="border-t my-6" />

//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Certificate Number
//                     </span>

//                     <span>
//                       {selectedCertificate.number}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Applicant
//                     </span>

//                     <span>
//                       {selectedCertificate.applicant}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Instrument
//                     </span>

//                     <span>
//                       {selectedCertificate.instrument}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Issue Date
//                     </span>

//                     <span>
//                       {selectedCertificate.issueDate}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Valid Until
//                     </span>

//                     <span>
//                       {selectedCertificate.validUntil}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-semibold">
//                       Status
//                     </span>

//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
//                       {selectedCertificate.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="border-t my-6" />

//                 <p className="text-center text-sm text-gray-500">
//                   This certificate confirms that the above
//                   instrument has successfully completed the
//                   verification process.
//                 </p>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-3 p-5 border-t">
//               <button
//                 onClick={() => setSelectedCertificate(null)}
//                 className="px-5 py-2 border rounded-lg"
//               >
//                 Close
//               </button>

//               <button
//                 onClick={() =>
//                   handleDownload(selectedCertificate)
//                 }
//                 className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
//               >
//                 <FaDownload />
//                 Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Certificates;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";

import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";
import { TableSkeleton } from "../../components/Skeleton";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // GET LOGGED-IN USER'S CERTIFICATES
  // ============================================
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/certificates/mine");

      console.log("My certificates:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.certificates || [];

      setCertificates(data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // ============================================
  // DOWNLOAD PDF
  // ============================================
  const downloadCertificate = async (id) => {
    try {
      const response = await api.get(
        `/certificates/${id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to download certificate"
      );
    }
  };

  // ============================================
  // TABLE COLUMNS
  // ============================================
  const columns = [
    {
      key: "certificateNumber",
      label: "Certificate Number",
    },
    {
      key: "instrumentId",
      label: "Instrument",
    },
    {
      key: "issueDate",
      label: "Issue Date",
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
    },
    {
      key: "status",
      label: "Status",
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          My Certificates
        </h1>

        <p className="text-gray-500 mt-1">
          View and download your verification certificates.
        </p>
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
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-5">
          {error}

          <button
            onClick={fetchCertificates}
            className="ml-4 text-blue-600 underline font-medium"
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
        certificates.length === 0 && (
          <div className="bg-white rounded-lg shadow p-10 text-center">

            <h2 className="text-lg font-semibold text-gray-700">
              No certificates found
            </h2>

            <p className="text-gray-500 mt-2">
              You don't have any verification certificates yet.
            </p>

          </div>
        )}

      {/* ========================================
          TABLE
      ======================================== */}
      {!loading &&
        !error &&
        certificates.length > 0 && (
          <Table
            columns={columns}
            data={certificates}
            renderRow={(certificate) => (
              <tr
                key={certificate.id}
                className="border-b hover:bg-gray-50"
              >

                {/* CERTIFICATE NUMBER */}
                <td className="px-5 py-4 font-medium">
                  {certificate.certificateNumber || "-"}
                </td>

                {/* INSTRUMENT */}
                <td className="px-5 py-4">
                  {certificate.instrumentName || certificate.instrumentId || "-"}
                </td>

                {/* ISSUE DATE */}
                <td className="px-5 py-4">
                  {certificate.issueDate || "-"}
                </td>

                {/* EXPIRY DATE */}
                <td className="px-5 py-4">
                  {certificate.validUntil || certificate.expiryDate || "-"}
                </td>

                {/* STATUS */}
                <td className="px-5 py-4">
                  <StatusBadge
                    status={certificate.status || "ACTIVE"}
                  />
                </td>

                {/* ACTION */}
                <td className="px-5 py-4">
                  <div className="flex gap-4">

                    {/* VIEW */}
                    <Link
                      to={`/applicant/certificates/${certificate.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Certificate"
                    >
                      <FaEye />
                    </Link>

                    {/* DOWNLOAD */}
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-800"
                      title="Download PDF"
                      onClick={() =>
                        downloadCertificate(certificate.id)
                      }
                    >
                      <FaDownload />
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

export default Certificates;

