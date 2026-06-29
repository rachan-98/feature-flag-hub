const FeatureFlag = require("../models/FeatureFlag");

const createFeatureFlag = async (req, res) => {
  const { featureKey, description, isEnabled } = req.body;

  if (!featureKey) {
    res.status(400);
    throw new Error("Feature key is required");
  }

  const normalizedFeatureKey = featureKey.trim().toLowerCase();

  const existingFlag = await FeatureFlag.findOne({
    featureKey: normalizedFeatureKey,
    organization: req.user.organization,
  });

  if (existingFlag) {
    res.status(400);
    throw new Error("Feature flag already exists for this organization");
  }

  const featureFlag = await FeatureFlag.create({
    featureKey: normalizedFeatureKey,
    description: description || "",
    isEnabled: Boolean(isEnabled),
    organization: req.user.organization,
  });

  res.status(201).json({
    success: true,
    message: "Feature flag created successfully",
    data: featureFlag,
  });
};

const getFeatureFlags = async (req, res) => {
  const featureFlags = await FeatureFlag.find({
    organization: req.user.organization,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: featureFlags.length,
    data: featureFlags,
  });
};

const updateFeatureFlag = async (req, res) => {
  const { id } = req.params;
  const { featureKey, description, isEnabled } = req.body;

  const featureFlag = await FeatureFlag.findOne({
    _id: id,
    organization: req.user.organization,
  });

  if (!featureFlag) {
    res.status(404);
    throw new Error("Feature flag not found");
  }

  if (featureKey) {
    featureFlag.featureKey = featureKey.trim().toLowerCase();
  }

  if (description !== undefined) {
    featureFlag.description = description;
  }

  if (isEnabled !== undefined) {
    featureFlag.isEnabled = Boolean(isEnabled);
  }

  const updatedFeatureFlag = await featureFlag.save();

  res.status(200).json({
    success: true,
    message: "Feature flag updated successfully",
    data: updatedFeatureFlag,
  });
};

const deleteFeatureFlag = async (req, res) => {
  const { id } = req.params;

  const featureFlag = await FeatureFlag.findOne({
    _id: id,
    organization: req.user.organization,
  });

  if (!featureFlag) {
    res.status(404);
    throw new Error("Feature flag not found");
  }

  await featureFlag.deleteOne();

  res.status(200).json({
    success: true,
    message: "Feature flag deleted successfully",
  });
};

const checkFeatureFlag = async (req, res) => {
  const { organizationSlug, featureKey } = req.body;

  if (!organizationSlug || !featureKey) {
    res.status(400);
    throw new Error("organizationSlug and featureKey are required");
  }

  const Organization = require("../models/Organization");

  const organization = await Organization.findOne({
    slug: organizationSlug.trim().toLowerCase(),
  });

  if (!organization) {
    res.status(404);
    throw new Error("Organization not found");
  }

  const featureFlag = await FeatureFlag.findOne({
    organization: organization._id,
    featureKey: featureKey.trim().toLowerCase(),
  });

  res.status(200).json({
    success: true,
    data: {
      organization: organization.name,
      organizationSlug: organization.slug,
      featureKey: featureKey.trim().toLowerCase(),
      isEnabled: featureFlag ? featureFlag.isEnabled : false,
      status: featureFlag && featureFlag.isEnabled ? "enabled" : "disabled",
    },
  });
};

module.exports = {
  createFeatureFlag,
  getFeatureFlags,
  updateFeatureFlag,
  deleteFeatureFlag,
  checkFeatureFlag,
};