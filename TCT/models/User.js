import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    description:    { type: String, maxlength: 144 },
    collections: [{ name: String, cards:[Object] }
    ]
});

const User = mongoose.model('users', UserSchema);

export default User;