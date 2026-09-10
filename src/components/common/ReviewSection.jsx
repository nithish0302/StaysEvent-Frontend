import React, { useEffect, useState } from "react";
import { getReviews, createReview, deleteReview, replyToReview, deleteReviewReply } from "@/api/review";
import useAuthStore from "@/store/authStore";
import {
  Star,
  Loader2,
  Trash2,
  TriangleAlert,
  MessageSquare,
  CornerDownRight,
  ShieldAlert,
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

// Vendor's reply block under a review — shown to everyone once posted,
// editable only by the owning vendor (isOwner).
const VendorReplyBlock = ({ review, isOwner, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.vendorReply?.text || "");
  const [saving, setSaving] = useState(false);

  const hasReply = !!review.vendorReply?.text;

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave(review._id, text.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!hasReply && !isOwner) return null;

  return (
    <div className="ml-6 mt-2 pl-3 border-l-2 border-green-200">
      {hasReply && !editing ? (
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-1.5">
            <CornerDownRight size={13} className="text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-green-800">Vendor response</p>
              <p className="text-sm text-gray-600">{review.vendorReply.text}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditing(true)} className="text-[11px] text-green-700 hover:underline">
                Edit
              </button>
              <button onClick={() => onDelete(review._id)} className="text-[11px] text-red-500 hover:underline">
                Remove
              </button>
            </div>
          )}
        </div>
      ) : isOwner ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Reply to this review as the vendor..."
            className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:border-green-500 bg-white"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !text.trim()}
              className="px-3 py-1.5 bg-green-800 text-white text-xs rounded-lg disabled:opacity-60 flex items-center gap-1.5"
            >
              {saving && <Loader2 size={12} className="animate-spin" />}
              {hasReply ? "Update Reply" : "Post Reply"}
            </button>
            {editing && (
              <button onClick={() => { setEditing(false); setText(review.vendorReply?.text || ""); }} className="text-xs text-gray-400 hover:underline">
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ReviewSection = ({ itemId, itemType, ownerVendorId }) => {
  const user = useAuthStore((s) => s.user);
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";
  // Only the vendor who owns this listing may reply — ownerVendorId is
  // passed down from the detail page (populated from hotel/event.vendorId).
  const isOwnerVendor = user?.role === "vendor" && ownerVendorId && user.id === ownerVendorId;

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasReviewed, setHasReviewed] = useState(false);

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
      const list = data.reviews || [];
      setReviews(list);
      setAvgRating(data.avgRating || 0);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (user?.id && list.some((r) => r.customerId?._id === user.id)) {
        setHasReviewed(true);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemId) fetchReviews(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setHasReviewed(true);
      fetchReviews(1);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit review.";
      setFormError(message);
      // Backend rejected it as a duplicate — lock the form so they can't
      // keep retrying; their existing review is already listed below.
      if (err.response?.status === 400 && /already reviewed/i.test(message)) {
        setHasReviewed(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => {
        const deleted = prev.find((r) => r._id === reviewId);
        if (deleted && deleted.customerId?._id === user?.id) {
          setHasReviewed(false);
        }
        return prev.filter((r) => r._id !== reviewId);
      });
      setTotal((t) => t - 1);
    } catch {
      // silent
    }
  };

  const handleReplySave = async (reviewId, text) => {
    const data = await replyToReview(reviewId, text);
    setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, vendorReply: data.review.vendorReply } : r)));
  };

  const handleReplyDelete = async (reviewId) => {
    await deleteReviewReply(reviewId);
    setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, vendorReply: { text: null, repliedAt: null } } : r)));
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

      {/* Already reviewed — no second submission allowed */}
      {isCustomer && hasReviewed && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8 text-sm text-green-800">
          You've already reviewed this. You can edit your review by deleting it below and writing a new one.
        </div>
      )}

      {/* Write a review */}
      {isCustomer && !hasReviewed && (
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

      {isOwnerVendor && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
          <CornerDownRight size={13} /> You can reply to reviews on this listing below.
        </div>
      )}

      {isAdmin && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
          <ShieldAlert size={13} /> Admin moderation — you can remove any review below.
        </div>
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
                  {(user?.id === r.customerId?._id || isAdmin) && (
                    <button
                      onClick={() => handleDelete(r._id)}
                      title={isAdmin && user?.id !== r.customerId?._id ? "Remove review (admin)" : "Delete your review"}
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

              <VendorReplyBlock
                review={r}
                isOwner={isOwnerVendor}
                onSave={handleReplySave}
                onDelete={handleReplyDelete}
              />
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
