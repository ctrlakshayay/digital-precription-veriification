const express = require('express');
const { listDoctors } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, listDoctors);

module.exports = router;
