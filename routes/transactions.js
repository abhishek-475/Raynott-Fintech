const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getAllTransactions,
  getAccountTransactions,
  getSingleTransaction
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", protect, getAllTransactions);
router.get("/account/:accountId", protect, getAccountTransactions);
router.get("/:id", protect, getSingleTransaction);

module.exports = router;