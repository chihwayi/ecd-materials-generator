import React, { useState } from 'react';

interface CulturalContent {
  id: string;
  type: 'proverb' | 'story' | 'song' | 'tradition' | 'game';
  title: string;
  content: string;
  translation?: string;
  language: 'sn' | 'nd';
  category: string;
  ageGroup: string;
  audioUrl?: string;
}

interface CulturalContentLibraryProps {
  onSelect: (content: CulturalContent) => void;
  language: 'sn' | 'nd';
}

const CulturalContentLibrary: React.FC<CulturalContentLibraryProps> = ({ onSelect, language }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const culturalContent: CulturalContent[] = [
    {
      id: '1',
      type: 'proverb',
      title: 'Chakafukidza dzimba matenga',
      content: 'Chakafukidza dzimba matenga',
      translation: 'What covers houses is the roof',
      language: 'sn',
      category: 'wisdom',
      ageGroup: '7-12',
      audioUrl: '/audio/proverbs/chakafukidza.mp3'
    },
    {
      id: '2',
      type: 'story',
      title: 'Tsuro naSoko',
      content: 'Pane imwe nguva, kwakanga kune tsuro yakanga ichenjera kwazvo...',
      translation: 'Once upon a time, there was a very clever rabbit...',
      language: 'sn',
      category: 'folktales',
      ageGroup: '3-8',
      audioUrl: '/audio/stories/tsuro-nasoko.mp3'
    },
    {
      id: '3',
      type: 'song',
      title: 'Sarungano',
      content: 'Sarungano... Sarungano... Sarungano...',
      translation: 'Story time... Story time... Story time...',
      language: 'sn',
      category: 'music',
      ageGroup: '3-6',
      audioUrl: '/audio/songs/sarungano.mp3'
    },
    {
      id: '4',
      type: 'game',
      title: 'Pada',
      content: 'Mutambo wekutamba nepada...',
      translation: 'A traditional game played with stones...',
      language: 'sn',
      category: 'games',
      ageGroup: '5-12',
    },
    {
      id: '5',
      type: 'proverb',
      title: 'Umuntu ngumuntu ngabantu',
      content: 'Umuntu ngumuntu ngabantu',
      translation: 'A person is a person through other people',
      language: 'nd',
      category: 'wisdom',
      ageGroup: '7-12',
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'wisdom', name: 'Proverbs & Wisdom', icon: '🧠' },
    { id: 'folktales', name: 'Folk Tales', icon: '📖' },
    { id: 'music', name: 'Songs & Music', icon: '🎵' },
    { id: 'games', name: 'Traditional Games', icon: '🎯' },
    { id: 'traditions', name: 'Traditions', icon: '🏛️' }
  ];

  const filteredContent = culturalContent.filter(item => {
    const matchesLanguage = item.language === language;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLanguage && matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'proverb': return '💭';
      case 'story': return '📚';
      case 'song': return '🎵';
      case 'tradition': return '🏛️';
      case 'game': return '🎯';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Cultural Content Library ({language === 'sn' ? 'Shona' : 'Ndebele'})
        </h3>
        <div className="text-sm text-gray-500">
          {filteredContent.length} items
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cultural content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getTypeIcon(item.type)}</span>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {item.ageGroup}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
              {item.content}
            </p>
            
            {item.translation && (
              <p className="text-xs text-gray-500 italic mb-2">
                "{item.translation}"
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {item.type}
              </span>
              {item.audioUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Play audio logic here
                    console.log('Playing audio:', item.audioUrl);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  🔊 Play
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500">No cultural content found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default CulturalContentLibrary;