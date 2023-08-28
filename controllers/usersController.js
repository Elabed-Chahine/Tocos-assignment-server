const asyncHandler = require('express-async-handler');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');
const UserModel = require('../models/UserModel');

//@desc     Register a new user
//@route    POST /api/users
//@access   Public API
exports.registerUser = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, password } = req.body

    //Input validators are located in Utils file, they test the user inputs
    const { valid, errors } = validateRegisterInput(email, password, firstName, lastName)

    if (!valid) {
        res.status(400);
        throw new Error(`${errors?.firstName || errors?.lastName || errors?.email || errors?.password}`)
    }

    //Check if email exists
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("Email is taken");
    }


    const user = await UserModel.create({
        email,
        firstName,
        lastName,
        password,
        balance: Math.floor(1000 + Math.random() * 9000)
    })


    res.status(200).json({
        success: true, data: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            balance: user.balance,
            token: user.getSignedJwtToken()
        }
    });

})


//@desc     login user
//@route    POST /api/users/login
//@access   protected(tocos registered users)
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //Input validators are located in Utils file, they test the user inputs
    const { valid, errors } = validateLoginInput(email, password)

    if (!valid) {
        res.status(400);
        throw new Error(`${errors?.email || errors?.password}`)
    }

    //Check if email exists
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
        res.status(400);
        throw new Error("No users with this email found", "INVALID_EMAIL");
    }

    //Using method matchPassword to compar passwords
    const validPassword = await user.matchPassword(password)
    if (!validPassword) {
        res.status(400);
        throw new Error("Invalid password")
    }


    res.status(200).json({
        success: true, data: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            balance: user.balance,
            token: user.getSignedJwtToken()
        }
    });

})




//@desc     get a single user details
//@route    GET /api/users/:id
//@access   public
exports.getUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(401)
        throw new Error('Insert a valid userId');    }

    const user = await UserModel.findById(id)
if(!user){
    res.status(404)
    throw new Error('User not found');
}
    res.status(200).json({ success: true, data: user });

})


/// @desc        search Users
// @route       get /api/users/search?q=
// @access      private(connected users only)
exports.searchUsers = asyncHandler(async (req, res, next) => {
    const { q, limit = 5 } = req.query;
    console.log(q);
    var users;
    if (!q) {
        users = await UserModel.find({ _id: { $ne: req.uid } }).populate("transactions").limit(limit).sort({ createdAt: -1 });
    } else {
        users = await UserModel.find({
            _id: { $ne: req.uid },
            $or: [
                { firstName: { $regex: q, $options: "i" } },
                { lastName: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
            ],
        })
            .populate("transactions")
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: users });
});

