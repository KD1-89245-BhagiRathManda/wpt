const express = require("express");
const path = require("path");

const router = express.Router();

// Serve static images
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, "../resources", filename));
});

module.exports = router; 