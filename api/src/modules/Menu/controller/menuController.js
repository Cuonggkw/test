import menuService from "../service/menuService";

const getMenus = async (req, res) => {
  try {
    let menus = await menuService.getMenus();
    return res.status(200).json(menus);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const handleCreateMenus = async (req, res) => {
  try {
    let createMenus = await menuService.handleCreateMenus(req.body);
    return res.status(200).json(createMenus);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const handleUpdateMenus = async (req, res) => {
  try {
    let menus = await menuService.handleUpdateMenus(req.body);
    return res.status(200).json(menus);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const handleDeleteMenus = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters",
      });
    }
    let menus = await menuService.handleDeleteMenus(req.body.id);
    return res.status(200).json(menus);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const handleAllMenus = async (req, res) => {
  try {
    let menus = await menuService.handleAllMenus();
    return res.status(200).json(menus);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  getMenus,
  handleCreateMenus,
  handleUpdateMenus,
  handleDeleteMenus,
  handleAllMenus,
};
