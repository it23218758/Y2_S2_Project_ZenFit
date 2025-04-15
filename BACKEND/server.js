const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection Success!");
});

// ✅ Routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

const trainerRouter = require("./routes/trainers");
app.use("/trainer", trainerRouter);

const reservationRoutes = require("./routes/reservations");
app.use("/reservations", reservationRoutes);

const shopRoutes = require("./routes/shopItems");
app.use("/shop", shopRoutes);

const paymentRoutes = require("./routes/payment");
app.use("/payment", paymentRoutes);

const feedbackRoutes = require("./routes/feedback");
app.use("/feedback", feedbackRoutes);

const reservationPaymentsRoute = require("./routes/reservationPayments");
app.use("/reservation-payment", reservationPaymentsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
