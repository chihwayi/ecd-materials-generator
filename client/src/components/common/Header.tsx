import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import NotificationBadge from './NotificationBadge.tsx';
import api from '../../services/api';
import subscriptionService from '../../services/subscription.service.ts';

interface SchoolBranding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customFont?: string;
  schoolMotto?: string;
  customHeaderText?: string;
  brandingEnabled?: boolean;
}

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [schoolBranding, setSchoolBranding] = useState<SchoolBranding>({});
  const [loading, setLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.schoolId) {
      fetchSchoolBranding();
      if (user?.role === 'school_admin') {
        checkSubscriptionStatus();
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.schoolId, user?.role]);

  const fetchSchoolBranding = async () => {
    try {
      const response = await api.get('/school/branding');
      setSchoolBranding(response.data.branding || {});
    } catch (error) {
      console.error('Failed to fetch school branding:', error);
      // Set default branding if fetch fails
      setSchoolBranding({});
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const sub = await subscriptionService.getCurrentSubscription();
      setSubscriptionActive(!!(sub && sub.isActive));
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setSubscriptionActive(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Apply dynamic branding styles
  const getBrandingStyles = () => {
    const primaryColor = schoolBranding.primaryColor || '#2563eb';
    const secondaryColor = schoolBranding.secondaryColor || '#1d4ed8';
    const accentColor = schoolBranding.accentColor || '#fbbf24';

    return {
      headerBg: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600',
      textColor: 'text-white',
      textHover: 'hover:text-white',
      buttonBg: 'bg-white bg-opacity-20 hover:bg-opacity-30',
      logoBg: 'bg-white bg-opacity-20 group-hover:bg-opacity-30',
      customFont: schoolBranding.customFont ? `font-['${schoolBranding.customFont}']` : '',
      inlineStyle: schoolBranding.brandingEnabled ? {
        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${primaryColor})`
      } : {}
    };
  };

  const styles = getBrandingStyles();

  // Check if school admin navigation should be shown
  const shouldShowSchoolAdminNav = user?.role === 'school_admin' && subscriptionActive === true;

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-white bg-opacity-20 h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${styles.headerBg} shadow-lg`} style={styles.inlineStyle}>
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and School Details */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`w-10 h-10 ${styles.logoBg} rounded-xl flex items-center justify-center transition-all duration-200 overflow-hidden`}>
                {schoolBranding.logoUrl ? (
                  <img
                    src={schoolBranding.logoUrl.startsWith('/uploads/') ? `http://localhost:5000${schoolBranding.logoUrl}` : schoolBranding.logoUrl}
                    alt="School Logo"
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <span 
                  className="text-white font-bold text-lg" 
                  style={{ display: schoolBranding.logoUrl ? 'none' : 'block' }}
                >
                  🎓
                </span>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${styles.textColor} ${styles.customFont}`}>
                  {schoolBranding.customHeaderText || 'EduConnect'} 🚀
                </span>
                <span className={`text-xs ${styles.textColor} opacity-80`}>
                  {schoolBranding.schoolMotto || 'Smart Learning Platform'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Section - Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 px-2 flex-1 justify-center overflow-hidden">
            {/* Templates - Only for authenticated teachers and system_admins */}
            {isAuthenticated && user?.role === 'teacher' && (
              <Link to="/templates" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>📚 Templates</Link>
            )}
            {isAuthenticated && (
              <>
                <Link to={user?.role === 'finance' ? '/finance' : '/dashboard'} className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>📊 Dashboard</Link>
                
                {/* Teacher Navigation */}
                {user?.role === 'teacher' && (
                  <>
                    <Link to="/materials" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>📄 Materials</Link>
                    <Link to="/students" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>👥 Students</Link>
                    <Link to="/assignments" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>📝 Assignments</Link>
                    <Link to="/signatures" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>✍️ Signatures</Link>
                    <Link to="/teacher/messages" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 relative whitespace-nowrap`}>
                      💬 Messages
                      <NotificationBadge />
                    </Link>
                  </>
                )}
                
                {/* Parent Navigation */}
                {user?.role === 'parent' && (
                  <Link to="/parent/messages" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 relative whitespace-nowrap`}>
                    💬 Messages
                    <NotificationBadge />
                  </Link>
                )}
                
                {/* School Admin Only Navigation - Reduced to most essential items */}
                {user?.role === 'school_admin' && (
                  <>
                    <Link to="/subscription/pricing" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>💳 Plans</Link>
                    {shouldShowSchoolAdminNav && (
                      <>
                        <Link to="/manage-teachers" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>👨‍🏫 Teachers</Link>
                        <Link to="/school-students" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>👥 Students</Link>
                        <Link to="/fee-management" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>💰 Fees</Link>
                        <Link to="/school-finance" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>📊 Finance</Link>
                      </>
                    )}
                  </>
                )}

                {/* Finance Role Navigation */}
                {user?.role === 'finance' && (
                  <>
                    <Link to="/finance" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>💰 Finances</Link>
                    <Link to="/receipts" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>🖨️ Receipts</Link>
                  </>
                )}
                
                {/* System Admin Navigation */}
                {user?.role === 'system_admin' && (
                  <>
                    <Link to="/admin/users" className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap`}>👥 Users</Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right Section - User Info and Logout */}
          <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 ${styles.buttonBg} rounded-full flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${styles.textColor}`}>
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className={`text-xs ${styles.textColor} font-medium hidden sm:block truncate max-w-24`}>
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`${styles.buttonBg} px-2 py-1 rounded text-xs font-medium ${styles.textColor} transition-all duration-200`}
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`${styles.textColor} ${styles.textHover} px-2 py-1 rounded text-xs font-medium transition-colors duration-200`}
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className={`${styles.buttonBg} ${styles.textColor} px-2 py-1 rounded text-xs font-medium transition-all duration-200`}
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