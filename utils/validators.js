module.exports.validateRegisterInput = (email, password, firstName, lastName) => {
    const errors = {};
    if (firstName?.trim() === "" || firstName == undefined) {
        errors.firstName = "First name must not be empty";
    } if (lastName?.trim() === "" || lastName == undefined) {
        errors.firstName = "Last name must not be empty";
    }

    if (email?.trim() === "" || email == undefined) {
        errors.email = "Email must not be empty";
    } else {
        const regEx =
            /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email?.match(regEx)) {
            errors.email = "Email must be a valid email address";
        }
    }

    if (password === "" || password == undefined) {
        errors.password = "Password must not empty";
    } else if (password?.length < 6) {
        errors.password = "Password is too short";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

module.exports.validateLoginInput = (email, password) => {
    const errors = {};
    if (email?.trim() === "" || email == undefined) {
        errors.email = "email must not be empty";
    }
    if (password.trim() === "" || password == undefined) {
        errors.password = "Password must not be empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};

module.exports.validatePassword = (password) => {
    const errors = {};

    if (password === "") {
        errors.password = "Password must not empty";
    } else if (password.length < 6) {
        errors.password = "Password is too short";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
};


exports.validateTransferredAmount = (sender, transferredAmount) => {

    if (sender.balance < transferredAmount) {
        return false;
    }
    return true
}

