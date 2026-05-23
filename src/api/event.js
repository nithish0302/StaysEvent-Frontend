import api from "@/api/axios";

export const getAllEvents = async (filter) => {
  try {
    const response = await api.get("/events", { params: filter });
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await api.post(`/events`, data);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const toggleEventStatus = async (id) => {
  try {
    const response = await api.patch(`/events/${id}/status`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const getMyEvents = async () => {
  try {
    const response = await api.get(`/events/vendor/my-events`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};
