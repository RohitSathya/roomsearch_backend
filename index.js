const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const commentRoutes = require("./routes/comments");
const favRoutes = require("./routes/favoriteRoutes");
const propertyModel = require("./models/property");
const adminRoutes = require("./routes/adminRoutes");
const userModel = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("./models/owner");
const fm=require('./models/FavoriteProperty')
// const https = require('https');
// const fs=require('fs')
const mongoose = require("mongoose");

require('dotenv').config()


const app = express();

// const options = {
//   key: fs.readFileSync('/www/server/panel/vhost/cert/backend/privkey.pem'),
//   cert: fs.readFileSync('/www/server/panel/vhost/cert/backend/fullchain.pem'),
 
// };


app.use(cors({
  origin: [
    'https://dreamrooms-seek.vercel.app',
    'https://ppp-five-pi.vercel.app',

  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
app.use(bodyParser.json());
app.use(express.json());




// Import Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favoites", favRoutes);
app.use("/api/admin/property", adminRoutes);

app.get('/',async(req,res)=>{
    res.json('hey 8080')
})

// Routes for Users
app.get("/api/user", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await userModel.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Add this route to your `index.js` or admin routes file
app.get("/api/admin/favorite-properties", async (req, res) => {
  try {
    const favorites = await fm.find().populate("propertyId");

    const result = await Promise.all(
      favorites.map(async (fav) => {
        const property = await propertyModel.findById(fav.propertyId);
        const user = await userModel.findOne({ email: fav.userId });
        return { user, property };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    res.status(500).json({ error: "Failed to fetch favorite properties" });
  }
});


// Routes for Properties
app.get("/api/property", async (req, res) => {
  try {
    const data = await propertyModl.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/property/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await propertyModl.findOne({ _id: id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Owner Model and Routes


// Owner Signup
app.post("/api/owner/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingOwner = await Owner.findOe({ username });
    if (existingOwner) {
      return res.json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new owner
    const owner = new Owner({ username, password: hashedPassword });
    await owner.save();

    res.json({ message: "Owner registered successfully" });
  } catch (error) {
    console.error("Error signing up owner:", error);
    res.status(500).json({ error: error });
  }
});


// Owner Login
app.post("/api/owner/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ username });

    if (!owner || !(await bcrypt.compare(password, owner.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ ownerId: owner._id, token,username:owner.username });
  } catch (error) {
    console.error("Error logging in owner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/owner',async(req,res)=>{
  const data=await Owner.find()
  res.json(data)
})
app.get("/api/owner/:id", async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.json(owner);
  } catch (error) {
    console.error("Error fetching owner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/owner/:id/username", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // Check if the new username already exists
    const existingOwner = await Owner.findOne({ username });
    if (existingOwner) {
      return res.json({ message: "Username already exists" });
    }

    const owner = await Owner.findByIdAndUpdate(
      id,
      { username },
      { new: true }
    );

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json({ message: "Username updated successfully", owner });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Middleware for Owner Authentication
const authenticateOwner = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.ownerId = decoded.ownerId;
    next();
  });
};

// Owner Property Routes
app.get("/api/owner/:ownerId/properties", async (req, res) => {
  try {
    const properties = await propertyModel.find({ owner: req.params.ownerId });
    console.log(properties)
    res.json(properties);
  } catch (error) {
    console.error("Error fetching owner properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/owner/:ownerId/property", async (req, res) => {
  try {
    console.log(req.body,req.params.ownerId)
    const newProperty = new propertyModel({ ...req.body, owner: req.params.ownerId });
    await newProperty.save();
    res.json({ message: "Property added successfully" });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/api/owner/:ownerId/property/:propertyId", async (req, res) => {
 
  try {
    await propertyModel.findOneAndUpdate(
      { _id: req.params.propertyId, owner: req.params.ownerId },
      req.body
    );
    res.json({ message: "Property updated successfully" });
  } catch (error) {
    console.log(req.body)
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/owner/:ownerId/property/:propertyId", async (req, res) => {
  try {
    await propertyModel.findOneAndDelete({ _id: req.params.propertyId, owner: req.params.ownerId });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/api/owner/:ownerId/profile", async (req, res) => {
  const { ownerId } = req.params;
  const { profileImage, facebook, twitter, email, phone } = req.body;

  try {
    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { profileImage, facebook, twitter, email, phone },
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.json({ message: "Profile updated successfully", owner: updatedOwner });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});
app.put("/api/owner/:ownerId/profile", async (req, res) => {
  const { ownerId } = req.params;
  const { profileImage, facebook, twitter, email, phone } = req.body;
  try {
    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { profileImage, facebook, twitter, email, phone },
      { new: true }
    );
    if (!updatedOwner) return res.status(404).json({ error: "Owner not found" });
    res.json({ message: "Profile updated successfully", owner: updatedOwner });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});
app.get("/api/owner/:ownerId/profile", async (req, res) => {
  const { ownerId } = req.params;
  try {
    const owner = await Owner.findById(ownerId, "profileImage facebook twitter email phone");
    if (!owner) return res.status(404).json({ error: "Owner not found" });
    res.json(owner);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});



mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('db connected')
    
    app.listen(8080,()=>{
        console.log('serverstartted')
    })
})


// https.createServer(options,app).listen(8080, () => {
   
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully!");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

   
//   console.log(`Server running on http://localhost:${PORT}`);
// });
