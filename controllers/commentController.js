const Comment = require("../models/Comment");

// Add a new comment
exports.addComment = async (req, res) => {
  console.log(req.body)
  const { propertyId, userId, text } = req.body;

  if (!propertyId || !userId || !text) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const comment = new Comment({ propertyId, userId, text });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get comments for a specific property
exports.getCommentsByPropertyId = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const comments = await Comment.find({ propertyId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
