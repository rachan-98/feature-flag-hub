const express = require("express");

const {
  createOrganization,
  getOrganizations,
} = require("../controllers/organizationController");

const { protectSuperAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protectSuperAdmin, createOrganization);
router.get("/", protectSuperAdmin, getOrganizations);

module.exports = router;