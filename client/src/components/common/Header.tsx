import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import NotificationBadge from './NotificationBadge.tsx';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-200">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">EduConnect</span>
                <span className="text-xs text-blue-100">Smart Learning Platform</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {/* Templates - Only for authenticated teachers and system_admins */}
            {isAuthenticated && user?.role === 'teacher' && (
              <Link to="/templates" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📚 Templates</Link>
            )}
            {isAuthenticated && (
              <>
                <Link to={user?.role === 'finance' ? '/finance' : '/dashboard'} className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📊 Dashboard</Link>
                
                {/* Teacher Navigation */}
                {user?.role === 'teacher' && (
                  <>
                    <Link to="/materials" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📄 Materials</Link>
                    <Link to="/students" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">👥 Students</Link>
                    <Link to="/assignments" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📝 Assignments</Link>
                    <Link to="/teacher/messages" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative">
                      💬 Messages
                      <NotificationBadge />
                    </Link>
                  </>
                )}
                
                {/* Parent Navigation */}
                {user?.role === 'parent' && (
                  <Link to="/parent/messages" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative">
                    💬 Messages
                    <NotificationBadge />
                  </Link>
                )}
                
                {/* School Admin Only Navigation */}
                {user?.role === 'school_admin' && (
                  <>
                    <Link to="/manage-teachers" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">👨‍🏫 Teachers</Link>
                    <Link to="/school-students" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">👥 Students</Link>
                    <Link to="/school-analytics" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📈 Analytics</Link>
                    <Link to="/fee-management" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">💰 Fees</Link>
                    <Link to="/school-finance" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📊 Finance</Link>
                  </>
                )}

                {/* Finance Role Navigation */}
                {user?.role === 'finance' && (
                  <>
                    <Link to="/finance" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">💰 Finances</Link>
                  </>
                )}
                
                {/* System Admin Navigation */}
                {user?.role === 'system_admin' && (
                  <>
                    <Link to="/admin/users" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">👥 Users</Link>
                    <Link to="/admin/schools" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">🏫 Schools</Link>
                    <Link to="/system-analytics" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">📊 Analytics</Link>
                    <Link to="/system-settings" className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">⚙️ Settings</Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-100 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  ✨ Sign Up
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