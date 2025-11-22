const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('fromAccount')
      .populate('toAccount')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: accountId },
        { toAccount: accountId }
      ]
    })
      .populate("fromAccount")
      .populate("toAccount")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate("fromAccount")
      .populate("toAccount");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};