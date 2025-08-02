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
      case 'published': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'draft': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'archived': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
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

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'math': return 'from-blue-500 to-blue-600';
      case 'language': return 'from-green-500 to-green-600';
      case 'science': return 'from-purple-500 to-purple-600';
      case 'art': return 'from-pink-500 to-pink-600';
      case 'cultural': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📚 My Materials</h1>
              <p className="text-blue-100 text-lg">Create and manage your learning materials</p>
            </div>
            <div className="text-6xl opacity-20">📖</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🔍 Filter Materials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="worksheet">📝 Worksheet</option>
                <option value="activity">🎯 Activity</option>
                <option value="assessment">📊 Assessment</option>
                <option value="story">📚 Story</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filter.subject}
                onChange={(e) => setFilter(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                <option value="math">🔢 Math</option>
                <option value="language">📚 Language</option>
                <option value="science">🔬 Science</option>
                <option value="art">🎨 Art</option>
                <option value="cultural">🌍 Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={filter.language}
                onChange={(e) => setFilter(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                <option value="en">🇺🇸 English</option>
                <option value="sn">🇿🇼 Shona</option>
                <option value="nd">🇿🇼 Ndebele</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="published">✅ Published</option>
                <option value="draft">📝 Draft</option>
                <option value="archived">📦 Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Material Button */}
        <div className="mb-8">
          <Link
            to="/materials/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="text-2xl mr-2">➕</span>
            <span className="font-semibold">Create New Material</span>
          </Link>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">{getTypeIcon(material.type)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                      {material.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {material.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r ${getSubjectColor(material.subject)} text-white`}>
                        {material.subject}
                      </span>
                      <span className="text-xs text-gray-500">
                        {material.ageGroup}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📅 {new Date(material.createdAt).toLocaleDateString()}</span>
                      <span>👤 {material.author?.firstName || material.creator?.firstName} {material.author?.lastName || material.creator?.lastName}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/materials/${material.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center text-sm font-medium"
                    >
                      👁️ View
                    </Link>
                    <Link
                      to={`/materials/${material.id}/edit`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center text-sm font-medium"
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600 mb-6">Create your first learning material to get started!</p>
            <Link
              to="/materials/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <span className="text-2xl mr-2">➕</span>
              <span>Create Your First Material</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;