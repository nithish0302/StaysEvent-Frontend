import api from "@/api/axios";

export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getVendors = async (params = {}) => {
  try {
    const response = await api.get("/admin/vendors", { params });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const updateVendorStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/vendors/${id}/status`, { status });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

// itemType: "hotel" | "event"
export const toggleFeaturedListing = async (itemType, id) => {
  try {
    const response = await api.patch(`/admin/listings/${itemType}/${id}/feature`);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const getAllBookingsAdmin = async (params = {}) => {
  try {
    const response = await api.get("/admin/bookings", { params });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};
