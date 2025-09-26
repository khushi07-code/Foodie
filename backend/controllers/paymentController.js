// import Razorpay from "razorpay";
// import dotenv from "dotenv";
// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: amount * 100, // convert to paise
//       currency: "INR",
//       receipt: `order_rcptid_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Payment order creation failed",
//       error: error.message,
//     });
//   }
// };

// paymentController.js
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

// Initialize Razorpay or stub
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn(
    "⚙️  Razorpay credentials missing—running in STUB mode for development"
  );
  razorpay = {
    orders: {
      create: (opts) =>
        Promise.resolve({
          id: `stub_order_${Date.now()}`,
          amount: opts.amount,
          currency: opts.currency,
          status: "created (stub)",
        }),
    },
  };
}

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status || "created",
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.message,
    });
  }
};
