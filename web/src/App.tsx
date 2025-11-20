import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Partners from './pages/Partners';
import Inspections from './pages/Inspections';
import Maintenances from './pages/Maintenances';
import Refuelings from './pages/Refuelings';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/vehicles" element={
            <PrivateRoute>
              <Vehicles />
            </PrivateRoute>
          } />
          <Route path="/partners" element={
            <PrivateRoute>
              <Partners />
            </PrivateRoute>
          } />
          <Route path="/inspections" element={
            <PrivateRoute>
              <Inspections />
            </PrivateRoute>
          } />
          <Route path="/maintenances" element={
            <PrivateRoute>
              <Maintenances />
            </PrivateRoute>
          } />
          <Route path="/refuelings" element={
            <PrivateRoute>
              <Refuelings />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
