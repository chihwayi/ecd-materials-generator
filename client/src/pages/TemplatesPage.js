import React from 'react';

const TemplatesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Material Templates</h1>
          <p className="text-gray-600 mt-2">
            Choose from our collection of culturally-appropriate templates for Zimbabwean children.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="math">Math</option>
              <option value="language">Language</option>
              <option value="art">Art</option>
              <option value="cultural">Cultural</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="sn">Shona</option>
              <option value="nd">Ndebele</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-2xl">🐘</span>
                </div>
                <p className="text-blue-700 font-medium">Counting Animals</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Counting Animals</h3>
              <p className="text-sm text-gray-600 mb-3">Learn to count with Zimbabwean animals</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Math</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Beginner</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Use Template
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-2xl">🔤</span>
                </div>
                <p className="text-green-700 font-medium">Shona Alphabet</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Shona Alphabet</h3>
              <p className="text-sm text-gray-600 mb-3">Learn Shona letters with cultural objects</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Language</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Beginner</span>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Use Template
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-60">
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-2xl">+</span>
                </div>
                <p className="text-gray-600 font-medium">More Templates</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">More Templates Coming</h3>
              <p className="text-sm text-gray-600 mb-3">We're adding more culturally-rich templates</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;