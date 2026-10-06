// Backend Node.js: mantiene el token de Telegram fuera del navegador.
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

app.post("/api/send-message", async (req, res) => {
  try {
    if (!BOT_TOKEN) {
      return res.status(500).json({ ok: false, error: "Falta configurar TELEGRAM_BOT_TOKEN en el archivo .env." });
    }
    const { chatId, message } = req.body || {};
    if (typeof chatId !== "string" || !/^-?\d{1,20}$/.test(chatId)) {
      return res.status(400).json({ ok: false, error: "Chat ID inválido." });
    }
    if (typeof message !== "string" || !message.trim() || message.length > 4000) {
      return res.status(400).json({ ok: false, error: "El mensaje debe tener entre 1 y 4000 caracteres." });
    }
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message.trim() })
    });
    const data = await telegramResponse.json();
    if (!telegramResponse.ok || !data.ok) {
      return res.status(telegramResponse.status || 502).json({
        ok: false,
        error: data.description || "Telegram rechazó la solicitud."
      });
    }
    return res.json({ ok: true, message: "Mensaje enviado", result: { message_id: data.result.message_id } });
  } catch (error) {
    console.error("Error de envío:", error.message);
    return res.status(500).json({ ok: false, error: "Error interno al comunicarse con Telegram." });
  }
});

app.listen(PORT, () => console.log(`ConectaWeb disponible en http://localhost:${PORT}`));
