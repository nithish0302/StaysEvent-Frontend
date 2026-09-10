import { updateVendorDetails } from "@/api/auth";
import routes from "@/config/routes";
import useAuthStore from "@/store/authStore";
import { uploadDocumentToCloudinary } from "@/utils/cloudinary";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, Loader2, CheckCircle2, UploadCloud } from "lucide-react";

const VendorDetailsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    businessAddress: "",
    city: "",
    idProofUrl: "",
    businessDocUrl: "",
  });
  const [error, setError] = useState({});
  const [uploading, setUploading] = useState({ idProof: false, businessDoc: false });

  const handleDocUpload = async (key, field, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const url = await uploadDocumentToCloudinary(
        file,
        import.meta.env.VITE_CLOUDINARY_HOTEL_PRESET,
      );
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      console.log("Document upload failed", err);
      setError((prev) => ({ ...prev, [field]: "Upload failed — please try again" }));
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    let error = {};

    const fields = [
      {
        key: "businessName",
        label: "Business Name",
      },
      {
        key: "businessType",
        label: "Business Type",
      },
      {
        key: "gstNumber",
        label: "GST Number",
      },
      {
        key: "panNumber",
        label: "PAN Number",
      },
      {
        key: "businessAddress",
        label: "Business Address",
      },
      {
        key: "city",
        label: "City",
      },
    ];

    fields.forEach((field) => {
      if (!formData[field.key].trim()) {
        error[field.key] = `${field.label} is required`;
      }
    });

    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
      error.gstNumber = "Invalid GST Number";
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (formData.panNumber && !panRegex.test(formData.panNumber)) {
      error.panNumber = "Invalid PAN Number";
    }

    setError(error);

    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await updateVendorDetails(formData);
      useAuthStore.getState().setUser(data.user);
      toast.success("Business details submitted for approval");
      navigate(routes.vendor.pendingApproval);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't submit your details — please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-3 sm:p-5">
      <div className="bg-green-100 max-w-7xl rounded-xl p-4 sm:p-6 mx-auto shadow">
        {/* Header */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center">
          <h2 className="font-sans text-2xl sm:text-3xl text-green-900 text-center font-bold">
            COMPLETE YOUR PROFILE
          </h2>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="submit"
            className=" hidden sm:block absolute right-0 border-2 border-green-900 bg-green-900 text-yellow-300 font-normal    text-xl px-5 py-2 rounded-lg hover:bg-green-800 "
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>

        <p className="section-eyebrow text-center mt-2 ">
          Tell us about your business
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className=" grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-4 font-sans font-semibold mt-4 "
        >
          {/* Business Name */}
          <div>
            <p className="pt-2">Business Name :</p>

            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="eg: The Imperial Nest"
              className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
            />
            {error.businessName && (
              <p className="text-red-500 text-sm mt-1">{error.businessName}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <p className="pt-2">Business Type :</p>

            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full appearance-none px-4 py-3 border border-green-300 rounded-xl bg-white text-green-900 text-sm outline-none cursor-pointer shadow-sm focus:border-green-700 focus:ring-2 focus:ring-green-700/10 transition-all duration-200"
            >
              <option value="">Select Type</option>
              <option value="hotel">Hotel</option>
              <option value="event">Event</option>
              <option value="both">Hotels and Event</option>
            </select>
            {error.businessType && (
              <p className="text-red-500 text-sm mt-1">{error.businessType}</p>
            )}
          </div>

          {/* GST */}
          <div>
            <p className="pt-2">GST Number :</p>

            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="29ABCDE1234F1Z5"
              className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
            />
            {error.gstNumber && (
              <p className="text-red-500 text-sm mt-1">{error.gstNumber}</p>
            )}
          </div>

          {/* PAN */}
          <div>
            <p className="pt-2">PAN Number :</p>

            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
            />
            {error.panNumber && (
              <p className="text-red-500 text-sm mt-1">{error.panNumber}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <p className="pt-2">Business Address :</p>

            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter business address"
              rows={4}
              className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200 resize-none"
            />
            {error.businessAddress && (
              <p className="text-red-500 text-sm mt-1">
                {error.businessAddress}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <p>City :</p>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="eg: Chennai"
              className="w-full px-4 py-3 border border-green-200 rounded-md bg-white text-sm text-green-900 outline-none mt-1 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-green-700/60 transition-all duration-200"
            />
            {error.city && (
              <p className="text-red-500 text-sm mt-1">{error.city}</p>
            )}
          </div>

          {/* ID Proof */}
          <div>
            <p className="pt-2">ID Proof (optional):</p>
            <label className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-green-300 rounded-md bg-white text-sm text-green-700 mt-1 cursor-pointer hover:bg-green-50 transition-all">
              {uploading.idProof ? (
                <Loader2 size={16} className="animate-spin" />
              ) : formData.idProofUrl ? (
                <CheckCircle2 size={16} className="text-green-700" />
              ) : (
                <UploadCloud size={16} />
              )}
              <span className="truncate">
                {uploading.idProof
                  ? "Uploading..."
                  : formData.idProofUrl
                    ? "Uploaded — click to replace"
                    : "Upload Aadhaar / PAN / passport scan"}
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocUpload("idProof", "idProofUrl", e.target.files?.[0])}
              />
            </label>
            {formData.idProofUrl && (
              <a href={formData.idProofUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-700 mt-1">
                <FileText size={12} /> View uploaded file
              </a>
            )}
            {error.idProofUrl && (
              <p className="text-red-500 text-sm mt-1">{error.idProofUrl}</p>
            )}
          </div>

          {/* Business Doc */}
          <div>
            <p className="pt-2">Business Document (optional):</p>
            <label className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-green-300 rounded-md bg-white text-sm text-green-700 mt-1 cursor-pointer hover:bg-green-50 transition-all">
              {uploading.businessDoc ? (
                <Loader2 size={16} className="animate-spin" />
              ) : formData.businessDocUrl ? (
                <CheckCircle2 size={16} className="text-green-700" />
              ) : (
                <UploadCloud size={16} />
              )}
              <span className="truncate">
                {uploading.businessDoc
                  ? "Uploading..."
                  : formData.businessDocUrl
                    ? "Uploaded — click to replace"
                    : "Upload GST certificate / business license"}
              </span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocUpload("businessDoc", "businessDocUrl", e.target.files?.[0])}
              />
            </label>
            {formData.businessDocUrl && (
              <a href={formData.businessDocUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-700 mt-1">
                <FileText size={12} /> View uploaded file
              </a>
            )}
            {error.businessDocUrl && (
              <p className="text-red-500 text-sm mt-1">{error.businessDocUrl}</p>
            )}
          </div>

          <div className="md:col-span-2 sm:hidden mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-green-900 bg-green-900 text-yellow-300 font-normal text-lg px-5 py-2 rounded-lg hover:bg-green-800"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorDetailsPage;
