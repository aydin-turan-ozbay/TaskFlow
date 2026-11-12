import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const DATA_FILE = new URL("../../data/tasks.json", import.meta.url);

const VALID_PRIORITIES = ["low", "medium", "high"];
const VALID_STATUSES = ["todo", "in-progress", "completed"];

const ALLOWED_FIELDS = [
  "title",
  "description",
  "priority",
  "status",
  "assignee",
  "dueDate"
];

// Tarih doğrulama fonksiyonu
function isValidDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// POST ve PUT işlemlerinde ortak kullanılacak görev doğrulama fonksiyonu
function validateTask(task) {
  if (
    typeof task.title !== "string" ||
    !task.title.trim()
  ) {
    return "Geçerli bir görev başlığı zorunludur.";
  }

  if (
    typeof task.assignee !== "string" ||
    !task.assignee.trim()
  ) {
    return "Geçerli bir atanan kişi zorunludur.";
  }

  if (!VALID_PRIORITIES.includes(task.priority)) {
    return "Geçersiz öncelik değeri.";
  }

  if (!VALID_STATUSES.includes(task.status)) {
    return "Geçersiz görev durumu.";
  }

  if (typeof task.description !== "string") {
    return "Açıklama metin türünde olmalıdır.";
  }

  if (
    task.dueDate !== null &&
    !isValidDate(task.dueDate)
  ) {
    return "Son teslim tarihi YYYY-MM-DD formatında olmalıdır.";
  }

  return null;
}

// İstek gövdesinin (req.body) null, dizi veya farklı bir veri tipi yerine JSON nesnesi olduğunu kontrol eder.
function isValidRequestBody(body) {
  return (
    body !== null &&
    typeof body === "object" &&
    !Array.isArray(body)
  );
}




// JSON dosyasındaki görev kayıtlarını okuyup JavaScript dizisine dönüştürür.
async function readTasks() {
  const data = await readFile(DATA_FILE, "utf8");
  const tasks = JSON.parse(data);

  if (!Array.isArray(tasks)) {
    throw new Error("Görev verileri bir dizi olmalıdır.");
  }

  return tasks;
}

// Görev listesinin güncel halini JSON dosyasına kaydeder.
async function saveTasks(tasks) {
  await writeFile(
    DATA_FILE,
    JSON.stringify(tasks, null, 2),
    "utf8"
  );
}

// GET /api/tasks isteği ile görevlerden gelen yanıt (response) alınır ve görevi okunur. 
// try-catch bloğu ile hata olup olmadığı kontrol edilir.
export async function getAllTasks(req, res) {
  try {
    const tasks = await readTasks();
    res.status(200).json(tasks);
  } catch (error) {
      console.error("Görev listeleme hatası:", error);

      return res.status(500).json({
        message: "Görevler okunamadı."
      });
    }
}

// GET /api/tasks/:id isteği belirtilen id numarası ile görevi listeden çağırır.
export async function getTaskById(req, res) {
  try {
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Görev bulunamadı."
      });
    }

    res.status(200).json(task);
  } catch (error) {
      console.error("Görev okuma hatası:", error);

      res.status(500).json({ 
        message: "Görevler okunamadı."
      });
    }
}

// POST /api/tasks isteği yeni görev oluşturur, benzersiz ID ve zaman damgalarını otomatik atar ve JSON dosyasına kaydeder.
export async function createTask(req, res) {
  try {
    // İstek gövdesinin geçerli bir JSON nesnesi olduğunu kontrol eder.
    if (!isValidRequestBody(req.body)) {
      return res.status(400).json({
        message: "İstek gövdesi geçerli bir JSON nesnesi olmalıdır."
      });
    }

    const {
      title,
      description,
      priority,
      assignee,
      dueDate
    } = req.body;

    const now = new Date().toISOString();

    const newTask = {
      id: randomUUID(),
      title,
      description: description ?? "",
      priority,
      status: "todo",
      assignee,
      dueDate: dueDate ?? null,
      createdAt: now,
      updatedAt: now
    };

    const validationError = validateTask(newTask);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    newTask.title = newTask.title.trim();
    newTask.assignee = newTask.assignee.trim();

    const tasks = await readTasks();

    tasks.push(newTask);
    await saveTasks(tasks);

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Görev oluşturma hatası:", error);

    return res.status(500).json({
      message: "Görev oluşturulamadı."
    });
  }
}

// PUT /api/tasks/:id isteği belirtilen ID'ye sahip görevin gönderilen alanlarını günceller.
export async function updateTask(req, res) {
  try {
    // İstek gövdesinin geçerli bir JSON nesnesi olduğunu kontrol eder.
    if (!isValidRequestBody(req.body)) {
      return res.status(400).json({
        message: "İstek gövdesi geçerli bir JSON nesnesi olmalıdır."
      });
    }

    const tasks = await readTasks();

    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        message: "Görev bulunamadı."
      });
    }

    const requestFields = Object.keys(req.body);

    // Boş güncelleme isteklerini reddeder.
    if (requestFields.length === 0) {
      return res.status(400).json({
        message: "Güncellenecek en az bir alan gönderilmelidir."
      });
    }

    // İzin verilmeyen alanların değiştirilmesini engeller.
    const invalidFields = requestFields.filter(
      field => !ALLOWED_FIELDS.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Güncellenmesine izin verilmeyen alanlar var.",
        invalidFields
      });
    }

    const updatedTask = {
      ...tasks[index],
      ...req.body
    };

    const validationError = validateTask(updatedTask);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    updatedTask.title = updatedTask.title.trim();
    updatedTask.assignee = updatedTask.assignee.trim();
    updatedTask.updatedAt = new Date().toISOString();

    tasks[index] = updatedTask;
    await saveTasks(tasks);

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Görev güncelleme hatası:", error);

    return res.status(500).json({
      message: "Görev güncellenemedi."
    });
  }
}

// DELETE /api/tasks/:id isteği ile artık kullanılmayan ya da tamamlanmış olan bir görevi sileriz.
export async function deleteTask(req, res) {
  try {
    const tasks = await readTasks();
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        message: "Görev bulunamadı."
      });
    }

    tasks.splice(index, 1);
    await saveTasks(tasks);

    res.status(200).json({
      message: "Görev başarıyla silindi."
    });
  } catch (error) {
      console.error("Görev silme hatası:", error);

      return res.status(500).json({
        message: "Görev silinemedi."
      });
    }
}
