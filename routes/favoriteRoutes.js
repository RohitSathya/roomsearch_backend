const express = require("express");
const { toggleFavoriteProperty, getFavoritesByUser } = require("../controllers/favoriteController");

const router = express.Router();

// Toggle favorite property
router.post("/toggle", toggleFavoriteProperty);

// Get all favorite properties for a user
router.get("/:userId", getFavoritesByUser);

module.exports = router;
