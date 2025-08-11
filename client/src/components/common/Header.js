import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ECD</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Materials Generator</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/templates" className="text-gray-600 hover:text-gray-900">Templates</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                {(user?.role === 'teacher' || user?.role === 'parent') && (
                  <Link to="/materials" className="text-gray-600 hover:text-gray-900">Materials</Link>
                )}
                {user?.role === 'teacher' && (
                  <Link to="/assignments" className="text-gray-600 hover:text-gray-900">Assignments</Link>
                )}
                {user?.role === 'school_admin' && (
                  <Link to="/school-management" className="text-gray-600 hover:text-gray-900">School</Link>
                )}
                {(user?.role === 'system_admin' || user?.role === 'delegated_admin') && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;