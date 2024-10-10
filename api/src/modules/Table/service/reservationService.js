const { where } = require("sequelize");
const Reservations = require("../models/reservation");
const Tables = require("../models/table");
const Accounts = require("../../Account/models/account");

const handleCreateReservation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.tableID ||
        !data.accountID ||
        !data.reservation_time ||
        !data.actual_arrival_time ||
        !data.guest_count ||
        !data.contact_info ||
        !data.status
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await Reservations.create({
          tableID: data.tableID,
          accountID: data.accountID,
          reservation_time: data.reservation_time,
          actual_arrival_time: data.actual_arrival_time,
          guest_count: data.guest_count,
          contact_info: data.contact_info,
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

const updateReservation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.actual_arrival_time ||
        !data.guest_count ||
        !data.status
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      }

      let reservation = await Reservations.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (reservation) {
        reservation.id = data.id;
        reservation.actual_arrival_time = data.actual_arrival_time;
        reservation.guest_count = data.guest_count;
        reservation.status = data.status;

        reservation.save();
        resolve({
          errCode: 0,
          message: "Update the reservation succeeds!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const DeleteReservation = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let reservation = await Reservations.findOne({
        where: { id: id },
      });
      if (!reservation) {
        resolve({
          errCode: 1,
          errMessage: "The reservation isn't exist",
        });
      }
      await Reservations.destroy({
        where: { id: id },
      });

      resolve({
        errCode: 0,
        errMessage: "The reservation is delete",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const DetailReservation = (inputID) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputID) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await Reservations.findOne({
          where: { id: inputID },
          attributes: {
            // Loại bỏ những trường ko muốn lấy.
            exclude: ["updatedAt", "createdAt"],
          },
          include: [
            {
              model: Tables,
              as: "tablesData",
              attributes: ["id"],
            },
            {
              model: Accounts,
              as: "accountsData",
              attributes: ["username", "role"],
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

const AllReservation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Reservations.findAll({});

      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleCreateReservation,
  updateReservation,
  DeleteReservation,
  DetailReservation,
  AllReservation,
};
