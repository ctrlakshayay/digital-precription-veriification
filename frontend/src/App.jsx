import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const HomeRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      path="/doctor"
      element={
        <ProtectedRoute role="doctor">
          <DoctorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient"
      element={
        <ProtectedRoute role="patient">
          <PatientDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/pharmacy"
      element={
        <ProtectedRoute role="pharmacy">
          <PharmacyDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
