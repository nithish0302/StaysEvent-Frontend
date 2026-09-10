import api from "@/api/axios";

export const getReviews = async (itemId, itemType, params = {}) => {
  try {
    const response = await api.get("/reviews", { params: { itemId, itemType, ...params } });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const createReview = async (data) => {
  try {
    const response = await api.post("/reviews", data);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

// Vendor replies to a review on their own listing
export const replyToReview = async (id, text) => {
  try {
    const response = await api.patch(`/reviews/${id}/reply`, { text });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const deleteReviewReply = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}/reply`);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};
