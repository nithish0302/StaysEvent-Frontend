import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const uploadToCloudinary = async (file, preset) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", preset);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
  );

  return data.secure_url;
};
