const FavoriteProperty = require("../models/FavoriteProperty");

// Add or remove a favorite property
const toggleFavoriteProperty = async (req, res) => {
  const { userId, propertyId } = req.body;

  try {
    // Check if the property is already favorited by the user
    const favorite = await FavoriteProperty.findOne({ userId, propertyId });

    if (favorite) {
      // If it exists, remove it (unlike)
      await FavoriteProperty.deleteOne({ userId, propertyId });
      res.status(200).json({ message: "Property removed from favorites" });
    } else {
      // Otherwise, add it as a favorite
      const newFavorite = new FavoriteProperty({ userId, propertyId });
      await newFavorite.save();
      res.status(201).json({ message: "Property added to favorites" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle favorite property" });
  }
};

// Get all favorite properties for a user
const getFavoritesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await FavoriteProperty.find({ userId });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorite properties" });
  }
};

module.exports = { toggleFavoriteProperty, getFavoritesByUser };
