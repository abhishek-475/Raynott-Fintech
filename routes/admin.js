const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  getPlatformStats,
  getAllUsers,
  getAllAccounts,
  getAllTransactions,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAccountDetails
} = require("../controllers/adminController");

const router = express.Router();

// Platform statistics
router.get("/stats", protect, admin, getPlatformStats);

// User management
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:userId", protect, admin, getUserDetails);
router.put("/users/:userId/role", protect, admin, updateUserRole);
router.delete("/users/:userId", protect, admin, deleteUser);

// Account management
router.get("/accounts", protect, admin, getAllAccounts);
router.get("/accounts/:accountId", protect, admin, getAccountDetails);

// Transaction management
router.get("/transactions", protect, admin, getAllTransactions);

module.exports = router;