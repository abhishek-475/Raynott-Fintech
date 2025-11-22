const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createAccount,
  getAccounts,
  deposit,
  withdraw,
  transfer
} = require("../controllers/accountController");

const router = express.Router();

router.post("/", protect, createAccount);
router.get("/", protect, getAccounts);
router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);

module.exports = router;