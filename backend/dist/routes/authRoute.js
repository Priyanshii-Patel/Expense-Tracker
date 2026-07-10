const express = require('express');
const {register, login, getUser, forgetPassword, resetPassword} = require('../controllers/authControllers');
const protect = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getUser)
router.post('/resetpassword', forgetPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router