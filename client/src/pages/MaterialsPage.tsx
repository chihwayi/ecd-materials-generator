import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { materialsService } from '../services/materials.service.ts';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'activity' | 'assessment' | 'story';
  subject: 'math' | 'language' | 'science' | 'art' | 'cultural';
  language: 'en' | 'sn' | 'nd';
  ageGroup: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  creator?: {
    firstName: string;
    lastName: string;
  };
}

const MaterialsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    subject: '',
    language: '',
    status: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, [filter]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialsService.getAllMaterials(1, 20, filter);
      setMaterials(response.data || []);
    } catch (error: any) {
      console.error('Fetch materials error:', error);
      toast.error('Failed to fetch materials');
      // Fallback to empty array
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'worksheet': return '📝';
      case 'activity': return '🎯';
      case 'assessment': return '📊';
      case 'story': return '📚';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Materials</h1>
            <p className="text-gray-600 mt-2">Create and manage your learning materials</p>
          </div>
          <Link
            to="/materials/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Create Material</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="worksheet">Worksheet</option>
                <option value="activity">Activity</option>
                <option value="assessment">Assessment</option>
                <option value="story">Story</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filter.subject}
                onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                <option value="math">Math</option>
                <option value="language">Language</option>
                <option value="science">Science</option>
                <option value="art">Art</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={filter.language}
                onChange={(e) => setFilter({ ...filter, language: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                <option value="en">English</option>
                <option value="sn">Shona</option>
                <option value="nd">Ndebele</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
            <p className="text-gray-600 mb-6">Create your first learning material to get started</p>
            <Link
              to="/materials/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Material
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div key={material.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(material.type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{material.title}</h3>
                        <p className="text-sm text-gray-600">{material.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                      {material.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{material.subject} • {material.ageGroup} years</span>
                    <span className="uppercase font-medium">{material.language}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      by {(material.author?.firstName || material.creator?.firstName || 'Unknown')} {(material.author?.lastName || material.creator?.lastName || 'User')}
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        to={`/materials/${material.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/materials/${material.id}`}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        View
                      </Link>
                      {material.status === 'draft' && (
                        <button
                          onClick={async () => {
                            try {
                              await materialsService.publishMaterial(material.id);
                              toast.success('Material published!');
                              fetchMaterials();
                            } catch (error) {
                              toast.error('Failed to publish material');
                            }
                          }}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          Publish
                        </button>
                      )}
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

export default MaterialsPage;