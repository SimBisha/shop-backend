// const express = require("express");
// const app = express();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// const userRoute = require("./routes/user");
// const authRoute = require("./routes/auth");
// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");

// // Enable CORS - IMPORTANT FOR CROSS DEVICE/DOMAIN ACCESS
// app.use(cors({
//   origin: "*", // ⚠️ or use specific frontend domain in production
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Body parser
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log("DB po funksionon"))
//   .catch((err) => console.error("MongoDB Error:", err));

// // API routes
// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);
// app.use("/api/carts", cartRoute);
// app.use("/api/orders", orderRoute);

// // Graceful shutdown
// process.on("SIGINT", () => {
//   console.log("Closing server...");
//   server.close(() => {
//     console.log("Server closed");
//     process.exit(0);
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`Backend server is running on port ${PORT}`);
// });





const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import route files
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

// Enable CORS - Critical for Cross-Origin Requests
app.use(cors({
  origin: "https://shop-5d140.web.app/", // In production, replace "*" with your frontend URL (e.g., "http://your-frontend.com")
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// Middleware for parsing JSON requests
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Database connection established."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process if the database fails to connect
  });

// Set up API routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("Gracefully shutting down the server...");
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
