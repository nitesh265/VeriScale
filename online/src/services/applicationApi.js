// import api from "./api";


// export const createApplication = async (applicationData) => {
//   return await api("/applications", {
//     method: "POST",
//     body: JSON.stringify(applicationData),
//   });
// };
// export const registerUser = async (userData) => {
//   return await api("/auth/register", {
//     method: "POST",
//     body: JSON.stringify(userData),
//   });
// };

// export const loginUser = async (credentials) => {
//   return await api("/auth/login", {
//     method: "POST",
//     body: JSON.stringify(credentials),
//   });
// };

// export const getCurrentUser = async () => {
//   return await api("/auth/me", {
//     method: "GET",
//   });
// };

import api from "./api";

export const getApplications = async () => {

  const response = await api.get(
    "/applications"
  );

  return response.data;
};

export const getInspectorApplications = async (inspectorId) => {
  const response = await api.get(
    `/applications/inspector/${inspectorId}`
  );

  return response.data;
};

export const assignInspector = async (
  applicationId,
  inspectorId
) => {

  const response = await api.put(
    `/applications/${applicationId}/assign`,
    null,
    {
      params: {
        inspectorId,
      },
    }
  );

  return response.data;
};

export const updateApplicationStatus =
  async (
    applicationId,
    status
  ) => {

    const response = await api.put(
      `/applications/${applicationId}/status`,
      null,
      {
        params: {
          status,
        },
      }
    );

    return response.data;
  };

export const approveApplication =
  async (
    applicationId
  ) => {

    const response = await api.put(
      `/applications/${applicationId}/approve`
    );

    return response.data;
  };

export const rejectApplication =
  async (
    applicationId,
    remarks
  ) => {

    const response = await api.put(
      `/applications/${applicationId}/reject`,
      null,
      {
        params: {
          remarks,
        },
      }
    );

    return response.data;
  };