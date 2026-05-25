import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute wraps any page that requires login.
// If the user is NOT authenticated, they get redirected to /home automatically.
// Usage: <ProtectedRoute><YourPage /></ProtectedRoute>
const ProtectedRoute = ({ children }) => {
  // Get user AND loading state from AuthContext
  const { user, loading, setIsAuthModalOpen, setAuthModalMode } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, [loading, user, setIsAuthModalOpen, setAuthModalMode]);

  // While checking auth state (reading localStorage), show a spinner
  // This prevents a brief flash of the /home redirect before user is restored
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to /home
  // 'replace' means the /home page replaces the current history entry,
  // so the user can't click "Back" to bypass the auth check
  if (!user) {
    return <Navigate to="/home" replace />;
  }

  // If logged in, render the actual protected page
  return children;
};

export default ProtectedRoute;

