// pages/api/analitycs.js
import { exec } from "child_process";
import path from "path";

export default function handler(req, res) {
  const scriptPath = path.join(process.cwd(), "scripts", "data_analysis.py");

  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error ejecutando Python:", error.message);
      return res.status(500).json({ error: "Python error", details: error.message });
    }

    if (stderr) {
      console.warn("⚠️ Python stderr:", stderr);
    }

    try {
      const matches = stdout.match(/\{[\s\S]*\}/g);
      if (!matches || matches.length === 0) {
        console.error("❌ No se encontró JSON en la salida de Python");
        return res.status(500).json({ error: "No JSON found", raw: stdout });
      }

      const lastJson = matches[matches.length - 1];
      const data = JSON.parse(lastJson);

      return res.status(200).json(data);
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err.message);
      return res.status(500).json({ error: "Parse error", details: err.message, raw: stdout });
    }
  });
}
