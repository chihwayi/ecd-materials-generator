import React, { useState } from 'react';
import TemplateStudio from './TemplateStudio';
import Marketplace from './Marketplace';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('studio');

  return (
    <div className="App">
      {currentView === 'studio' ? (
        <TemplateStudio onNavigateToMarketplace={() => setCurrentView('marketplace')} />
      ) : (
        <Marketplace onNavigateToStudio={() => setCurrentView('studio')} />
      )}
    </div>
  );
}

export default App;