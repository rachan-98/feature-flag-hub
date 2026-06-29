const User = require("../models/User");
const Organization = require("../models/Organization");
const generateToken = require("../utils/generateToken");

const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.SUPER_ADMIN_EMAIL ||
    password !== process.env.SUPER_ADMIN_PASSWORD
  ) {
    res.status(401);
    throw new Error("Invalid super admin credentials");
  }

  const token = generateToken({
    role: "super_admin",
    email,
  });

  res.status(200).json({
    success: true,
    message: "Super admin login successful",
    data: {
      email,
      role: "super_admin",
      token,
    },
  });
};

const orgAdminSignup = async (req, res) => {
  const { name, email, password, organizationSlug } = req.body;

  if (!name || !email || !password || !organizationSlug) {
    res.status(400);
    throw new Error("Name, email, password and organizationSlug are required");
  }

  const organization = await Organization.findOne({ slug: organizationSlug });

  if (!organization) {
    res.status(404);
    throw new Error("Organization not found");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "org_admin",
    organization: organization._id,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
    organization: user.organization,
  });

  res.status(201).json({
    success: true,
    message: "Organization admin signup successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
      },
      token,
    },
  });
};

const orgAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).populate("organization");

  if (!user || user.role !== "org_admin") {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    organization: user.organization._id,
  });

  res.status(200).json({
    success: true,
    message: "Organization admin login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: {
        id: user.organization._id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
      token,
    },
  });
};

module.exports = {
  superAdminLogin,
  orgAdminSignup,
  orgAdminLogin,
};