const fs = require("fs");
const path = require("path");

// Define paths
const sourceFile = path.join(__dirname, "../coordinates_data.json"); // Path to the source file outside the folder
const destinationFile = path.join(__dirname, "public/coordinates_data.json"); // Path to the public directory

// Variable to store the last modification time
let lastModifiedTime = null;

// Function to check and copy the file if it has changed
const copyFileIfChanged = () => {
  fs.stat(sourceFile, (err, stats) => {
    if (err) {
      console.error("Error accessing the source file:", err);
      return;
    }

    const currentModifiedTime = stats.mtime;
    if (!lastModifiedTime || currentModifiedTime > lastModifiedTime) {
      // Update the lastModifiedTime
      lastModifiedTime = currentModifiedTime;

      // Copy the file
      fs.copyFile(sourceFile, destinationFile, (err) => {
        if (err) {
          console.error("Error copying the file:", err);
        } else {
          console.log("File copied successfully to the public directory at", new Date().toLocaleTimeString());
        }
      });
    }
  });
};

// Run the check operation every 5 seconds
setInterval(copyFileIfChanged, 6000);
