import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import ProtectedRoute from "./components/common/ProtectedRoute";

// =========================
// AUTH PAGES
// =========================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =========================
// LAYOUTS
// =========================
import ApplicantLayout from "./layouts/ApplicantLayout";
import InspectorLayout from "./layouts/InspectorLayout";
import AdminLayout from "./layouts/AdminLayout";

// =========================
// APPLICANT
// =========================
import ApplicantDashboard from "./pages/applicant/Dashboard";
import MyInstruments from "./pages/applicant/MyInstruments";
import AddInstrument from "./pages/applicant/AddInstrument";
import EditInstrument from "./pages/applicant/EditInstrument";
import InstrumentDetails from "./pages/applicant/InstrumentDetails";
import Certificates from "./pages/applicant/certificate";
import CertificateDetails from "./pages/applicant/CertificateDetails";

// =========================
// INSPECTOR
// =========================
import InspectorDashboard from "./pages/inspector/Dashboard";
import AssignedApplications from "./pages/inspector/assignedApplications";
import Inspection from "./pages/inspector/Inspection";
import InspectionHistory from "./pages/inspector/InspectionHistory";
import InspectionDetails from "./pages/inspector/InspectionDetails";

// =========================
// ADMIN
// =========================
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Instruments from "./pages/admin/Instruments";
import InstrumentRequests from "./pages/admin/InstrumentRequests";
import Inspectors from "./pages/admin/Inspectors";
import AdminCertificates from "./pages/admin/Certificates";
import AdminCertificateDetails from "./pages/admin/CertificateDetails";
import Reports from "./pages/admin/Reports";

// =========================
// PUBLIC
// =========================
import VerifyCertificate from "./pages/public/VerifyCertificate";

function App() {
  return (
    <AuthProvider>
      <AppProvider>

        <Routes>

          {/* ==================================
              LOGIN
          ================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ==================================
              REGISTER
          ================================== */}

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ==================================
              PUBLIC CERTIFICATE VERIFICATION
          ================================== */}

          <Route
            path="/verify-certificate"
            element={<VerifyCertificate />}
          />

          {/* ==================================
              APPLICANT
          ================================== */}

          <Route
            path="/applicant"
            element={
              <ProtectedRoute
                allowedRoles={["APPLICANT"]}
              >
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<ApplicantDashboard />}
            />

            <Route
              path="instruments"
              element={<MyInstruments />}
            />

            <Route
              path="instruments/add"
              element={<AddInstrument />}
            />

            <Route
              path="instruments/:id/edit"
              element={<EditInstrument />}
            />

            <Route
              path="instruments/:id"
              element={<InstrumentDetails />}
            />

            <Route
              path="certificates"
              element={<Certificates />}
            />

            <Route
              path="certificates/:id"
              element={<CertificateDetails />}
            />

          </Route>

          {/* ==================================
              INSPECTOR
          ================================== */}

          <Route
            path="/inspector"
            element={
              <ProtectedRoute
                allowedRoles={["INSPECTOR"]}
              >
                <InspectorLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<InspectorDashboard />}
            />

            <Route
              path="applications"
              element={<AssignedApplications />}
            />

            <Route
              path="inspection/:id"
              element={<Inspection />}
            />

            <Route
              path="history"
              element={<InspectionHistory />}
            />

            <Route
              path="history/:id"
              element={<InspectionDetails />}
            />

          </Route>

          {/* ==================================
              ADMIN
          ================================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="applicants"
              element={<Users />}
            />

            <Route
              path="instruments"
              element={<Instruments />}
            />

            <Route
              path="instrument-requests"
              element={<InstrumentRequests />}
            />

            <Route
              path="inspectors"
              element={<Inspectors />}
            />

            <Route
              path="certificates"
              element={<AdminCertificates />}
            />

            <Route
              path="certificates/:id"
              element={<AdminCertificateDetails />}
            />

            <Route
              path="reports"
              element={<Reports />}
            />

          </Route>

          {/* ==================================
              DEFAULT
          ================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* ==================================
              UNKNOWN URL
          ================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>

      </AppProvider>
    </AuthProvider>
  );
}

export default App;

// import {
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { AuthProvider } from "./context/AuthContext";
// import { AppProvider } from "./context/AppContext";

// import ApplicantLayout from "./layouts/ApplicantLayout";
// import InspectorLayout from "./layouts/InspectorLayout";
// import AdminLayout from "./layouts/AdminLayout";

// import ApplicantDashboard from "./pages/applicant/Dashboard";
// import MyInstruments from "./pages/applicant/MyInstruments";
// import AddInstrument from "./pages/applicant/AddInstrument";
// import Applications from "./pages/applicant/Applications";
// import NewApplication from "./pages/applicant/NewApplication";
// import ApplicationDetails from "./pages/applicant/ApplicationDetails";
// import Certificates from "./pages/applicant/certificate";

// import InspectorDashboard from "./pages/inspector/Dashboard";
// import AssignedApplications from "./pages/inspector/assignedApplications";
// import Inspection from "./pages/inspector/Inspection";
// import InspectionHistory from "./pages/inspector/InspectionHistory";

// import AdminDashboard from "./pages/admin/Dashboard";
// import Users from "./pages/admin/Users";
// import Instruments from "./pages/admin/Instruments";
// import AdminApplications from "./pages/admin/Applications";
// import Inspectors from "./pages/admin/Inspectors";
// import AdminCertificates from "./pages/admin/Certificates";
// import Reports from "./pages/admin/Reports";

// import VerifyCertificate from "./pages/public/VerifyCertificate";

// function App() {
//   return (
//     <AuthProvider>
//       <AppProvider>
//         <Routes>

//           {/* APPLICANT */}
//           <Route path="/applicant" element={<ApplicantLayout />}>
//             <Route index element={<Navigate to="dashboard" />} />

//             <Route
//               path="dashboard"
//               element={<ApplicantDashboard />}
//             />

//             <Route
//               path="instruments"
//               element={<MyInstruments />}
//             />

//             <Route
//               path="instruments/add"
//               element={<AddInstrument />}
//             />

//             <Route
//               path="applications"
//               element={<Applications />}
//             />

//             <Route
//               path="applications/new"
//               element={<NewApplication />}
//             />

//             <Route
//               path="applications/:id"
//               element={<ApplicationDetails />}
//             />

//             <Route
//               path="certificates"
//               element={<Certificates />}
//             />
//           </Route>

//           {/* INSPECTOR */}
//           <Route path="/inspector" element={<InspectorLayout />}>
//             <Route index element={<Navigate to="dashboard" />} />

//             <Route
//               path="dashboard"
//               element={<InspectorDashboard />}
//             />

//             <Route
//               path="applications"
//               element={<AssignedApplications />}
//             />

//             <Route
//               path="inspection/:id"
//               element={<Inspection />}
//             />

//             <Route
//               path="history"
//               element={<InspectionHistory />}
//             />
//           </Route>

//           {/* ADMIN */}
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<Navigate to="dashboard" />} />

//             <Route
//               path="dashboard"
//               element={<AdminDashboard />}
//             />

//             <Route
//               path="users"
//               element={<Users />}
//             />

//             <Route
//               path="instruments"
//               element={<Instruments />}
//             />

//             <Route
//               path="applications"
//               element={<AdminApplications />}
//             />

//             <Route
//               path="inspectors"
//               element={<Inspectors />}
//             />

//             <Route
//               path="certificates"
//               element={<AdminCertificates />}
//             />

//             <Route
//               path="reports"
//               element={<Reports />}
//             />
//           </Route>

//           {/* PUBLIC CERTIFICATE VERIFICATION */}
//           <Route
//             path="/verify-certificate"
//             element={<VerifyCertificate />}
//           />

//           {/* DEFAULT */}
//           <Route
//             path="*"
//             element={<Navigate to="/applicant/dashboard" />}
//           />

//         </Routes>
//       </AppProvider>
//     </AuthProvider>
//   );
// }

// export default App;