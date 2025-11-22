const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get accounts
    const accounts = await Account.find({ user: userId });
    
    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .populate('fromAccount toAccount')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    res.json({
      totalBalance,
      accountsCount: accounts.length,
      recentTransactions,
      accounts
    });
    
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};