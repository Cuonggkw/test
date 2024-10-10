require("dotenv").config();
import bcrypt from "bcryptjs";
import Accounts from "../models/account";
import jwt from "jsonwebtoken";

const salt = bcrypt.genSaltSync(10);

const hasUserPass = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Encryption password.
      const hashPassword = await bcrypt.hashSync(password, salt);
      // Promise chỉ need user resolve
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

const handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkEmail(email);
      if (isExist) {
        let username = await Accounts.findOne({
          attributes: ["username", "email", "role", "password"],
          where: { email: email },
          raw: true,
        });
        if (username) {
          let check = await bcrypt.compareSync(password, username.password);
          if (check) {
            delete username.password;
            userData.username = username;
          } else {
            userData.errCode = 1;
            userData.errMessage = "Invalid email or password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User's not found";
        }
      } else {
        userData.errCode = 3;
        userData.errMessage = "Your's email isn't exist in your system.";
      }

      const access_token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      resolve({ access_token, userData });
    } catch (e) {
      reject(e);
    }
  });
};

const handleCreateAccounts = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkUser = await checkEmail(data.email);
      if (checkUser === true) {
        resolve({
          errCode: 1,
          message: "Your email is already in user, Please try",
        });
      } else {
        let hashPassFrom = await hasUserPass(data.password);
        await Accounts.create({
          username: data.username,
          password: hashPassFrom,
          email: data.email,
          phone: data.phone,
          role: data.role,
          status: data.status,
        });
        resolve({
          errCode: 0,
          message: "Create success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const checkEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await Accounts.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleUpdateAccounts = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.role || !data.status) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await Accounts.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.role = data.role;
        user.status = data.status;

        await user.save();
        resolve({
          errCode: 0,
          message: "Update the account succeeds!",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Account not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleDeleteAccounts = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await Accounts.findOne({
        where: { id: id },
      });
      if (!account) {
        resolve({
          errCode: 1,
          errMessage: "The account isn't exist",
        });
      }
      await Accounts.destroy({
        where: { id: id },
      });

      resolve({
        errCode: 0,
        errMessage: "The account is delete",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const handleAllAccounts = (accountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let accounts = "";
      if (accountId === "all") {
        accounts = await Accounts.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (accountId && accountId !== "all") {
        accounts = await Accounts.findOne({
          where: { id: accountId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(accounts);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleLogin,
  handleCreateAccounts,
  handleUpdateAccounts,
  handleDeleteAccounts,
  handleAllAccounts,
};
