import api from "@/api/axios";

export const getWishlist = async () => {
  try {
    const response = await api.get("/users/wishlist");
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const addToWishlist = async (itemId, itemType) => {
  try {
    const response = await api.post("/users/wishlist", { itemId, itemType });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const removeFromWishlist = async (itemId, itemType) => {
  try {
    const response = await api.delete("/users/wishlist", { data: { itemId, itemType } });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};
