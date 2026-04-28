const pool = require('../config/db');

const createUser = async (table, data) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const [result] = await pool.query(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    values
  );

  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT doctor_id AS id, name, email, password, 'doctor' AS role FROM Doctor WHERE email = ?
     UNION
     SELECT patient_id AS id, name, email, password, 'patient' AS role FROM Patient WHERE email = ?
     UNION
     SELECT pharmacy_id AS id, name, email, password, 'pharmacy' AS role FROM Pharmacy WHERE email = ?`,
    [email, email, email]
  );

  return rows[0];
};

module.exports = { createUser, findUserByEmail };
