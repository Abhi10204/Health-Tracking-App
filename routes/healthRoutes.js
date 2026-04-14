import express from "express";
import { createReport, getUserReports, updateReport, deleteReport, searchReports} from "../controllers/healthController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReport);
router.get("/search", authMiddleware, searchReports);
router.get("/", authMiddleware, getUserReports);
router.put("/:id", authMiddleware, updateReport);
router.delete("/:id", authMiddleware, deleteReport);

export default router;
