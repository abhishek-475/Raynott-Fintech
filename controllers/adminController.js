const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    const totalBalance = await Account.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalAccounts,
      totalTransactions,
      totalBalance: totalBalance[0]?.total || 0,
      recentUsers
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('fromAccount')
      .populate('toAccount')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accounts = await Account.find({ user: req.params.userId });
    const transactions = await Transaction.find({ user: req.params.userId })
      .populate('fromAccount toAccount')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      accounts,
      recentTransactions: transactions
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated", user });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's accounts and transactions
    await Account.deleteMany({ user: req.params.userId });
    await Transaction.deleteMany({ user: req.params.userId });
    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: "User and associated data deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId)
      .populate('user', 'name email');
    
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: req.params.accountId },
        { toAccount: req.params.accountId }
      ]
    })
      .populate('fromAccount toAccount user')
      .sort({ createdAt: -1 });

    res.json({
      account,
      transactions
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};