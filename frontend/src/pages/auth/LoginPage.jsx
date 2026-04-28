import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <InputField label="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <InputField label="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-xl bg-blue-600 py-2 text-white">Login</button>
      </form>
      <p className="mt-4 text-sm">
        New user? <Link className="text-blue-600" to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
