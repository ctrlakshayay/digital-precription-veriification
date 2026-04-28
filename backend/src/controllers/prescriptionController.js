const {
  createPrescription,
  getPrescriptionsByPatient,
  verifyPrescription,
  getPrescriptionById,
  searchPrescriptions,
} = require('../models/prescriptionModel');

const createPrescriptionHandler = async (req, res, next) => {
  try {
    const { issue_date, expiry_date, patient_id, medicines } = req.body;

    if (new Date(expiry_date) < new Date(issue_date)) {
      return res.status(400).json({ message: 'Expiry date cannot be before issue date' });
    }

    const prescriptionId = await createPrescription({
      issue_date,
      expiry_date,
      doctor_id: req.user.id,
      patient_id,
      medicines,
    });

    res.status(201).json({ message: 'Prescription created', prescriptionId });
  } catch (error) {
    next(error);
  }
};

const getPatientPrescriptionsHandler = async (req, res, next) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user.id : req.params.patientId;
    const prescriptions = await getPrescriptionsByPatient(patientId);
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

const verifyPrescriptionHandler = async (req, res, next) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    const prescription = await getPrescriptionById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (new Date(prescription.expiry_date) < new Date()) {
      return res.status(400).json({ message: 'Prescription has expired and cannot be verified' });
    }

    await verifyPrescription(prescriptionId, req.user.id, status);
    res.json({ message: 'Prescription verification updated' });
  } catch (error) {
    next(error);
  }
};

const getPrescriptionByIdHandler = async (req, res, next) => {
  try {
    const prescription = await getPrescriptionById(req.params.prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

const searchPrescriptionsHandler = async (req, res, next) => {
  try {
    const prescriptions = await searchPrescriptions(req.query);
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescriptionHandler,
  getPatientPrescriptionsHandler,
  verifyPrescriptionHandler,
  getPrescriptionByIdHandler,
  searchPrescriptionsHandler,
};
