# Tocos-assignment-server

## Project structure

```
Tocos-assignment-server/
 |-- config/
 |   |-- config.env
 |   |-- eb.js
 |-- controllers/
 |   |-- usersController.js
 |   |-- transactionsController.js
 |-- Middlewares/
 |   |-- authMiddleware.js
 |   |-- errorMiddleware.js
 |-- models/
 |   |-- userModel.js
 |   |-- transactionsModel.js
 |-- routes/
 |   |-- userRoutes.js
 |   |-- transactionRoutes.js
 |-- tests/
 |   |-- APIs.test.js
 |   |-- functions.test.js
 |-- utils/
 |   |-- validators.js
 |   |-- consts.js
 |-- server.js
 |-- package.json
 |-- README.md
 |-- .gitignore
```
## Table of Contents (Optional)

- [Installation](#installation)
- [APIS](#APIS)
- [Tests](#Tests)

## Installation

First run the command npm install 
Then check if your local MongoDB server is working ( make sure to install mongoDB server on your localMachine)
Make sure your port 5000 is not occupied, if you have a tast running on port
run the comman "npm run dev" and the server should start working
```
npm install --legacy-peer-deps && npm run dev
```
## APIS
```
//@desc     Register a new user
//@route    POST /api/users
//@access   Public API

//@desc     login user
//@route    POST /api/users/login
//@access   protected(tocos registered users)


//@desc     get a single user details
//@route    GET /api/users/:id
//@access   public

//@desc     Make a transaction
//@route    POST /api/transactions
//@access   private API


//@desc     get connectedUser transactions with a specific user
//@route    get /api/transactions/:userId
//@access   private API

```

## Tests
```
//To run all tests run the cmd "npm run test" in root folder
@API tests
//GET /api/users/:id
Note: Test should be used once you have created a user.
--tests
API should fetch a single user by ID
API should handle invalid user ID
//POST /api/transactions
Note: Test should be used once you have at least two users in DB.
--tests
API should Make a successful transaction between two users
API should Reject a request with transferred amount greater than sender balance
//Post /api/users
--tests
API should Reject invalid credentials to register a new user
API should register a new user, If user exists handles exception
```
