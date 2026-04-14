# Health-Tracking-App
# 🏥 Health Risk Monitoring API

A backend system for managing user health data, calculating BMI, and determining health risk levels using Node.js, Express, and MongoDB.

---

##  Features

-  User Authentication (JWT-based)
-  BMI Calculation (auto-calculated from height & weight)
-  Health Risk Classification (Low / Moderate / High)
- Fever Detection (based on temperature)
-  One Report per User (data integrity)
-  Search & Filter Health Reports
-  Update & Delete Reports
-  Secure API with protected routes

---

##  Health Logic

- **BMI Formula:**  
  BMI = weight (kg) / (height (m))²

- **Risk Classification:**
  - High Risk → Fever detected
  - Moderate Risk → Abnormal BMI or BP
  - Low Risk → Normal conditions

---

##  Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Nodemailer (for email verification - optional)

---

