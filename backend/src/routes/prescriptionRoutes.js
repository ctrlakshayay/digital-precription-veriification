const express = require('express');
const {
  createPrescriptionHandler,
  getPatientPrescriptionsHandler,
  verifyPrescriptionHandler,
  getPrescriptionByIdHandler,
  searchPrescriptionsHandler,
} = require('../controllers/prescriptionController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchPrescriptionsHandler);
router.get('/:prescriptionId', protect, getPrescriptionByIdHandler);
router.post('/', protect, authorizeRoles('doctor'), createPrescriptionHandler);
router.get('/patient/:patientId', protect, authorizeRoles('doctor', 'patient'), getPatientPrescriptionsHandler);
router.patch('/:prescriptionId/verify', protect, authorizeRoles('pharmacy'), verifyPrescriptionHandler);

module.exports = router;
