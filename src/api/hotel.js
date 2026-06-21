import api from "@/api/axios";

export const getAllHotels = async (filter) => {
  try {
    const response = await api.get("/hotels", {
      params: {
        ...filter,
        amenities: filter.amenities?.join(","),
      },
    });
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const getHotelById = async (id) => {
  try {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const createHotel = async (data) => {
  try {
    const response = await api.post(`/hotels`, data);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const updateHotel = async (id, data) => {
  try {
    const response = await api.put(`/hotels/${id}`, data);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const deleteHotel = async (id) => {
  try {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const toggleHotelStatus = async (id) => {
  try {
    const response = await api.patch(`/hotels/${id}/status`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};

export const getMyHotels = async () => {
  try {
    const response = await api.get(`/hotels/vendor/my-hotels`);
    return response.data;
  } catch (err) {
    console.log(`Error occured ${err.message}`);
    throw err;
  }
};
