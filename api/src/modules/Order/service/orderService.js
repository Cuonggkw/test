import Orders from "../models/order";
import Account from "../../Account/models/account";
import Table from "../../Table/models/table";
import { where } from "sequelize";
import { raw } from "body-parser";

const handleCreateOrders = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.tableID ||
        !data.accountID ||
        !data.total_price ||
        !data.status ||
        !data.payment
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await Orders.create({
          tableID: data.tableID,
          accountID: data.accountID,
          total_price: data.total_price,
          status: data.status,
          notes: data.notes,
          payment: data.payment,
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

const getOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = await Orders.findAll({
        include: [
          {
            model: Table,
            as: "tableData",
            attributes: ["id"],
          },
          {
            model: Account,
            as: "accountData",
            attributes: ["username", "role"],
          },
        ],
        raw: false,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const handleUpdateOrders = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }
      let orders = await Orders.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (orders) {
        orders.tableID = data.tableID;
        orders.total_price = data.total_price;
        orders.payment = data.payment;

        await orders.save();
        resolve({
          errCode: 0,
          message: "Update the orders succeeds!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleDeleteOrders = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = await Orders.findOne({
        where: { id: id },
      });
      if (!order) {
        resolve({
          errCode: 1,
          errMessage: "The menus isn't exist",
        });
      }
      await Orders.destroy({
        where: { id: id },
      });
      resolve({
        errCode: 0,
        errMessage: "The order is delete",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleCreateOrders,
  getOrders,
  handleUpdateOrders,
  handleDeleteOrders,
};
