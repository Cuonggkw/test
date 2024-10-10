require("dotenv").config();
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

module.exports = sequelize;

// "use strict";

// require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const process = require("process");
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../../config/config.json")[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.js") === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// const modulesPath = path.join(__dirname, "..");
// fs.readdirSync(modulesPath)
//   .filter((file) => {
//     return fs.lstatSync(path.join(modulesPath, file)).isDirectory();
//   })
//   .forEach((file) => {
//     const modelsPath = path.join(modulesPath, file, "models");
//     if (fs.existsSync(modelsPath)) {
//       loadModelsFromModule(modelsPath); // Load các model trong module
//     }
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
