import { where } from "sequelize";
import Details from "../models/order_detail";
import Orders from "../models/order";
import Menus from "../../Menu/models/menu";

const CreateDetails = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.orderID || !data.menuID || !data.quantity || !data.status) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await Details.create({
          orderID: data.orderID,
          menuID: data.menuID,
          quantity: data.quantity,
          status: data.status,
        });

        resolve({
          errCode: 0,
          errMessage: "Create success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const UpdateDetails = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }
      let details = await Details.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (details) {
        details.menuID = data.menuID;
        details.quantity = data.quantity;
        details.status = data.status;

        await details.save();
        resolve({
          errCode: 0,
          message: "Update the order detail succeeds!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const DeleteDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let details = await Details.findOne({
        where: { id: id },
      });
      if (!details) {
        resolve({
          errCode: 1,
          errMessage: "The order detail isn't exist",
        });
      }
      await Details.destroy({
        where: { id: id },
      });
      resolve({
        errCode: 0,
        errMessage: "The order detail is delete",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const orderDetail = (inputID) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputID) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await Details.findOne({
          where: { id: inputID },
          attributes: {
            exclude: ["updatedAt", "createdAt"],
          },
          include: [
            {
              model: Orders,
              as: "orderDetailData",
              attributes: ["id", "tableID"],
            },
            {
              model: Menus,
              as: "menuData",
              attributes: ["foodName", "price"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { CreateDetails, UpdateDetails, DeleteDetails, orderDetail };
