const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.createAccount = async (req, res) => {
    try {
        const { name, type } = req.body;

        const account = await Account.create({
            user: req.user._id,
            name,
            type
        });

        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deposit = async (req, res) => {
    try {
        const { accountId, amount, description } = req.body;

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        account.balance += Number(amount);
        await account.save();

        await Transaction.create({
            user: req.user._id,
            toAccount: account._id,
            amount,
            type: "deposit",
            description
        });

        res.json({ message: "Deposit successful", account });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.withdraw = async (req, res) => {
    try {
        const { accountId, amount, description } = req.body;

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (account.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (account.balance < Number(amount)) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        account.balance -= Number(amount);
        await account.save();

        await Transaction.create({
            user: req.user._id,
            fromAccount: account._id,
            amount,
            type: "withdraw",
            description
        });

        res.json({ message: "Withdrawal successful", account });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.transfer = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount, description } = req.body;

        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findById(toAccountId);

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (fromAccount.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (fromAccount.balance < Number(amount)) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        fromAccount.balance -= Number(amount);
        toAccount.balance += Number(amount);

        await fromAccount.save();
        await toAccount.save();

        await Transaction.create({
            user: req.user._id,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            amount,
            type: "transfer",
            description
        });

        res.json({ 
            message: "Transfer successful",
            fromAccount,
            toAccount 
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};