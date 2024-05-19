import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'USERS'
// Declare the User Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    device: {
        type: Array,
        default: []
    },
    networkKey: {
        type: String,
        unique: true
    }
}, {
    collection: COLLECTION_NAME
});

const UserModel = mongoose.model(DOCUMENT_NAME, userSchema);
//Export the model
export default UserModel