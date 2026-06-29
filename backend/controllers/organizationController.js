const Organization = require("../models/Organization");
const createSlug = require("../utils/createSlug");

const createOrganization = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Organization name is required");
  }

  const slug = createSlug(name);

  const existingOrganization = await Organization.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingOrganization) {
    res.status(400);
    throw new Error("Organization already exists");
  }

  const organization = await Organization.create({
    name,
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Organization created successfully",
    data: organization,
  });
};

const getOrganizations = async (req, res) => {
  const organizations = await Organization.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: organizations.length,
    data: organizations,
  });
};

module.exports = {
  createOrganization,
  getOrganizations,
};