import { useState } from 'react';
import api from '../../api/client';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';

const PharmacyDashboard = () => {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [status, setStatus] = useState('VERIFIED');
  const [result, setResult] = useState(null);

  const findPrescription = async () => {
    const { data } = await api.get(`/prescriptions/${prescriptionId}`);
    setResult(data);
  };

  const verify = async () => {
    await api.patch(`/prescriptions/${prescriptionId}/verify`, { status });
    alert('Verification status updated');
    await findPrescription();
  };

  return (
    <DashboardLayout title="Pharmacy Dashboard" links={[{ to: '/pharmacy', label: 'Verify Prescription' }]}>
      <h2 className="mb-4 text-xl font-semibold">Prescription Verification</h2>
      <div className="grid max-w-lg gap-3">
        <InputField label="Prescription ID" value={prescriptionId} onChange={(e) => setPrescriptionId(e.target.value)} />
        <button onClick={findPrescription} className="rounded bg-slate-800 py-2 text-white">Search</button>
      </div>

      {result && (
        <div className="mt-5 rounded-xl border p-4">
          <p><strong>ID:</strong> {result.prescription_id}</p>
          <p><strong>Doctor:</strong> {result.doctor_name}</p>
          <p><strong>Patient:</strong> {result.patient_name}</p>
          <p><strong>Status:</strong> {result.verification_status}</p>

          <div className="mt-3 flex gap-2">
            <select className="rounded border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="VERIFIED">VERIFIED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <button onClick={verify} className="rounded bg-green-600 px-3 py-2 text-white">Update</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PharmacyDashboard;
