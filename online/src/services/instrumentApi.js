// import api from "./api";

// export const getInstruments = async () => {
//   return await api("/instruments", {
//     method: "GET",
//   });
// };

// export const createInstrument = async (instrumentData) => {
//   return await api("/instruments", {
//     method: "POST",
//     body: JSON.stringify(instrumentData),
//   });
// };

// export const getInstrumentById = async (id) => {
//   return await api(`/instruments/${id}`, {
//     method: "GET",
//   });
// };

// export const updateInstrument = async (id, instrumentData) => {
//   return await api(`/instruments/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(instrumentData),
//   });
// };

// export const deleteInstrument = async (id) => {
//   return await api(`/instruments/${id}`, {
//     method: "DELETE",
//   });
// };

import api from "./api";

export const getInstruments = async () => {

  const response = await api.get(
    "/instruments"
  );

  return response.data;
};

export const getMyInstruments = async () => {

  const response = await api.get(
    "/instruments/mine"
  );

  return response.data;
};

export const getAssignedInstruments = async () => {
  const response = await api.get("/instruments/assigned");
  return response.data;
};

export const getInstrument = async (id) => {

  const response = await api.get(
    `/instruments/${id}`
  );

  return response.data;
};

export const createInstrument = async (
  instrument
) => {

  const response = await api.post(
    "/instruments",
    instrument
  );

  return response.data;
};

export const updateInstrument = async (
  id,
  instrument
) => {

  const response = await api.put(
    `/instruments/${id}`,
    instrument
  );

  return response.data;
};

export const deleteInstrument = async (
  id
) => {

  const response = await api.delete(
    `/instruments/${id}`
  );

  return response.data;
};