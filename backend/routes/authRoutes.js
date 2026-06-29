const express = require("express");

const {
  superAdminLogin,
  orgAdminSignup,
  orgAdminLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/super-admin/login", superAdminLogin);
router.post("/org-admin/signup", orgAdminSignup);
router.post("/org-admin/login", orgAdminLogin);

module.exports = router;