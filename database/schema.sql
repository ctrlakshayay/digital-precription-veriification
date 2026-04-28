CREATE DATABASE IF NOT EXISTS digital_prescription_db;
USE digital_prescription_db;

CREATE TABLE Doctor (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Patient (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age > 0),
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  contact VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Pharmacy (
  pharmacy_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Medicine (
  medicine_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  dosage VARCHAR(80) NOT NULL,
  UNIQUE KEY uq_medicine_name_dosage (name, dosage)
);

CREATE TABLE Prescription (
  prescription_id INT AUTO_INCREMENT PRIMARY KEY,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  verification_status ENUM('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id),
  CONSTRAINT fk_prescription_patient FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
  CONSTRAINT chk_prescription_dates CHECK (expiry_date >= issue_date)
);

CREATE TABLE Prescription_Details (
  prescription_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (prescription_id, medicine_id),
  CONSTRAINT fk_details_prescription FOREIGN KEY (prescription_id) REFERENCES Prescription(prescription_id) ON DELETE CASCADE,
  CONSTRAINT fk_details_medicine FOREIGN KEY (medicine_id) REFERENCES Medicine(medicine_id)
);

CREATE TABLE VerificationLog (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  verified_date DATETIME NOT NULL,
  status ENUM('VERIFIED', 'REJECTED') NOT NULL,
  CONSTRAINT fk_log_prescription FOREIGN KEY (prescription_id) REFERENCES Prescription(prescription_id),
  CONSTRAINT fk_log_pharmacy FOREIGN KEY (pharmacy_id) REFERENCES Pharmacy(pharmacy_id)
);

DELIMITER $$
CREATE TRIGGER trg_prescription_set_expired
BEFORE UPDATE ON Prescription
FOR EACH ROW
BEGIN
  IF NEW.expiry_date < CURDATE() THEN
    SET NEW.verification_status = 'EXPIRED';
  END IF;
END$$
DELIMITER ;
