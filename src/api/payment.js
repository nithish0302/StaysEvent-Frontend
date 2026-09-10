import api from "@/api/axios";

export const createPaymentOrder = async (bookingId) => {
  try {
    const response = await api.post("/payments/create-order", { bookingId });
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

export const verifyPayment = async (data) => {
  try {
    const response = await api.post("/payments/verify", data);
    return response.data;
  } catch (err) {
    console.log(`Error occurred ${err.message}`);
    throw err;
  }
};

// Loads the Razorpay checkout script once and reuses it on subsequent calls.
let razorpayScriptPromise = null;
export const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
};

// Opens the Razorpay checkout modal for a booking and resolves once the
// user has paid (and it's verified server-side) or rejects if they close
// the modal / it fails.
export const payForBooking = async ({ bookingId, onDismiss }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error("Failed to load payment gateway. Check your connection and try again.");
  }

  const { order, keyId, booking } = await createPaymentOrder(bookingId);

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "StayEvents",
      description: "Booking payment",
      order_id: order.id,
      prefill: {
        name: booking.guestName,
        email: booking.guestEmail,
        contact: booking.guestPhone,
      },
      theme: { color: "#1A3C34" },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
          reject(new Error("Payment was cancelled."));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      reject(new Error(resp?.error?.description || "Payment failed. Please try again."));
    });
    rzp.open();
  });
};
