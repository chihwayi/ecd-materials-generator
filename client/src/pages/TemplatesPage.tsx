import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: string;
  ageGroupMin: number;
  ageGroupMax: number;
  culturalTags: string[];
  languages: string[];
  content: any;
  thumbnail: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isActive: boolean;
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'math': return '🔢';
      case 'language': return '📚';
      case 'art': return '🎨';
      case 'science': return '🔬';
      case 'cultural': return '🏛️';
      default: return '📄';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'math': return 'bg-blue-100 text-blue-800';
      case 'language': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      case 'science': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgeGroupText = (min: number, max: number) => {
    return `${min}-${max} years`;
  };

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory && template.category !== selectedCategory) return false;
    if (selectedDifficulty && template.difficulty !== selectedDifficulty) return false;
    if (selectedLanguage && !template.languages.includes(selectedLanguage)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl mr-4">🎨</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Learning Material Templates</h1>
                <p className="text-xl text-blue-100">
                  Choose from our collection of amazing ECD templates for Zimbabwean children
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">🔢</div>
                <div className="font-semibold">Math</div>
                <div className="text-sm opacity-90">{templates.filter(t => t.category === 'math').length} templates</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold">Language</div>
                <div className="text-sm opacity-90">{templates.filter(t => t.category === 'language').length} templates</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-semibold">Art</div>
                <div className="text-sm opacity-90">{templates.filter(t => t.category === 'art').length} templates</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">🔬</div>
                <div className="font-semibold">Science</div>
                <div className="text-sm opacity-90">{templates.filter(t => t.category === 'science').length} templates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="math">🔢 Math</option>
                <option value="language">📚 Language</option>
                <option value="art">🎨 Art</option>
                <option value="science">🔬 Science</option>
                <option value="cultural">🏛️ Cultural</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="advanced">🔴 Advanced</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Languages</option>
                <option value="en">🇺🇸 English</option>
                <option value="sn">🇿🇼 Shona</option>
                <option value="nd">🇿🇼 Ndebele</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Template Header */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-3xl">{getCategoryIcon(template.category)}</span>
                  </div>
                  <p className="text-gray-800 font-bold text-lg">{template.name}</p>
                </div>
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Premium
                  </div>
                )}
              </div>

              {/* Template Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category?.charAt(0).toUpperCase() + template.category?.slice(1) || 'General'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty?.charAt(0).toUpperCase() + template.difficulty?.slice(1) || 'Medium'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {getAgeGroupText(template.ageGroupMin, template.ageGroupMax)}
                  </span>
                </div>

                {/* Cultural Tags */}
                {template.culturalTags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.culturalTags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                      {template.culturalTags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{template.culturalTags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📥</span>
                    {template.downloads || 0} downloads
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⭐</span>
                    {typeof template.rating === 'number' ? template.rating.toFixed(1) : '0.0'} ({template.reviewCount || 0} reviews)
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/materials/create?template=${template.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-center block"
                >
                  🚀 Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more templates.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDifficulty('');
                setSelectedLanguage('');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Amazing Learning Materials?</h2>
            <p className="text-lg mb-6">Start with one of our professionally designed templates!</p>
            <Link
              to="/materials/create"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 inline-block"
            >
              🎨 Start Creating
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;