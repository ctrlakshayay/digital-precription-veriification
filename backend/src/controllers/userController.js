const { getDoctors, getPatients, getPharmacies, getPatientHistory } = require('../models/userModel');

const listDoctors = async (req, res, next) => {
  try {
    const rows = await getDoctors();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const listPatients = async (req, res, next) => {
  try {
    const rows = await getPatients();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const listPharmacies = async (req, res, next) => {
  try {
    const rows = await getPharmacies();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const patientHistory = async (req, res, next) => {
  try {
    const patientId = req.params.patientId || req.user.id;
    const rows = await getPatientHistory(patientId);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { listDoctors, listPatients, listPharmacies, patientHistory };
