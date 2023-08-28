const express = require('express');
const protect = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getUser, searchUsers } = require('../controllers/usersController');

const router = express.Router()



router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/search',protect, searchUsers);
router.get('/:id', getUser);


module.exports = router
