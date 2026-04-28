const pool = require('../config/db');

const createPrescription = async (data) => {
  const { issue_date, expiry_date, doctor_id, patient_id, medicines } = data;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [prescriptionResult] = await conn.query(
      `INSERT INTO Prescription (issue_date, expiry_date, doctor_id, patient_id, verification_status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [issue_date, expiry_date, doctor_id, patient_id]
    );

    const prescriptionId = prescriptionResult.insertId;

    for (const medicine of medicines) {
      const [medicineRows] = await conn.query(
        'SELECT medicine_id FROM Medicine WHERE name = ? AND dosage = ?',
        [medicine.name, medicine.dosage]
      );

      let medicineId;
      if (medicineRows.length === 0) {
        const [medicineResult] = await conn.query(
          'INSERT INTO Medicine (name, dosage) VALUES (?, ?)',
          [medicine.name, medicine.dosage]
        );
        medicineId = medicineResult.insertId;
      } else {
        medicineId = medicineRows[0].medicine_id;
      }

      await conn.query(
        `INSERT INTO Prescription_Details (prescription_id, medicine_id, quantity)
         VALUES (?, ?, ?)`,
        [prescriptionId, medicineId, medicine.quantity]
      );
    }

    await conn.commit();
    return prescriptionId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getPrescriptionsByPatient = async (patientId) => {
  const [rows] = await pool.query(
    `SELECT p.prescription_id, p.issue_date, p.expiry_date, p.verification_status,
            d.name AS doctor_name, m.name AS medicine_name, m.dosage, pd.quantity
     FROM Prescription p
     JOIN Doctor d ON p.doctor_id = d.doctor_id
     JOIN Prescription_Details pd ON p.prescription_id = pd.prescription_id
     JOIN Medicine m ON pd.medicine_id = m.medicine_id
     WHERE p.patient_id = ?
     ORDER BY p.issue_date DESC`,
    [patientId]
  );

  return rows;
};

const verifyPrescription = async (prescriptionId, pharmacyId, status) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE Prescription SET verification_status = ? WHERE prescription_id = ?',
      [status, prescriptionId]
    );

    await conn.query(
      `INSERT INTO VerificationLog (prescription_id, pharmacy_id, verified_date, status)
       VALUES (?, ?, NOW(), ?)`,
      [prescriptionId, pharmacyId, status]
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const getPrescriptionById = async (prescriptionId) => {
  const [rows] = await pool.query(
    `SELECT p.*, d.name AS doctor_name, pat.name AS patient_name
     FROM Prescription p
     JOIN Doctor d ON p.doctor_id = d.doctor_id
     JOIN Patient pat ON p.patient_id = pat.patient_id
     WHERE p.prescription_id = ?`,
    [prescriptionId]
  );
  return rows[0];
};

const searchPrescriptions = async ({ status, patient_id, doctor_id }) => {
  let query = `SELECT prescription_id, issue_date, expiry_date, verification_status, doctor_id, patient_id
               FROM Prescription WHERE 1=1`;
  const values = [];

  if (status) {
    query += ' AND verification_status = ?';
    values.push(status);
  }
  if (patient_id) {
    query += ' AND patient_id = ?';
    values.push(patient_id);
  }
  if (doctor_id) {
    query += ' AND doctor_id = ?';
    values.push(doctor_id);
  }

  query += ' ORDER BY issue_date DESC';

  const [rows] = await pool.query(query, values);
  return rows;
};

module.exports = {
  createPrescription,
  getPrescriptionsByPatient,
  verifyPrescription,
  getPrescriptionById,
  searchPrescriptions,
};
