import api from "./axios";

export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (err) {
    console.log(`Error Occurred ${err.message}`);
    throw err;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (err) {
    console.log(`Error Occurred ${err.message}`);
    throw err;
  }
};

export const updateRole = async (data) => {
  try {
    const response = await api.put("/auth/update-role", data);
    return response.data;
  } catch (err) {
    console.log(`Error Occurred ${err.message}`);
    throw err;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (err) {
    console.log(`Error Occurred ${err.message}`);
    throw err;
  }
};

export const googleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

export const updateVendorDetails = async (data) => {
  try {
    const response = await api.put("/auth/update-vendor-details", data);
    return response.data;
  } catch (err) {
    console.log(`Error Occurred ${err.message}`);
    throw err;
  }
};
