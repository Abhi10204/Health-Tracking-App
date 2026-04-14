import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  isVerified: { type: Boolean, default: false }, // Email verification status
  verificationToken: { type: String, default: "" },
  healthData: {
    bloodPressure: { type: String, default: "" },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 },
    hasFever: { type: Boolean, default: false },
    temperature: { type: Number, default: 0 },
  },
});

export default mongoose.model("User", userSchema);
