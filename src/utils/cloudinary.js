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

// For non-image documents (PDF, ID proof scans, etc). Uses Cloudinary's
// "auto" resource type endpoint so both images and PDFs are accepted through
// the same unsigned upload preset used for listing photos.
export const uploadDocumentToCloudinary = async (file, preset) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    formData,
  );

  return data.secure_url;
};
