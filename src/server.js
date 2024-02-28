import app from "./app.js";
import { host, port } from "./config.js";
import connectDB from "./utils/db.js";

// connecting to database and starting server
connectDB()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
