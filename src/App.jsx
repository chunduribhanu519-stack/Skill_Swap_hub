import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthModal from './components/AuthModal';
import FindSkills from './pages/FindSkills';
import OfferSkill from './pages/OfferSkill';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

// ── TOAST NOTIFICATIONS ──
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
  const { isAuthModalOpen } = useAuth();
  
  return (
    <Router>
      {/* Global Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <AuthModal />
        <main className={`flex-grow container mx-auto transition-all duration-300 ${isAuthModalOpen ? 'blur-sm brightness-50 pointer-events-none' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes — require login */}
          <Route path="/find-skills" element={<ProtectedRoute><FindSkills /></ProtectedRoute>} />
          <Route path="/offer-skill" element={<ProtectedRoute><OfferSkill /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
