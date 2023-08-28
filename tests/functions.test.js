const { validateRegisterInput, validateTransferredAmount } = require("../utils/validators");

describe('Register input validation function test', () => {
    // Test case 1
    test('Should validate successful input', () => {
       const {valid}=validateRegisterInput("john@example.com","123456789","John","brandon")
        expect(valid).toBe(true);

    });

     // Test case 2
    test('should handle wrong inputs correctly,testing wrong email', () => {
        const { errors,valid } = validateRegisterInput("johnexample.com", "123456789", "John", "brandon")
        expect(valid).toBe(false);
        expect(errors.email).toBe("Email must be a valid email address");
    });

});


describe('Confirm  balance is enough to transfer test', () => {
    test('Should validate available Tocos to be transferred', () => {
        const valid= validateTransferredAmount({balance:400},150)
        expect(valid).toBe(true);

    });

    

});