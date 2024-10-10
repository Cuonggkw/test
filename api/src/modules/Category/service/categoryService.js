import { where } from "sequelize";
import Categories from "../models/category";
import { raw } from "body-parser";

const CreateCategories = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.categoryName || !data.parent_category_ID || !data.status) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await Categories.create({
          categoryName: data.categoryName,
          parent_category_ID: data.parent_category_ID,
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

const handleAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Categories.findAll({});
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

const handleUpdateCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.parent_category_ID || !data.status) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let category = await Categories.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (category) {
        category.parent_category_ID = data.parent_category_ID;
        category.status = data.status;

        await category.save();

        resolve({
          errCode: 0,
          message: "Update the category succeeds!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleDeleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let category = await Categories.findOne({
        where: { id: id },
      });
      if (!category) {
        resolve({
          errCode: 1,
          errMessage: "The category isn't exist",
        });
      }
      await Categories.destroy({
        where: { id: id },
      });

      resolve({
        errCode: 0,
        errMessage: "The category is delete",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  CreateCategories,
  handleAllCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};
