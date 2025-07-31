import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ParentDashboard = ({ user }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/parent/children');
      setChildren(response.data.children);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome, {user.firstName}!
        </h2>
        <p className="text-gray-600">
          Monitor your child's learning progress and assignments.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
            </div>
            <div className="p-6">
              {children.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">👶</span>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No children found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Contact the school if your child should be listed here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {children.map((child) => (
                    <div key={child.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {child.firstName} {child.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Class: {child.class?.name} • Grade: {child.class?.grade}
                          </p>
                          <p className="text-sm text-gray-600">
                            Teacher: {child.teacher ? `${child.teacher.first_name} ${child.teacher.last_name}` : 'Not assigned'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Age: {child.age}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
            </div>
            <div className="p-6">
              {children.length > 0 ? (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {child.firstName} {child.lastName}'s Assignments
                        </h3>
                        <a 
                          href={`/student-assignments/${child.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View All
                        </a>
                      </div>
                      <p className="text-sm text-gray-600">
                        Click "View All" to see assignments and submit homework
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl">📝</span>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Assignments from teachers will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;