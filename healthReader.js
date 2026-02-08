// healthReader.js
const fs = require("fs");
const path = require("path");

async function getHealthData(filePath = "data/health-metrics.json") {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fullPath)) {
      return reject(new Error(`Health JSON file not found at path: ${fullPath}`));
    }

    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) return reject(new Error("Error reading health JSON file"));
      try {
        const parsed = JSON.parse(data);

        if (parsed.metrics && Array.isArray(parsed.metrics)) {
          resolve(parsed.metrics);
        } else {
          reject(new Error("Health JSON does not contain a metrics array"));
        }
      } catch (parseErr) {
        reject(new Error("Invalid JSON format in health file"));
      }
    });
  });
}

module.exports = { getHealthData };
