import express from 'express';
import cors from 'cors';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from './models/User.js';
import Collection from './models/Collection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

    



app.post("/api/signup", async (req, res) => {
    try {
        console.log("Received signup request:", req.body);
        const { username, email, password } = req.body;


        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log("User created successfully:", newUser);
        res.json({ success: true, message: "Signup successful!" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({ 
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] 
        });

        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );        

        res.json({ 
            success: true, 
            token, 
            user: { 
                username: user.username, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

{/* collection */}
app.post("/api/add-to-collection", authenticate, async (req, res) => {
    try {
        const { collectionId, card } = req.body;

        if (!collectionId || !card) {
            return res.status(400).json({ message: "Collection ID and card data are required" });
        }

        console.log("Searching for collection:", collectionId, "User ID:", req.user.userId);
        let collection = await Collection.findById(collectionId);

        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        if (collection.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (collection.cards.some(existingCard => existingCard.id === card.id)) {
            return res.status(400).json({ message: "Card already exists in collection" });
        }

        collection.cards.push({
            ...card,
            _id: new mongoose.Types.ObjectId(),
        });

        await collection.save();
        res.json({ success: true, message: "Card added successfully" });
    } catch (err) {
        console.error("Error adding card:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/collection', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
            const collections = await Collection.find({ userId: decoded.userId });
            res.json(collections);
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

app.post('/api/collection', authenticate, async (req, res) => {
    const { name } = req.body;
    try {
        const newCollection = new Collection({
            name,
            userId: req.user.userId,
        });        
        await newCollection.save();
        res.json(newCollection);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/api/collection/:id', authenticate, async (req, res) => {
    const { name } = req.body;
    try {
        const updatedCollection = await Collection.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { name },
            { new: true }
        );
        if (!updatedCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        res.json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.delete('/api/collection/:id', authenticate, async (req, res) => {
    try {
        const deletedCollection = await Collection.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.userId 
        });

        if (!deletedCollection) {
            return res.status(404).json({ message: "Collection not found or unauthorized" });
        }

        res.json({ message: "Collection deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.get('/api/collections/:id', async (req, res) => { 
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        if (!collection.cards) {
            collection.cards = [];
        }
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

{/* profile */}
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.use('/uploads', express.static(path.resolve('uploads')));
  

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.userId}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});
  

app.get('/api/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const collections = await Collection.find({ userId }).lean();
        res.json({
            username: user.username,
            description: user.description || "",
            profilePicture: user.profilePicture || "", 
            collections: collections.map(col => ({ _id: col._id, name: col.name })),
        });
    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
  

app.put('/api/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { description } = req.body;
        if (description && description.length > 144) {
            return res.status(400).json({ success: false, message: "Description too long (max 144 characters)" });
        }
        await User.findByIdAndUpdate(userId, { description: description || "" });
        res.json({ success: true, message: "Profile updated" });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});  

app.post('/api/profile/picture', authenticate, upload.single('picture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const userId = req.user.userId;
        const filePath = `http://localhost:5000/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(userId, { profilePicture: filePath });
        res.json({ success: true, profilePicture: filePath });
    } catch (err) {
        console.error("Picture upload error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.delete('/api/collections/:collectionId/cards/:cardId', authenticate, async (req, res) => {
    try {
        const { collectionId, cardId } = req.params;
        console.log(`Received DELETE request for card ${cardId} in collection ${collectionId}`);

        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Use `id` instead of `_id` for deletion
        const newCards = collection.cards.filter(card => card.id !== cardId);

        if (newCards.length === collection.cards.length) {
            return res.status(404).json({ message: 'Card not found in this collection' });
        }

        collection.cards = newCards;
        await collection.save();

        console.log("After deletion:", collection.cards);
        console.log("Card deleted successfully!");

        res.json({ success: true, message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));