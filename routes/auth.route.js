const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookAuthCallback);

router.get('/logout', authController.logout);

module.exports = router;