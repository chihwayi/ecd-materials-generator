import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎓</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">EduConnect</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The comprehensive learning platform that connects teachers, students, and parents. 
            Create engaging materials, track progress, and foster meaningful communication in one unified system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🚀 Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  ✨ Get Started Free
                </Link>
                <Link
                  to="/templates"
                  className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200"
                >
                  📚 Browse Templates
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Materials</h3>
            <p className="text-gray-600">Create culturally-rich learning materials with multi-language support for English, Shona, and Ndebele.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Management</h3>
            <p className="text-gray-600">Track student progress, manage assignments, and monitor learning outcomes with detailed analytics.</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Communication Hub</h3>
            <p className="text-gray-600">Foster meaningful communication between teachers and parents with our integrated messaging system.</p>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Teachers</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center"><span className="mr-2">✅</span>Create and assign interactive materials</li>
              <li className="flex items-center"><span className="mr-2">✅</span>Track student progress in real-time</li>
              <li className="flex items-center"><span className="mr-2">✅</span>Communicate with parents seamlessly</li>
              <li className="flex items-center"><span className="mr-2">✅</span>Generate detailed progress reports</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Parents</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center"><span className="mr-2">✅</span>Monitor your child's learning journey</li>
              <li className="flex items-center"><span className="mr-2">✅</span>Receive updates from teachers</li>
              <li className="flex items-center"><span className="mr-2">✅</span>View completed assignments</li>
              <li className="flex items-center"><span className="mr-2">✅</span>Stay connected with the school</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;