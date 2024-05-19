import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Device";
const COLLECTION_NAME = "DEVICES";
// Declare the Schema of the Mongo model
// switchDevice
var deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A device must have name"],
      trim: true,
      maxLength: 20,
      minLength: 5,
      unique: true,
    },
    deviceID: {
      type: String,
      trim: true,
      unique: true,
    },
    type: {
      type: Number,
      require: true,
    },
    value: {
      type: Object,
    },
    ownUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    history: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
  }
);

const DeviceModel = mongoose.model(DOCUMENT_NAME, deviceSchema);

export default DeviceModel;
