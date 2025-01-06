const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Added unique: true
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  facebook: { type: String, default: "" },
  twitter: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
});

module.exports = mongoose.model("Owner", ownerSchema);
