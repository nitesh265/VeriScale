// import api from "./api";

// export const getAssignedApplications = async () => {
//   return await api("/inspections", {
//     method: "GET",
//   });
// };

// export const createInspection = async (inspectionData) => {
//   return await api("/inspections", {
//     method: "POST",
//     body: JSON.stringify(inspectionData),
//   });
// };

// export const updateInspection = async (id, inspectionData) => {
//   return await api(`/inspections/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(inspectionData),
//   });
// };

// export const verifyCertificate = async (certificateNumber) => {
//   return await api("/certificates/verify", {
//     method: "POST",
//     body: JSON.stringify({ certificateNumber }),
//   });
// };
import api from "./api";

export const getCertificates = async () => {

  const response = await api.get(
    "/certificates"
  );

  return response.data;
};

export const getMyCertificates = async () => {

  const response = await api.get(
    "/certificates/mine"
  );

  return response.data;
};

export const getCertificate = async (
  id
) => {

  const response = await api.get(
    `/certificates/${id}`
  );

  return response.data;
};

export const verifyCertificate = async (
  certificateNumber
) => {

  const response = await api.get(
    `/certificates/verify/${certificateNumber}`
  );

  return response.data;
};

export const createCertificate = async (
  applicationId
) => {

  const response = await api.post(
    `/certificates/application/${applicationId}`
  );

  return response.data;
};

export const downloadCertificate = async (
  id
) => {

  const response = await api.get(
    `/certificates/${id}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};