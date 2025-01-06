const mongoose = require("mongoose");

// Define the schema
const propertySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    address: { type: String, required: true },
    state: { 
      type: String, 
      required: true, 
      enum: ["Punjab", "Chandigarh"], 
      default: "Punjab" 
    },
    city: { 
      type: String, 
      required: true, 
      enum: [
        "Chandigarh",
        "Mohali",
        "Kharar",
        "Zirakpur",
        "Sahibzada Ajit Singh Nagar",
        "Chandigarh University, Mohali",
        "Chandigarh University South Campus, Mohali",
        "Chitkara University, Chandigarh",
        "Panjab University, Chandigarh",
        "Lovely Professional University, Phagwara",
      ], 
      default: "Chandigarh" 
    },
    type: { 
      type: String, 
      required: true, 
      enum: ["Apartment", "Villa", "Store", "PG", "Single Rooms", "Sharing PG", "Kothi"], 
      default: "Apartment" 
    },
    agent: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["active", "inactive"], 
      default: "active" 
    },
    size: { type: String, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    badges: { 
      type: [String], 
      enum: ["Rent", "Sale"], 
      default: "Rent" 
    },
    carouselImages: { type: [String], default: [] },
    preferredTenant: {
      type: String,
      enum: [
        "All",
        "Boys",
        "Girls",
        "Boys & Girls",
        "Family",
        "Family & Boys",
        "Family & Girls",
        "Company",
      ],
      default: "All",
    },
    furnishedType: {
      type: String,
      enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      default: "Fully Furnished",
    },
    category: {
      type: String,
      enum: [
        "1BHK",
        "2BHK",
        "3BHK",
        "4BHK",
        "4+ BHK",
        "Studio Apartment",
        "Annexy",
      ],
      default: "1BHK",
    },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    owner: { 
      type: String, 
      required: true, 
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: "propertylist", // Explicit collection name
  }
);

// Create the model
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
