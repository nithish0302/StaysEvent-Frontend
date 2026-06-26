import React, { useEffect, useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import {
  ImagePlus,
  CloudUpload,
  Trash2,
  X,
  TriangleAlert,
  Loader2,
  RotateCcw,
} from "lucide-react";

const PhotoUploadSection = ({
  preset,
  onUrlsChange,
  onUploadingChange,
  error,
  maxPhotos = 10,
}) => {
  const {
    photos,
    uploadedUrls,
    isUploading,
    canAddMore,
    addFiles,
    removePhoto,
    retryUpload,
  } = useCloudinaryUpload(preset, maxPhotos);

  const [previewImage, setPreviewImage] = useState(null);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  // keep parent form in sync
  useEffect(() => {
    onUrlsChange(uploadedUrls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedUrls.join(",")]);

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  useEffect(() => {
    document.body.style.overflow =
      previewImage || photoToDelete ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [previewImage, photoToDelete]);

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const confirmDelete = () => {
    if (photoToDelete) removePhoto(photoToDelete);
    setPhotoToDelete(null);
  };

  return (
    <div className="bg-white border border-green-100 rounded-2xl mb-6 p-4">
      <div className="flex gap-2 items-center mb-4">
        <ImagePlus
          className="text-orange-600 border border-orange-50 py-2 px-1 bg-orange-100 rounded-sm shrink-0"
          size={32}
        />
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-green-800 font-semibold">
          Photos
        </h1>
      </div>

      {canAddMore && (
        <label
          htmlFor="photo-upload-input"
          className={`flex flex-col items-center justify-center h-44 sm:h-52 px-4 text-center border-2 border-dashed rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all duration-200
            ${error ? "border-red-300" : "border-green-200"}`}
        >
          <CloudUpload size={36} className="text-green-700 mb-3" />
          <p className="text-base sm:text-xl font-medium text-green-900">
            Drag photos here or click to upload
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Max {maxPhotos} photos · {photos.length}/{maxPhotos} used
          </p>
          <input
            id="photo-upload-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative h- rounded-xl border border-green-200 overflow-hidden bg-white shadow-sm"
            >
              {/* Delete button */}
              <button
                type="button"
                onClick={() => setPhotoToDelete(photo.id)}
                className="absolute top-2 right-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 size={15} />
              </button>

              <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              <img
                src={photo.previewUrl}
                alt={`Preview ${index + 1}`}
                onClick={() =>
                  photo.status === "done" && setPreviewImage(photo.previewUrl)
                }
                className={`w-full h-full object-cover transition-all duration-200
                  ${photo.status === "done" ? "cursor-pointer hover:scale-105" : "opacity-50"}`}
              />

              {/* Uploading overlay */}
              {photo.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
              )}

              {/* Error overlay — tap to retry */}
              {photo.status === "error" && (
                <button
                  type="button"
                  onClick={() => retryUpload(photo.id)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-500/80 text-white text-xs"
                >
                  <RotateCcw size={18} />
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full screen preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}

      {/* Delete confirm modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <TriangleAlert size={28} className="text-red-500" />
              <h2 className="text-xl font-semibold text-green-900">
                Delete Photo?
              </h2>
            </div>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this photo?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadSection;
