const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const port = 3000;
app.use(express.json());

const redis = require("redis");
const session = require("express-session");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_PORT,
  REDIS_URL,
  SESSION_SECRET,
} = require("./config/config");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({ host: REDIS_URL, port: REDIS_PORT });

mongoose
  .connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("*************connected to db*************");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/api/v1", (req, res) => {
  res.send("<h1>Balli<h1>");
  console.log("************Balli************");
});
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
