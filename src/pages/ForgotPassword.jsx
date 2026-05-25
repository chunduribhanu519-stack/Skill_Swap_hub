import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Handle Step 1: Verify Email
  const handleVerifyEmail = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setIsLoading(true);
    
    // Simulate check
    setTimeout(() => {
      // We'll check if the user exists using a small trick (calling resetPassword with no password)
      // or just trust the logic will handle it in step 2. 
      // For better UX, let's verify now.
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (!users[email]) {
        setIsLoading(false);
        return toast.error('No account found with this email.');
      }

      setIsLoading(false);
      setStep(2);
      toast.info('Email verified! Now set your new password.');
    }, 1000);
  };

  // Handle Step 2: Reset Password
  const handleReset = (e) => {
    e.preventDefault();

    // Validations
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = resetPassword(email, newPassword);
      setIsLoading(false);

      if (result.success) {
        toast.success('Password successfully reset! You can now login.');
        navigate('/home');
      } else {
        toast.error(result.message);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {step === 1 
              ? "Enter your email to find your account." 
              : "Create a secure new password for your account."}
          </p>
        </div>

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all dark:text-white"
                placeholder="name@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Searching...' : 'Find My Account'}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl mb-6 flex items-center gap-3 border border-indigo-100 dark:border-indigo-800">
              <span className="text-lg">📧</span>
              <span className="text-indigo-700 dark:text-indigo-300 font-medium text-sm">{email}</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/home" className="text-gray-500 hover:text-indigo-600 font-bold text-sm transition flex items-center justify-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
