const request = require('supertest');
const {app} = require('../server.js'); // Import your Express app
const UserModel = require('../models/UserModel.js');

describe('GET /api/users/:id', () => {
    it('should fetch a single user by ID', async () => {
        // Create a user and retrieve their ID
        const user = await UserModel.findOne({firstName:"dubadubadababa"});

        const userId = user?._id || "64ebe6cf0fc4471b3778e2c8"; 

       if(user){
           const response = await request(app)
               .get(`/api/users/${userId}`)
               .expect('Content-Type', /json/)
               .expect(200);

           expect(response.body.success).toBe(true);
       }else{
           const response = await request(app)
               .get(`/api/users/${userId}`)
               .expect('Content-Type', /json/)
               .expect(404);

           expect(response.body.message).toBe("User not found");
       }
       
    });

    it('should handle invalid user ID', async () => {
        const invalidUserId = 'invalidId'; // An invalid user ID

        const response = await request(app)
            .get(`/api/users/${invalidUserId}`)
            .expect('Content-Type', /json/)
            .expect(401);

        expect(response.body.message).toBe('Insert a valid userId');

    });
});



describe('POST /api/transactions', () => {
    it('API should Make a successful transaction between two users', async () => {
        // Create two users
        const sender = await UserModel.findOne().select("+password");
        const receiver = await UserModel.findOne({ _id: { $ne: sender._id } });

        const transactionData = {
            sender: sender.id,
            receiver: receiver.id,
            transferredTocos: 100,
        };

        const token = await sender.getSignedJwtToken()
        const response = await request(app)
            .post('/api/transactions')
            .set("Authorization", `Bearer ${token}`)
            .send(transactionData)
            .expect('Content-Type', /json/)
            .expect(200);

        // Assert that the transaction was successful
        expect(response.body.success).toBe(true);


    });

    it('API should Reject a request with transferred amount greater than sender balance', async () => {
        const sender = await UserModel.findOne().select("+password");
        const receiver = await UserModel.findOne({ _id: { $ne: sender._id } });

        const transactionData = {
            sender: sender.id,
            receiver: receiver.id,
            transferredTocos: 9999999,
        };
        const token = await sender.getSignedJwtToken()
        const response = await request(app)
            .post('/api/transactions')
            .set("Authorization", `Bearer ${token}`)
            .send(transactionData)
            .expect('Content-Type', /json/)
            .expect(400);

        // Assert that the transaction failed
        expect(response.body.message).toBe('Insufficient balance, please recharge.');
    });


});


describe('Post /api/users', () => {
    it('API should Reject invalid credentials to register a new user', async () => {
        // create an object with invalid data
        const WrongData = {
            firstName: "John",
            lastName: "Beth",
            email: "Johnexample.com",
            password: "111"

        }
        const response = await request(app)
            .post(`/api/users`)
            .send(WrongData)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body.message).toBe("Email must be a valid email address");

    });
});

describe('Post /api/users', () => {
    it('API should register a new user, If user exists handles exception', async () => {
        // create an object with invalid data
        const correctData = {
            firstName: "John",
            lastName: "Beth",
            email: "John@example.com",
            password: "11111111"

        }
        const userExists = await UserModel.findOne({ email: correctData.email })
        if (userExists) {
            const response = await request(app)
                .post(`/api/users`)
                .send(correctData)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body.message).toBe("Email is taken");
        } else {

            const response = await request(app)
                .post(`/api/users`)
                .send(correctData)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.success).toBe(true);
        }
    });
});

