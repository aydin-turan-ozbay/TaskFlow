// Gelen HTTP isteğinin metodunu, endpoint'ini ve zaman bilgisini kaydeden middleware.

const logger = (req, res, next) => {
  const method = req.method;
  const endpoint = req.originalUrl; // İsteğin gönderildiği endpoint belirlenir.
  const timestamp = new Date().toISOString(); // İsteğin gönderildiği zaman bilgisi oluşturulur.

  console.log(`[${timestamp}] ${method} ${endpoint}`);

  // İsteğin sonraki middleware'e veya ilgili endpoint'e ilerlemesini sağlar.
  next(); 
};

export default logger;
