import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';

const RegisterPage = () => {
  const [form, setForm] = useState({
    role: 'doctor',
    name: '',
    email: '',
    password: '',
    specialization: '',
    license_number: '',
    age: '',
    gender: 'Male',
    contact: '',
    location: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      role: form.role,
      name: form.name,
      email: form.email,
      password: form.password,
    };

    if (form.role === 'doctor') {
      payload.specialization = form.specialization;
      payload.license_number = form.license_number;
    }
    if (form.role === 'patient') {
      payload.age = Number(form.age);
      payload.gender = form.gender;
      payload.contact = form.contact;
    }
    if (form.role === 'pharmacy') {
      payload.location = form.location;
    }

    try {
      const { data } = await api.post('/auth/register', payload);
      login(data);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm">Role</label>
          <select className="w-full rounded-xl border px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>
        <InputField label="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <InputField label="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <InputField label="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />

        {form.role === 'doctor' && (
          <>
            <InputField label="Specialization" required onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            <InputField label="License Number" required onChange={(e) => setForm({ ...form, license_number: e.target.value })} />
          </>
        )}

        {form.role === 'patient' && (
          <>
            <InputField label="Age" type="number" required onChange={(e) => setForm({ ...form, age: e.target.value })} />
            <div>
              <label className="text-sm">Gender</label>
              <select className="w-full rounded-xl border px-3 py-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <InputField label="Contact" required onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          </>
        )}

        {form.role === 'pharmacy' && (
          <InputField label="Location" required onChange={(e) => setForm({ ...form, location: e.target.value })} />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-xl bg-blue-600 py-2 text-white">Register</button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <Link className="text-blue-600" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
