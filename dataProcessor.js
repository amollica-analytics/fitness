// dataProcessor.js
require("dotenv").config();
const path = require("path");
const { getWorkoutData } = require("./workoutReader");
const { getHealthData } = require("./healthReader");

async function processFiles() {
  const userName = process.env.USER_NAME || "User";
  const weeklyGoal = Number(process.env.WEEKLY_GOAL) || 0;

  console.log(`Processing data for: ${userName}\n`);

  try {
    // Workouts
    console.log(" Reading workout data...");
    const workoutData = await getWorkoutData(path.join(__dirname, "data/workouts.csv"));
    console.log(`Total workouts: ${workoutData.totalWorkouts}`);
    console.log(`Total minutes: ${workoutData.totalMinutes}\n`);

    // Health
    console.log("Reading health data...");
    const healthData = await getHealthData(path.join(__dirname, "data/health-metrics.json"));
    console.log(`Total health entries: ${healthData.length}\n`);

    // Summary
    console.log("=== SUMMARY ===");
    console.log(`Workouts found: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
    console.log(`Health entries found: ${healthData.length}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (workoutData.totalMinutes >= weeklyGoal) {
      console.log(` Congratulations ${userName}! You have exceeded your weekly goal!`);
    } else {
      console.log(` Keep going ${userName}, you need ${weeklyGoal - workoutData.totalMinutes} more minutes to reach your goal`);
    }

  } catch (error) {
    console.error(` An error occurred while processing the files: ${error.message}`);
  }
}

processFiles();


// Processing data for: Rebecca 

// Reading workout data...
// Total workouts: 10
// Total minutes: 330 

//  Reading health data...
// Total health entries: 8 

// === SUMMARY ===
// Workouts found: 10
// Total workout minutes: 330
// Health entries found: 8
// Weekly goal: 150 minutes
// Congratulations Rebecca! You have exceeded your weekly goal!     
// Waiting for the debugger to disconnect...