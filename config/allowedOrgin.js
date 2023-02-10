const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://127.0.0.1:5173",
  // "https://www.yoursite.com",
  "http://127.0.0.1:5000",
  process.env.BACKEND_URL,
];

module.exports = allowedOrigins;
