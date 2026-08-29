import api from "./api";

const unwrap = (response) => response.data;

export const getAdminDashboard = async () => unwrap(await api.get("/admin/dashboard"));
export const getAdminUsers = async () => unwrap(await api.get("/admin/users"));
export const getAdminInspectors = async () => unwrap(await api.get("/admin/inspectors"));
export const getAdminInstruments = async () => unwrap(await api.get("/admin/instruments"));
export const getAdminInstrumentRequests = async () => unwrap(await api.get("/admin/applications"));
export const getAdminInstrumentRequestItems = async () => unwrap(await api.get("/admin/instruments"));
export const getAdminCertificates = async () => unwrap(await api.get("/admin/certificates"));
export const getAdminReports = async () => unwrap(await api.get("/admin/reports"));

export const updateUserRole = async (id, role) =>
  unwrap(await api.put(`/admin/users/${id}/role`, null, { params: { role } }));

export const updateUserActive = async (id, active) =>
  unwrap(await api.put(`/admin/users/${id}/active`, null, { params: { active } }));

export const createInspector = async (inspector) =>
  unwrap(await api.post("/admin/inspectors", inspector));

export const createAdminUser = async (user) =>
  unwrap(await api.post("/admin/applicants", { ...user, role: "APPLICANT" }));

export const assignInstrument = async (instrumentId, inspectorId) =>
  unwrap(await api.put(`/admin/instruments/${instrumentId}/assign`, null, { params: { inspectorId } }));
