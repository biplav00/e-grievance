const mongoose = require("mongoose");
const config = require("../config/db");

(async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log("No user department field to update. Script not needed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
