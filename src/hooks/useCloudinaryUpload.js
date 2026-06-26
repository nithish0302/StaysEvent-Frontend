import { useState, useCallback, useRef, useEffect } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";

let counter = 0;
const nextId = () => `photo_${Date.now()}_${++counter}`;

export const useCloudinaryUpload = (preset, maxPhotos = 10) => {
  const [photos, setPhotos] = useState([]);
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const uploadedUrls = photos
    .filter((p) => p.status === "done")
    .map((p) => p.url);

  const isUploading = photos.some((p) => p.status === "uploading");
  const canAddMore = photos.length < maxPhotos;

  const runUpload = useCallback(
    (id, file) => {
      uploadToCloudinary(file, preset)
        .then((url) => {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, url, status: "done", error: null } : p,
            ),
          );
        })
        .catch(() => {
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    status: "error",
                    error: "Upload failed — tap to retry",
                  }
                : p,
            ),
          );
        });
    },
    [preset],
  );

  const addFiles = useCallback(
    (fileList) => {
      const remainingSlots = maxPhotos - photosRef.current.length;
      if (remainingSlots <= 0) return;

      const files = Array.from(fileList).slice(0, remainingSlots);

      const newEntries = files.map((file) => ({
        id: nextId(),
        file,
        previewUrl: URL.createObjectURL(file),
        url: null,
        status: "uploading",
        error: null,
      }));

      setPhotos((prev) => [...prev, ...newEntries]);
      newEntries.forEach((entry) => runUpload(entry.id, entry.file));
    },
    [maxPhotos, runUpload],
  );

  const removePhoto = useCallback((id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const retryUpload = useCallback(
    (id) => {
      const entry = photosRef.current.find((p) => p.id === id);
      if (!entry) return;
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "uploading", error: null } : p,
        ),
      );
      runUpload(id, entry.file);
    },
    [runUpload],
  );

  const reset = useCallback(() => {
    photosRef.current.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
    setPhotos([]);
  }, []);

  return {
    photos,
    uploadedUrls,
    isUploading,
    canAddMore,
    addFiles,
    removePhoto,
    retryUpload,
    reset,
  };
};
