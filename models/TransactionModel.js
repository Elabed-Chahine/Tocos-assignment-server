const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
sender:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:[true,"Sender is required"]
},
    receiver: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: [true, "Receiver is required"]
    },
    transferredTocos:{
        type:Number,
        required:[true,"A transaction should transfer some tocos"]

    },
    description: {
        type:String
    }
},
    { timestamps: true })

module.exports = mongoose.model("Transaction",TransactionSchema)