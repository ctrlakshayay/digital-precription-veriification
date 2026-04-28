const express = require('express');
const { listPatients, patientHistory } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('doctor', 'pharmacy'), listPatients);
router.get('/history/:patientId?', protect, authorizeRoles('doctor', 'patient'), patientHistory);

module.exports = router;
