import accountService from "../service/accountService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let useData = await accountService.handleLogin(email, password);
  return res.status(200).json(useData);
};

let handleCreateAccounts = async (req, res) => {
  let request = await accountService.handleCreateAccounts(req.body);
  return res.status(200).json(request);
};

const handleUpdateAccounts = async (req, res) => {
  let data = await accountService.handleUpdateAccounts(req.body);
  return res.status(200).json(data);
};

const handleDeleteAccounts = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Missing required parameters",
    });
  }
  let data = await accountService.handleDeleteAccounts(req.body.id);
  return res.status(200).json(data);
};

const handleAllAccounts = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Missing required parameter",
    });
  }

  let accounts = await accountService.handleAllAccounts(id);
  return res.status(200).json(accounts);
};

module.exports = {
  handleLogin,
  handleCreateAccounts,
  handleUpdateAccounts,
  handleDeleteAccounts,
  handleAllAccounts,
};
