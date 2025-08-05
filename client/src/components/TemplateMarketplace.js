import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TemplateMarketplace = ({ isOpen, onClose, onInstall }) => {
  const [marketplaceTemplates, setMarketplaceTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchMarketplaceTemplates();
    }
  }, [isOpen]);

  const fetchMarketplaceTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/marketplace/browse', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const templates = await response.json();
        setMarketplaceTemplates(templates);
      }
    } catch (error) {
      console.error('Error fetching marketplace templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (templateId) => {
    try {
      const response = await fetch(`/api/v1/marketplace/install/${templateId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        onInstall(result.template);
        alert('Template installed successfully!');
      }
    } catch (error) {
      alert('Failed to install template');
    }
  };

  const filteredTemplates = marketplaceTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Template Marketplace</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              <option value="art">Art</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="language">Language</option>
            </select>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading marketplace templates...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {template.thumbnail ? (
                      <img 
                        src={template.thumbnail} 
                        alt={template.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-4xl">📄</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⬇️ {template.downloads}
                      </span>
                    </div>
                    <button
                      onClick={() => handleInstall(template.id)}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      Install Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No templates found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateMarketplace;