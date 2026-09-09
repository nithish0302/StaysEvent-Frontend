import React, { useEffect, useState } from "react";
import { getReviews, createReview, deleteReview } from "@/api/review";
import useAuthStore from "@/store/authStore";
import {
  Star,
  Loader2,
  Trash2,
  TriangleAlert,
  MessageSquare,
} from "lucide-react";

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star
          size={22}
          className={
            n <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200 hover:text-yellow-300 transition-colors"
          }
        />
      </button>
    ))}
  </div>
);

const StarRow = ({ n }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < n ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
      />
    ))}
  </span>
);

const ReviewSection = ({ itemId, itemType }) => {
  const user = useAuthStore((s) => s.user);
  const isCustomer = user?.role === "customer";

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchReviews = async (p = 1) => {
    setLoading(true);
    try {
      const data = await getReviews(itemId, itemType, { page: p, limit: 5 });
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemId) fetchReviews(page);
  }, [itemId, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setFormError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");
    try {
      await createReview({ itemId, itemType, rating, comment });
      setRating(0);
      setComment("");
      setFormSuccess("Review submitted successfully!");
      fetchReviews(1);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setTotal((t) => t - 1);
    } catch {
      // silent
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={20} className="text-green-700" />
        <h2 className="text-xl font-bold text-green-900">Reviews</h2>
        {total > 0 && (
          <span className="text-sm text-gray-400">
            {total} review{total !== 1 ? "s" : ""} · ⭐ {avgRating}
          </span>
        )}
      </div>

      {/* Write a review */}
      {isCustomer && (
        <form
          onSubmit={handleSubmit}
          className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8 flex flex-col gap-4"
        >
          <p className="font-semibold text-green-900 text-sm">Write a Review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border border-green-200 rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:border-green-500 bg-white"
          />
          {formError && (
            <p className="flex items-center gap-1 text-red-600 text-sm">
              <TriangleAlert size={14} /> {formError}
            </p>
          )}
          {formSuccess && (
            <p className="text-emerald-600 text-sm">{formSuccess}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="self-start px-5 py-2 bg-green-900 text-white text-sm rounded-xl flex items-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 size={24} className="animate-spin text-green-600" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-green-100 rounded-2xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-xs shrink-0">
                    {r.customerId?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {r.customerId?.name || "Customer"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRow n={r.rating} />
                  {user?.id === r.customerId?._id && (
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.comment}
                </p>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs font-medium border transition-all ${p === page ? "bg-green-800 text-white border-green-800" : "border-green-200 text-green-800 hover:bg-green-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
