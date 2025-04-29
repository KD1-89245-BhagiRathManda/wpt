const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config.js");
const utils = require("./utils.js");

const app = express();
app.use(cors());
app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  // Skip authentication for these routes
  if (
    req.url === "/users/login" ||
    req.url === "/users/register" ||
    req.url.startsWith("/images/")
  ) {
    return next();
  }

  // Check if authorization header exists
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.send(utils.createErrorResult("Authorization header is missing"));
  }

  // Check if token exists in authorization header
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.send(utils.createErrorResult("Token is missing"));
  }

  try {
    const payload = jwt.verify(token, config.secret);
    req.userId = payload.userId;

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpirationTime = payload.exp;

    if (currentTime > tokenExpirationTime) {
      return res.send(utils.createErrorResult("Token has expired"));
    }

    next();
  } catch (error) {
    res.send(utils.createErrorResult("Token is invalid"));
  }
});

// Import routes
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const imageRouter = require("./routes/image");
const propertyRouter = require("./routes/property");
const bookingRouter = require("./routes/booking");

// Use routes
app.use("/users", userRouter);
app.use("/category", categoryRouter);
app.use("/images", imageRouter);
app.use("/property", propertyRouter);
app.use("/bookings", bookingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(utils.createErrorResult("Something broke!"));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

