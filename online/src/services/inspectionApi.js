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

import api from "./api";

export const getInspections = async () => {

  const response = await api.get(
    "/inspections"
  );

  return response.data;
};

export const getMyInspections = async () => {

  const response = await api.get(
    "/inspections/mine"
  );

  return response.data;
};

export const getInspectionByApplication =
  async (
    applicationId
  ) => {

    const response = await api.get(
      `/inspections/application/${applicationId}`
    );

    return response.data;
  };

export const getInspection = async (id) => {
  const response = await api.get(`/inspections/${id}`);
  return response.data;
};

export const createInspection = async (
  inspection
) => {

  const response = await api.post(
    "/inspections",
    inspection
  );

  return response.data;
};