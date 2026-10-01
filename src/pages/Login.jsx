import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Lock, LogIn } from 'lucide-react';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('student'); // student | teacher

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(schoolId, password, loginMode);
      if (user.role !== loginMode) {
        throw new Error(`Please use the ${user.role} login portal.`);
      }
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          IAS School
        </h2>
        <p className="mt-1 text-center text-sm font-medium text-slate-600">
          Buxar, Bihar, India
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          Learn Without Internet - Offline-First Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          <div className="flex rounded-md shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setLoginMode('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-l-md border ${
                loginMode === 'student' 
                ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('teacher')}
              className={`flex-1 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                loginMode === 'teacher' 
                ? 'bg-blue-50 text-blue-700 border-blue-500 z-10' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Teacher Portal
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">School ID</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMode === 'student' ? <User className="h-5 w-5 text-gray-400" /> : <GraduationCap className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  type="text"
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="pl-10 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 border p-2"
                  placeholder={loginMode === 'student' ? 'e.g. IAS8A001' : 'e.g. IAST001'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 border p-2"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
