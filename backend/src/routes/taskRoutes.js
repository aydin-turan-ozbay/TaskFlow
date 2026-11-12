import express from "express";

// Görev endpoint'lerinde kullanılacak controller fonksiyonları.
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

// READ - Tüm görevleri getir
router.get("/", getAllTasks); // GET/api/tasks isteğiyle getAllTasks fonksiyonu çalışır

// READ - ID bilgisine göre belirli bir görevi getirir.
router.get("/:id", getTaskById);

// CREATE - Yeni görev oluştur
router.post("/", createTask);

// UPDATE - Belirli bir görevin gönderilen alanlarını günceller.
router.put("/:id", updateTask);

// DELETE - Belirli bir görevi siler.
router.delete("/:id", deleteTask);

export default router;
