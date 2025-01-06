const express = require("express");
const {
  getAllProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/adminController");

const router = express.Router();

// Fetch all properties
router.get("/", getAllProperties);

// Fetch property by ID
router.get("/:id", getPropertyById);

// Add a new property
router.post("/", addProperty);

// Update a property
router.put("/:id", updateProperty);

// Delete a property
router.delete("/:id", deleteProperty);

module.exports = router;
