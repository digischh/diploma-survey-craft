const express = require("express");
const router = express.Router();
const path = require("path");

module.exports = (pool) => {
  router.get("/download/styles", (req, res) => {
    const filePath = path.join(
      __dirname,
      "..",
      "files",
      "DashboardChartStyles.css"
    );
    res.download(filePath);
  });

  return router;
};
