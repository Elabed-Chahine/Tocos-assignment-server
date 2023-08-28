const asyncHandler = require('express-async-handler');
const { validateRegisterInput, validateLoginInput, validateTransferredAmount, isNumber, isNotNumber } = require('../utils/validators');
const UserModel = require('../models/UserModel');
const TransactionModel = require('../models/TransactionModel');

//@desc     Make a transaction
//@route    POST /api/transactions
//@access   private API
exports.makeTransaction = asyncHandler(async (req, res) => {
    const { sender, receiver, transferredTocos } = req.body

    if (sender == receiver) {
        res.status(400);
        throw new Error(`You can only transfer tocos to different users.`)
    }
    
    if (isNaN(Number(transferredTocos))){
        res.status(400);
        throw new Error(`Please insert a number value to transfer.`)
    }
    //populate sender and receiver
    const senderUser = await UserModel.findById(sender)
    const receiverUser = await UserModel.findById(receiver)
    //Verify sender and receiver both exist
    if (!senderUser || !receiverUser) {
        res.status(400);
        throw new Error(`Invalid transaction Credentials.`)
    }
    //Check if sender balance is enough to transfer
    if (!validateTransferredAmount(senderUser, transferredTocos)
    ) {
        res.status(400);
        throw new Error(`Insufficient balance, please recharge.`)
    }
    senderUser.balance = senderUser.balance - Number(transferredTocos)
    receiverUser.balance = receiverUser.balance + Number(transferredTocos)
    senderUser.save()
    receiverUser.save()
    const description = `User ${senderUser.firstName} transferred ${transferredTocos} Tocos to ${receiverUser.firstName}`

    const transaction = await TransactionModel.create({ sender, receiver, transferredTocos, description });

    res.status(200).json({ success: true, data: transaction });

})


//@desc     get connectedUser transactions with a specific user
//@route    get /api/transactions/:userId
//@access   private API
exports.getOurTransactions = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (userId == req.uid) {
        res.status(400);
        throw new Error(`You have no transactions with yourself!`)
    }

    const transactions = await TransactionModel.find({ $or: [{ sender: req.uid, receiver: userId }, { sender: userId, receiver: req.uid }] }).populate("sender").populate("receiver").sort("-createdAt")
    if (!transactions) {
        res.status(400);
        throw new Error(`No transactions have been made yet`)
    }


    res.status(200).json({ success: true, data: transactions });

})

