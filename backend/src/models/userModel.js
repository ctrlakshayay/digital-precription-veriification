const pool = require('../config/db');

const getDoctors = async () => {
  const [rows] = await pool.query('SELECT doctor_id, name, specialization, license_number, email FROM Doctor');
  return rows;
};

const getPatients = async () => {
  const [rows] = await pool.query('SELECT patient_id, name, age, gender, contact, email FROM Patient');
  return rows;
};

const getPharmacies = async () => {
  const [rows] = await pool.query('SELECT pharmacy_id, name, location, email FROM Pharmacy');
  return rows;
};

const getPatientHistory = async (patientId) => {
  const [rows] = await pool.query(
    `SELECT p.prescription_id, p.issue_date, p.expiry_date, p.verification_status,
            d.name AS doctor_name
     FROM Prescription p
     JOIN Doctor d ON p.doctor_id = d.doctor_id
     WHERE p.patient_id = ?
     ORDER BY p.issue_date DESC`,
    [patientId]
  );
  return rows;
};

module.exports = { getDoctors, getPatients, getPharmacies, getPatientHistory };
