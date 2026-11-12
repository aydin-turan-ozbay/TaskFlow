import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import logger from "./middleware/logger.js";

const app = express();
const PORT = 3000;

// HTTP isteklerini kaydeden logger middleware, ilgili endpoint'e ulaşmadan önce tanımlanır.
// Böylece hem ana endpoint'e hem de diğer görev endoint'lerine gelen istekler kaydedilir.
app.use(logger);

// Gelen JSON istek gövdelerini ayrıştırır.
app.use(express.json());

// Sunucunun çalıştığını kontrol eden endpoint. 
// Ana adrese gelen GET isteklerini karşılar. 
app.get("/", (req, res) => {
  res.json({ // Response olarak istemciye JSON formatında yanıt döndürür.
    message: "TaskFlow Backend API is running"
  });
});

// Görev endpoint'lerini ifade eder.
// taskRoute.js içindeki bütün yolların başına /api/tasks eklenir.
app.use("/api/tasks", taskRoutes);


 // JSON ayrıştırma hatalarını yakalar ve istemciye JSON yanıtı döndürür.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Geçersiz JSON istek gövdesi."
    });
  }

  next(err);
});


// Sunucuyu başlatır ve 300 portunda dinler
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


