import React, { useState, useEffect } from 'react';
import { schoolAdminService } from '../services/school-admin.service';

const SchoolMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await schoolAdminService.getSchoolMaterials();
      setMaterials(data.materials);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Materials</h1>
          <p className="text-gray-600 mt-2">View all learning materials created by your teachers.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl">📚</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No materials yet</h3>
            <p className="mt-2 text-gray-500">Materials created by teachers will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>Created by: {material.creator?.firstName} {material.creator?.lastName}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(material.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>👁 {material.views || 0} views</span>
                        <span>⬇ {material.downloads || 0} downloads</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolMaterialsPage;