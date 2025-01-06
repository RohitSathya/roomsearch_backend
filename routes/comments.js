const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByPropertyId,
  deleteComment,
} = require("../controllers/commentController");

// Add a comment
router.post("/", addComment);

// Get comments for a property
router.get("/:propertyId", getCommentsByPropertyId);

// Delete a comment by ID
router.delete("/:commentId", deleteComment);

module.exports = router;
