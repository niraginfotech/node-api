const express = require("express");
const app = express();
const cors = require('cors')
const tasks = require("./routes/tasks");
const users = require("./routes/users");
const connectDB = require('./database/connect');
const dotenv = require('dotenv');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(cors({
  origin: 'http://localhost:3000'
}));

dotenv.config({ path: 'config.env'})

// middleware
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/tasks", tasks);
app.use("/api/v1/users", users);
app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
