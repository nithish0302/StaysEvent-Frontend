import api from "@/api/axios";

export const createBooking = async (data) => {
  try {
    const response = await api.post("/bookings", data);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getMyBookings = async (params = {}) => {
  try {
    const response = await api.get("/bookings/my-bookings", { params });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const cancelBooking = async (id, cancelReason) => {
  try {
    const response = await api.patch(`/bookings/${id}/cancel`, { cancelReason });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getVendorBookings = async (params = {}) => {
  try {
    const response = await api.get("/bookings/vendor/all", { params });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await api.patch(`/bookings/vendor/${id}/status`, { status });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getVendorStats = async () => {
  try {
    const response = await api.get("/bookings/vendor/stats");
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};
