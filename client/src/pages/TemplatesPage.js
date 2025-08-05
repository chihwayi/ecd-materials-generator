import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TemplateMarketplace from '../components/TemplateMarketplace';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/v1/templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    return (
      (!selectedCategory || template.category === selectedCategory) &&
      (!selectedDifficulty || template.difficulty === selectedDifficulty)
    );
  });

  const getTemplateIcon = (template) => {
    if (template.subcategory === 'coloring') return '🎨';
    if (template.subcategory === 'puzzle') {
      if (template.name.includes('Shape')) return '🔵';
      if (template.name.includes('Color')) return '🌈';
      if (template.name.includes('Number')) return '🔢';
      if (template.name.includes('Animal')) return '🐄';
      if (template.name.includes('Picture')) return '🧩';
    }
    return '📚';
  };

  const getCategoryColor = (category) => {
    const colors = {
      art: 'bg-pink-100 text-pink-800',
      math: 'bg-blue-100 text-blue-800',
      science: 'bg-green-100 text-green-800',
      language: 'bg-purple-100 text-purple-800',
      social: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('template', file);

    try {
      const response = await fetch('/api/v1/marketplace/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setTemplates([...templates, result.template]);
        alert('Template uploaded successfully!');
      }
    } catch (error) {
      alert('Failed to upload template');
    }
  };

  const handleMarketplaceInstall = (newTemplate) => {
    setTemplates([...templates, newTemplate]);
    setShowMarketplace(false);
  };

  const renderTemplateContent = (template) => {
    if (template.content?.html) {
      return (
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: template.content.html }}
        />
      );
    }
    if (template.content?.svg) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: template.content.svg }}
        />
      );
    }
    return <div className="text-gray-500">No preview available</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Material Templates</h1>
          <p className="text-gray-600 mt-2">
            Choose from our collection of interactive templates including coloring pages and puzzles.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="art">Art</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="language">Language</option>
              <option value="social">Social</option>
            </select>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMarketplace(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                🏪 Browse Marketplace
              </button>
              <label className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer flex items-center gap-2">
                📁 Upload .ecdx
                <input
                  type="file"
                  accept=".ecdx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">{getTemplateIcon(template)}</span>
                  </div>
                  <p className="text-blue-700 font-medium">{template.subcategory}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    {template.difficulty && (
                      <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handlePreview(template)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                {renderTemplateContent(selectedTemplate)}
              </div>
            </div>
          </div>
        </div>
      )}

      <TemplateMarketplace
        isOpen={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        onInstall={handleMarketplaceInstall}
      />
    </div>
  );
};

export default TemplatesPage;