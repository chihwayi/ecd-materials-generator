import React, { useState, useEffect } from 'react';

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  spinnerStyle.setAttribute('data-spinner', 'true');
  document.head.appendChild(spinnerStyle);
}

const Marketplace = ({ onNavigateToStudio }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data instead of API call
    setTimeout(() => {
      setTemplates([
        {
          id: 1,
          name: "Animal Friends Coloring",
          description: "Fun coloring template with friendly animals for kids to learn about wildlife",
          category: "art",
          difficulty: "easy",
          ageGroupMin: 3,
          ageGroupMax: 5,
          downloads: 1250,
          rating: 4.8,
          authorName: "Teacher Sarah",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Counting with Fruits",
          description: "Interactive counting exercise using colorful fruits and numbers",
          category: "math",
          difficulty: "medium",
          ageGroupMin: 4,
          ageGroupMax: 6,
          downloads: 890,
          rating: 4.6,
          authorName: "Ms. Johnson",
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 3,
          name: "Weather Patterns",
          description: "Learn about different weather conditions with interactive elements",
          category: "science",
          difficulty: "medium",
          ageGroupMin: 5,
          ageGroupMax: 7,
          downloads: 567,
          rating: 4.4,
          authorName: "Dr. Smith",
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 4,
          name: "Letter Tracing Fun",
          description: "Practice writing letters with guided tracing activities",
          category: "language",
          difficulty: "easy",
          ageGroupMin: 3,
          ageGroupMax: 5,
          downloads: 2100,
          rating: 4.9,
          authorName: "Teacher Mary",
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        },
        {
          id: 5,
          name: "Shape Recognition",
          description: "Identify and match different geometric shapes in a fun way",
          category: "math",
          difficulty: "easy",
          ageGroupMin: 3,
          ageGroupMax: 4,
          downloads: 1456,
          rating: 4.7,
          authorName: "Ms. Wilson",
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 6,
          name: "Garden Adventure",
          description: "Explore plants and insects in this nature-themed activity",
          category: "science",
          difficulty: "hard",
          ageGroupMin: 6,
          ageGroupMax: 8,
          downloads: 334,
          rating: 4.2,
          authorName: "Teacher Bob",
          createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const downloadTemplate = (templateId, templateName) => {
    // Mock download - create a simple text file
    const content = `ECD Template: ${templateName}\nTemplate ID: ${templateId}\nDownloaded: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName}.ecdx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Update download count
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, downloads: t.downloads + 1 } : t
    ));
  };

  const filteredTemplates = templates.filter(template => {
    const matchesFilter = filter === 'all' || template.category === filter;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });



  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'art': return '🎨';
      case 'math': return '🔢';
      case 'science': return '🔬';
      case 'language': return '📖';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #dbeafe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #9333ea',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#7c3aed'
          }}>Loading amazing templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #dbeafe 100%)'
    }}>
      {/* Beautiful Header */}
      <div style={{
        background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #3b82f6 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <button 
                onClick={() => onNavigateToStudio && onNavigateToStudio()}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                ← Back to Studio
              </button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '50%'
                }}>
                  <span style={{ fontSize: '36px' }}>🏪</span>
                </div>
                <div>
                  <h1 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0
                  }}>ECD Template Marketplace</h1>
                  <p style={{
                    fontSize: '20px',
                    color: '#e0e7ff',
                    marginTop: '8px',
                    margin: 0
                  }}>Discover amazing learning templates for kids!</p>
                </div>
              </div>
              <div style={{ width: '128px' }}></div>
            </div>
            
            {/* Search and Filter */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '320px',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    fontSize: '18px',
                    fontWeight: '500',
                    border: '2px solid white',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    outline: 'none'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '16px',
                  top: '12px',
                  fontSize: '24px'
                }}>🔍</span>
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid white',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">🌟 All Categories</option>
                <option value="art">🎨 Art & Creativity</option>
                <option value="math">🔢 Math & Numbers</option>
                <option value="science">🔬 Science & Nature</option>
                <option value="language">📖 Language & Reading</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            textAlign: 'center',
            border: '4px solid #e9d5ff'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📚</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#9333ea'
            }}>{templates.length}</div>
            <div style={{
              color: '#6b7280',
              fontWeight: '500'
            }}>Total Templates</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            textAlign: 'center',
            border: '4px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>⬇️</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#059669'
            }}>{templates.reduce((sum, t) => sum + t.downloads, 0)}</div>
            <div style={{
              color: '#6b7280',
              fontWeight: '500'
            }}>Total Downloads</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            textAlign: 'center',
            border: '4px solid #fef3c7'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>⭐</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#d97706'
            }}>{templates.filter(t => t.rating >= 4).length}</div>
            <div style={{
              color: '#6b7280',
              fontWeight: '500'
            }}>Top Rated</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            textAlign: 'center',
            border: '4px solid #bfdbfe'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🆕</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#2563eb'
            }}>{templates.filter(t => new Date(t.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}</div>
            <div style={{
              color: '#6b7280',
              fontWeight: '500'
            }}>New This Week</div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 0'
          }}>
            <div style={{ fontSize: '96px', marginBottom: '16px' }}>😔</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#6b7280',
              marginBottom: '8px'
            }}>No templates found</h3>
            <p style={{ color: '#9ca3af' }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {filteredTemplates.map((template) => (
              <div key={template.id} style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s',
                transform: 'scale(1)',
                border: '4px solid #f3e8ff',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = '#a855f7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                e.currentTarget.style.borderColor = '#f3e8ff';
              }}>
                {/* Template Thumbnail */}
                <div style={{ position: 'relative' }}>
                  {template.thumbnail ? (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      style={{
                        width: '100%',
                        height: '192px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '192px',
                      background: 'linear-gradient(135deg, #ddd6fe 0%, #fbcfe8 100%)',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '96px' }}>{getCategoryIcon(template.category)}</span>
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      background: template.difficulty === 'easy' ? '#dcfce7' : 
                                 template.difficulty === 'medium' ? '#fef3c7' : '#fecaca',
                      color: template.difficulty === 'easy' ? '#166534' : 
                             template.difficulty === 'medium' ? '#92400e' : '#991b1b'
                    }}>
                      {getDifficultyIcon(template.difficulty)} {template.difficulty}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px'
                  }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#374151'
                    }}>
                      {getCategoryIcon(template.category)} {template.category}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>{template.name}</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>{template.description}</p>
                  
                  {/* Age Range */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280'
                    }}>👶 Ages {template.ageGroupMin}-{template.ageGroupMax}</span>
                  </div>
                  
                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>⬇️ {template.downloads}</span>
                      {template.rating > 0 && (
                        <span style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>⭐ {template.rating.toFixed(1)}</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>by {template.authorName}</span>
                  </div>
                  
                  {/* Download Button */}
                  <button
                    onClick={() => downloadTemplate(template.id, template.name)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      transform: 'scale(1)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #9333ea 0%, #db2777 100%)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    📥 Download Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
        color: 'white',
        padding: '48px 0',
        marginTop: '64px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>Ready to create your own template?</h3>
          <p style={{
            fontSize: '18px',
            marginBottom: '24px'
          }}>Use our Template Studio to design amazing learning materials!</p>
          <button 
            onClick={() => onNavigateToStudio && onNavigateToStudio()}
            style={{
              background: 'white',
              color: '#9333ea',
              fontWeight: 'bold',
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              transform: 'scale(1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f3e8ff';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'scale(1)';
            }}
          >
            🎨 Open Template Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;