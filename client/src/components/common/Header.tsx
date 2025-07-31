import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                
                {/* Teacher & School Admin Navigation */}
                {(user?.role === 'teacher' || user?.role === 'school_admin') && (
                  <>
                    <Link to="/materials" className="text-gray-600 hover:text-gray-900">My Materials</Link>
                    <Link to="/students" className="text-gray-600 hover:text-gray-900">Students</Link>
                    <Link to="/assignments" className="text-gray-600 hover:text-gray-900">Assignments</Link>
                  </>
                )}
                
                {/* School Admin Only Navigation */}
                {user?.role === 'school_admin' && (
                  <>
                    <Link to="/manage-teachers" className="text-gray-600 hover:text-gray-900">Teachers</Link>
                    <Link to="/school-analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link>
                  </>
                )}
                
                {/* System Admin Navigation */}
                {user?.role === 'system_admin' && (
                  <>
                    <Link to="/admin/users" className="text-gray-600 hover:text-gray-900">Users</Link>
                    <Link to="/admin/schools" className="text-gray-600 hover:text-gray-900">Schools</Link>
                    <Link to="/system-analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link>
                    <Link to="/system-settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, {user?.firstName}
                </span>
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