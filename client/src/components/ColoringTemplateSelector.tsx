import React, { useState } from 'react';
import { coloringTemplates, getAllCategories, getTemplatesByCategory, ColoringTemplate } from '../utils/coloringTemplates';

interface ColoringTemplateSelectorProps {
  onSelectTemplate: (template: ColoringTemplate) => void;
  selectedTemplate?: ColoringTemplate | null;
}

const ColoringTemplateSelector: React.FC<ColoringTemplateSelectorProps> = ({
  onSelectTemplate,
  selectedTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = getAllCategories();

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return coloringTemplates;
    }
    return getTemplatesByCategory(selectedCategory);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Choose Coloring Template</h3>
      
      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {getFilteredTemplates().map(template => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`cursor-pointer border-2 rounded-lg p-3 transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-square mb-2 flex items-center justify-center bg-gray-50 rounded">
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: template.content }}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            </div>
            <div className="text-sm font-medium text-gray-900 text-center">
              {template.name}
            </div>
            {template.culturalContext && (
              <div className="text-xs text-gray-500 text-center mt-1 capitalize">
                {template.culturalContext}
              </div>
            )}
          </div>
        ))}
      </div>

      {getFilteredTemplates().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎨</div>
          <p>No templates found in this category</p>
        </div>
      )}
    </div>
  );
};

export default ColoringTemplateSelector;