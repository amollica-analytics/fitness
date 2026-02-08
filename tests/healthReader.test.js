const fs = require("fs");
const path = require("path");
const { getHealthData } = require("../healthReader");

describe("healthReader", () => {
  const testJSON = path.join(__dirname, "test-health.json");
  const missingJSON = path.join(__dirname, "missing.json");

  beforeAll(() => {
    const jsonData = {
      user: "TestUser",
      metrics: [
        { date: "2026-02-01", type: "sleep", duration: 7 },
        { date: "2026-02-02", type: "nutrition", calories: 2100 },
      ],
    };
    fs.writeFileSync(testJSON, JSON.stringify(jsonData));
  });

  afterAll(() => {
    if (fs.existsSync(testJSON)) fs.unlinkSync(testJSON);
  });

  test("reads a valid JSON and returns metrics array", async () => {
    const data = await getHealthData(testJSON);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty("date");
    expect(data[0]).toHaveProperty("type");
  });

  test("throws error if file is missing", async () => {
    await expect(getHealthData(missingJSON)).rejects.toThrow("Health JSON file not found");
  });

  test("throws error if JSON format is invalid", async () => {
    const invalidJSON = path.join(__dirname, "invalid.json");
    fs.writeFileSync(invalidJSON, "{ invalid json ");
    await expect(getHealthData(invalidJSON)).rejects.toThrow("Invalid JSON format");
    fs.unlinkSync(invalidJSON);
  });
});
