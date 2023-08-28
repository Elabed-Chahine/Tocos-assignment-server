const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please add Email']
    },
    password: {
        type: String,
        required: [true, 'please add Password'],
        select:false,
    },
    balance:{
        type:Number,
        default: Math.floor(1000 + Math.random() * 9000)
    }
    ,country:{
        type:String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
// Encrypt password using bcrypt

UserSchema.pre("save", async function (next) {
    // If password didn't get modified
    if (!this.isModified("password")) {
        next();
    }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



// Sign JWT and return

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Match User entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.virtual("transactions",{
    ref:"Transaction",
    localField:"_id",
    foreignField:"sender",
})

module.exports = mongoose.model("User",UserSchema)