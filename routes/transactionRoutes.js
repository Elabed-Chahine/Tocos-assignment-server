const express = require('express')
const { makeTransaction, getOurTransactions } = require('../controllers/transactionsController')
const protect = require('../middlewares/authMiddleware')

const router = express.Router()


router.post("/", protect, makeTransaction)
router.get("/:userId", protect, getOurTransactions)



module.exports = router