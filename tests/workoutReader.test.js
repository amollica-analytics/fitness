const fs = require("fs");
const path = require("path");
const { getWorkoutData } = require("../workoutReader");

describe("workoutReader", () => {
  const testCSV = path.join(__dirname, "test-workouts.csv");
  const missingCSV = path.join(__dirname, "missing.csv");

  beforeAll(() => {
    const csvData = `date,minutes
2026-02-01,30
2026-02-02,45
2026-02-03,60
`;
    fs.writeFileSync(testCSV, csvData);
  });

  afterAll(() => {
    if (fs.existsSync(testCSV)) fs.unlinkSync(testCSV);
  });

  test("reads a valid CSV and returns correct data structure", async () => {
    const data = await getWorkoutData(testCSV);
    expect(data).toHaveProperty("workouts");
    expect(Array.isArray(data.workouts)).toBe(true);
    expect(data).toHaveProperty("totalWorkouts", 3);
    expect(data).toHaveProperty("totalMinutes", 135);
  });

  test("throws error if file is missing", async () => {
    await expect(getWorkoutData(missingCSV)).rejects.toThrow("Workout CSV file not found");
  });

  test("throws error if minutes value is invalid", async () => {
    const invalidCSV = path.join(__dirname, "invalid-workouts.csv");
    const csvData = `date,minutes
2026-02-01,30
2026-02-02,abc
`;
    fs.writeFileSync(invalidCSV, csvData);
    await expect(getWorkoutData(invalidCSV)).rejects.toThrow("Invalid workout minutes value");
    fs.unlinkSync(invalidCSV);
  });
});
