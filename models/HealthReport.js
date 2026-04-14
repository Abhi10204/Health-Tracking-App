import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    bloodPressure: {
      systolic: { type: Number, required: true },
      diastolic: { type: Number, required: true }
    },

    height: { type: Number, required: true }, // Store only number (cm)
    weight: { type: Number, required: true }, // Store only number (kg)
    bmi: { type: Number }, // Store only number (kg/m²)

    temperature: { type: Number, required: true }, // Store only number (°C)
    fever: { type: Boolean, default: false },

    healthRiskLevel: {
      type: String,
      enum: ["Low Risk", "Moderate Risk", "High Risk"], // Fixed valid values
      default: "Moderate Risk"
    },

    activityLevel: { type: String, enum: ["Sedentary", "Moderate", "Active", "Athlete"], default: "Moderate" }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
