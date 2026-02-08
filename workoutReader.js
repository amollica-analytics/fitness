// workoutReader.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

async function getWorkoutData(filePath = "data/workouts.csv") {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fullPath)) {
      return reject(new Error(`Workout CSV file not found at path: ${fullPath}`));
    }

    const workouts = [];
    fs.createReadStream(fullPath)
      .pipe(csv())
      .on("data", (row) => workouts.push(row))
      .on("end", () => {
        try {
          let totalMinutes = 0;

          for (const workout of workouts) {
            const minutes = Number(workout.minutes || workout.duration || workout.time);
            if (isNaN(minutes)) throw new Error("Invalid workout minutes value");
            totalMinutes += minutes;
          }

          resolve({
            workouts,
            totalWorkouts: workouts.length,
            totalMinutes,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", () => reject(new Error("Error reading workout CSV file")));
  });
}

module.exports = { getWorkoutData };
