const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    root: rootPath,
    app: {
      name: "Tdtu",
    },
    port: process.env.PORT || 3000,
    db: "mongodb+srv://tdtu_web:tdtu_web@cluster0.hd8wq.mongodb.net/web_final_tdtu?retryWrites=true&w=majority",
  },

  production: {
    root: rootPath,
    app: {
      name: "Tdtu",
    },
    port: process.env.PORT || 3000,
    db: "mongodb+srv://tdtu_web:tdtu_web@cluster0.hd8wq.mongodb.net/web_final_tdtu?retryWrites=true&w=majority",
  },
};

module.exports = config[env];
