import { useEffect, useState } from 'react';
import api from '../../api/client';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataTable from '../../components/DataTable';

const PatientDashboard = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get('/patients/history').then((res) => setRows(res.data));
  }, []);

  return (
    <DashboardLayout title="Patient Dashboard" links={[{ to: '/patient', label: 'My Prescriptions' }]}>
      <h2 className="mb-4 text-xl font-semibold">My Medical History</h2>
      <DataTable
        columns={[
          { key: 'prescription_id', label: 'Prescription ID' },
          { key: 'issue_date', label: 'Issue Date' },
          { key: 'expiry_date', label: 'Expiry Date' },
          { key: 'verification_status', label: 'Verification' },
          { key: 'doctor_name', label: 'Doctor' },
        ]}
        data={rows}
      />
    </DashboardLayout>
  );
};

export default PatientDashboard;
