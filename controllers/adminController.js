const Property = require("../models/property");

// Fetch all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties." });
  }
};

// Get property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property." });
  }
};

// Add a new property
exports.addProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json({ message: "Property added successfully!", property });
  } catch (error) {
    res.status(400).json({ error: error});
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found." });
    }
    res.status(200).json({ message: "Property updated successfully!", updatedProperty });
  } catch (error) {
    res.status(400).json({ error: "Failed to update property." });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found." });
    }
    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete property." });
  }
};
