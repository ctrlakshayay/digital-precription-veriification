import { useEffect, useState } from 'react';
import api from '../../api/client';
import DashboardLayout from '../../layouts/DashboardLayout';
import InputField from '../../components/InputField';
import DataTable from '../../components/DataTable';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    issue_date: '',
    expiry_date: '',
    medicines: [{ name: '', dosage: '', quantity: 1 }],
  });

  useEffect(() => {
    api.get('/patients').then((res) => setPatients(res.data));
  }, []);

  const addMedicineRow = () => {
    setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', quantity: 1 }] });
  };

  const handleMedicineChange = (index, field, value) => {
    const clone = [...form.medicines];
    clone[index][field] = field === 'quantity' ? Number(value) : value;
    setForm({ ...form, medicines: clone });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    await api.post('/prescriptions', form);
    alert('Prescription created');
  };

  const fetchHistory = async (patientId) => {
    const { data } = await api.get(`/patients/history/${patientId}`);
    setHistory(data);
  };

  return (
    <DashboardLayout title="Doctor Dashboard" links={[{ to: '/doctor', label: 'Create Prescription' }]}>
      <h2 className="mb-3 text-xl font-semibold">Create Digital Prescription</h2>
      <form onSubmit={submitPrescription} className="space-y-3">
        <div>
          <label className="text-sm">Patient</label>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={form.patient_id}
            onChange={(e) => {
              setForm({ ...form, patient_id: Number(e.target.value) });
              fetchHistory(Number(e.target.value));
            }}
            required
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
            ))}
          </select>
        </div>
        <InputField label="Issue Date" type="date" required onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
        <InputField label="Expiry Date" type="date" required onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />

        {form.medicines.map((medicine, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-xl border p-3 md:grid-cols-3">
            <InputField label="Medicine" required onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} />
            <InputField label="Dosage" required onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} />
            <InputField label="Quantity" type="number" required min={1} onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)} />
          </div>
        ))}

        <button type="button" onClick={addMedicineRow} className="rounded bg-slate-200 px-3 py-2">
          + Add Medicine
        </button>
        <button className="block rounded bg-blue-600 px-4 py-2 text-white">Create Prescription</button>
      </form>

      <h3 className="mt-8 mb-3 text-lg font-semibold">Selected Patient History</h3>
      <DataTable
        columns={[
          { key: 'prescription_id', label: 'ID' },
          { key: 'issue_date', label: 'Issue Date' },
          { key: 'expiry_date', label: 'Expiry Date' },
          { key: 'verification_status', label: 'Status' },
          { key: 'doctor_name', label: 'Doctor' },
        ]}
        data={history}
      />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
