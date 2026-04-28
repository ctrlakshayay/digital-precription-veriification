const express = require('express');
const { listPharmacies } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, listPharmacies);

module.exports = router;
