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

## API Endpoints
| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

##  Health Report Routes

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| POST   | /api/reports | Create report   |
| GET    | /api/reports | Get user report |
| PUT    | /api/reports | Update report   |
| DELETE | /api/reports | Delete report   |

## Example request

---

POST /api/reports

{
  "bloodPressure": { "systolic": 120, "diastolic": 80 },
  "height": 170,
  "weight": 65,
  "temperature": 36.5,
  "activityLevel": "Moderate"
}

---

## Example response
{
  "bmi": 22.49,
  "fever": false,
  "healthRiskLevel": "Low Risk"
}

---
