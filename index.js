const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user").default;
const authRoute = require("./routes/auth").default;
const productRoute = require("./routes/product").default;
const cartRoute = require("./routes/cart").default;
const orderRoute = require("./routes/order").default;
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB po funksionon"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

process.on("SIGINT", () => {
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
