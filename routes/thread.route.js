const express = require('express');
const router = express.Router();
const threadController = require('../controllers/thread.controller');

router.post('/create', threadController.createThread);

module.exports = router;