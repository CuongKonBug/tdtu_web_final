const express = require("express");
const config = require("./config/config");
const glob = require("glob");
const mongoose = require("mongoose");
const http = require("http");
const mySocket = require("./app/config-socket");
const app = express();
const path = require("path");
var morgan = require("morgan");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

app.set("views", config.root + "/app/views");
app.use(express.static(config.root + "/public"));

app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(flash());
app.use(cookieParser());
app.use(compress());
app.use(express.static(config.root + "/public"));
app.use(methodOverride());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const router = require("./app/routers");
require("dotenv").config();

mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("✅ Connect Successful");
  })
  .catch((error) => {
    console.error(`❌ Connect Failed ${error}`);
  });
const db = mongoose.connection;
db.on("error", () => {
  throw new Error("unable to connect to database at " + config.db);
});

const models = glob.sync(config.root + "/app/models/*.js");
models.forEach(function (model) {
  require(model);
});
const server = http.createServer(app);
mySocket.inializeIO(server).on("connection", (socket) => {
  socket.on("disconnect", (socket) => {});
});
app.use(express.static(path.join(__dirname, "public")));
// const User = require("./app/models/user");
// const user = new User({
//   username: "Khoa KT",
//   name: "kt",
//   password: "kt",
//   role: "faculty",
//   hookEnabled: true,
// });
// console.log(user);
// user.save();
const env = process.env.NODE_ENV || "development";
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == "development";

router(app);

server.listen(config.port, () => {
  console.log("Express server listening on port " + config.port);
});
//final
