const mongoose = require("mongoose");

const favoritePropertySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID (e.g., from localStorage or auth)
  propertyId: { type: String, required: true }, // Property ID
});

const FavoriteProperty = mongoose.model("FavoriteProperty", favoritePropertySchema);

module.exports = FavoriteProperty;