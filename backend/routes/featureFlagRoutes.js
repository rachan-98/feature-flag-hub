const express = require("express");

const {
  createFeatureFlag,
  getFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
  checkFeatureFlag,
} = require("../controllers/featureFlagController");

const { protectOrgAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/check", checkFeatureFlag);

router
  .route("/")
  .post(protectOrgAdmin, createFeatureFlag)
  .get(protectOrgAdmin, getFeatureFlags);

router
  .route("/:id")
  .put(protectOrgAdmin, updateFeatureFlag)
  .delete(protectOrgAdmin, deleteFeatureFlag);

module.exports = router;