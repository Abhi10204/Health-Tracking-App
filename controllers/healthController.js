import Report from "../models/HealthReport.js";

// Function to calculate BMI
const calculateBMI = (weight, height) => {
  return parseFloat((weight / ((height / 100) ** 2)).toFixed(2)); // Convert cm to meters and calculate BMI
};

// Function to determine health risk level
const determineHealthRisk = (bmi, systolicBP, diastolicBP, fever) => {
  if (fever) return "High Risk";
  if (bmi < 18.5 || bmi > 30 || systolicBP > 140 || diastolicBP > 90) return "Moderate Risk";
  return "Low Risk";
};

//  Create Health Report
export const createReport = async (req, res) => {
  try {
    const { bloodPressure, height, weight, temperature, activityLevel } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!bloodPressure?.systolic || !bloodPressure?.diastolic || !height || !weight || !temperature || !activityLevel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fever = temperature > 38; // Fever detection (if temp > 38°C)
    const bmi = calculateBMI(weight, height); // Auto-calculate BMI
    const healthRiskLevel = determineHealthRisk(bmi, bloodPressure.systolic, bloodPressure.diastolic, fever);

    // Check if the user already has a report
    const existingReport = await Report.findOne({ userId });
    if (existingReport) {
      return res.status(400).json({ message: "User already has a report. Update the existing report instead." });
    }

    // Create a new report
    const report = await Report.create({
      userId,
      bloodPressure,
      height,
      weight,
      bmi,
      temperature,
      fever,
      healthRiskLevel,
      activityLevel
    });

    res.status(201).json({ message: "Report saved successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get User's Health Report
export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const report = await Report.findOne({ userId });

    if (!report) {
      return res.status(404).json({ message: "No health report found for this user" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Search Health Reports
export const searchReports = async (req, res) => {
  try {
    const filters = {};
    const { systolic, diastolic, height, weight, bmi, temperature, fever } = req.query;

    if (systolic) filters["bloodPressure.systolic"] = Number(systolic);
    if (diastolic) filters["bloodPressure.diastolic"] = Number(diastolic);
    if (height) filters.height = Number(height);
    if (weight) filters.weight = Number(weight);
    if (bmi) filters.bmi = Number(bmi);
    if (temperature) filters.temperature = Number(temperature);
    if (fever !== undefined) filters.fever = fever === "true";

    const reports = await Report.find(filters);

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found matching the query" });
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Update Health Report
export const updateReport = async (req, res) => {
  try {
    const { bloodPressure, height, weight, temperature, activityLevel } = req.body;
    const userId = req.user.id;

    let report = await Report.findOne({ userId });
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update fields if provided
    if (bloodPressure?.systolic) report.bloodPressure.systolic = bloodPressure.systolic;
    if (bloodPressure?.diastolic) report.bloodPressure.diastolic = bloodPressure.diastolic;
    if (height) report.height = height;
    if (weight) report.weight = weight;
    if (temperature) report.temperature = temperature;
    if (activityLevel) report.activityLevel = activityLevel;

    // Recalculate BMI if height/weight are updated
    if (height || weight) {
      report.bmi = calculateBMI(
        weight || report.weight,
        height || report.height
      );
    }

    // Update fever status and health risk level
    report.fever = temperature ? temperature > 38 : report.fever;
    report.healthRiskLevel = determineHealthRisk(report.bmi, report.bloodPressure.systolic, report.bloodPressure.diastolic, report.fever);

    await report.save();
    res.json({ message: "Report updated successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Delete Health Report
export const deleteReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const report = await Report.findOne({ userId });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
