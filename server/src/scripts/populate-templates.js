const { Template } = require('../models');
const { sequelize } = require('../utils/database');

const templates = [
  // ===== MATH TEMPLATES =====
  {
    name: "Counting Safari Animals",
    description: "Learn to count 1-10 with beautiful African safari animals. Perfect for number recognition and counting skills.",
    category: "math",
    subcategory: "counting",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 5,
    culturalTags: ["african_animals", "safari", "counting"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "counting_1",
          type: "question",
          content: {
            question: "How many elephants do you see?",
            options: ["1", "2", "3", "4"],
            correct: 2,
            image: "elephants.png"
          }
        },
        {
          id: "counting_2", 
          type: "drawing-task",
          content: {
            task: "Draw 5 giraffes",
            instructions: "Draw 5 tall giraffes with long necks",
            canvasData: null
          }
        }
      ]
    },
    thumbnail: "safari_counting.jpg",
    isActive: true
  },

  {
    name: "Shapes in Nature",
    description: "Identify basic shapes (circle, square, triangle) in natural objects and animals.",
    category: "math",
    subcategory: "shapes",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 5,
    culturalTags: ["shapes", "nature", "geometry"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "shape_1",
          type: "question",
          content: {
            question: "What shape is the sun?",
            options: ["Circle", "Square", "Triangle", "Rectangle"],
            correct: 0
          }
        },
        {
          id: "shape_2",
          type: "drawing-task",
          content: {
            task: "Draw a circle, square, and triangle",
            instructions: "Draw three different shapes"
          }
        }
      ]
    },
    thumbnail: "shapes_nature.jpg",
    isActive: true
  },

  {
    name: "Addition with Fruits",
    description: "Learn basic addition (1+1 to 5+5) using colorful fruits and vegetables.",
    category: "math",
    subcategory: "addition",
    difficulty: "intermediate",
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ["fruits", "addition", "healthy_food"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "addition_1",
          type: "question",
          content: {
            question: "2 apples + 3 oranges = ?",
            options: ["4", "5", "6", "7"],
            correct: 1
          }
        },
        {
          id: "addition_2",
          type: "drawing-task",
          content: {
            task: "Draw 2 bananas and 3 mangoes",
            instructions: "Draw the fruits and count them"
          }
        }
      ]
    },
    thumbnail: "fruit_addition.jpg",
    isActive: true
  },

  // ===== LANGUAGE TEMPLATES =====
  {
    name: "Animal Alphabet",
    description: "Learn the alphabet A-Z with African animals. Each letter features a different animal.",
    category: "language",
    subcategory: "alphabet",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 6,
    culturalTags: ["alphabet", "african_animals", "letters"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "alphabet_1",
          type: "question",
          content: {
            question: "What letter does 'Antelope' start with?",
            options: ["A", "B", "C", "D"],
            correct: 0
          }
        },
        {
          id: "alphabet_2",
          type: "drawing-task",
          content: {
            task: "Draw an animal that starts with 'L'",
            instructions: "Draw a lion or leopard"
          }
        }
      ]
    },
    thumbnail: "animal_alphabet.jpg",
    isActive: true
  },

  {
    name: "Rhyming Words",
    description: "Learn rhyming words with fun African-themed vocabulary.",
    category: "language",
    subcategory: "rhyming",
    difficulty: "intermediate",
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ["rhyming", "vocabulary", "phonics"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "rhyme_1",
          type: "question",
          content: {
            question: "What rhymes with 'tree'?",
            options: ["bee", "cat", "dog", "sun"],
            correct: 0
          }
        },
        {
          id: "rhyme_2",
          type: "audio-recording",
          content: {
            task: "Record yourself saying rhyming words",
            instructions: "Say 'tree' and 'bee'"
          }
        }
      ]
    },
    thumbnail: "rhyming_words.jpg",
    isActive: true
  },

  {
    name: "Story Time",
    description: "Create your own story with African animals and landscapes.",
    category: "language",
    subcategory: "storytelling",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["storytelling", "imagination", "african_stories"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "story_1",
          type: "text-input",
          content: {
            task: "Write a story about a lion",
            instructions: "Write 2-3 sentences about a lion's day"
          }
        },
        {
          id: "story_2",
          type: "drawing-task",
          content: {
            task: "Draw a picture for your story",
            instructions: "Draw the lion from your story"
          }
        }
      ]
    },
    thumbnail: "story_time.jpg",
    isActive: true
  },

  // ===== ART TEMPLATES =====
  {
    name: "African Animal Coloring",
    description: "Color beautiful African animals with vibrant colors. Learn about wildlife while creating art.",
    category: "art",
    subcategory: "coloring",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 6,
    culturalTags: ["coloring", "african_animals", "art"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "coloring_1",
          type: "drawing-task",
          content: {
            task: "Color the elephant",
            instructions: "Use brown and gray colors for the elephant",
            canvasData: "elephant_outline.png"
          }
        },
        {
          id: "coloring_2",
          type: "drawing-task",
          content: {
            task: "Color the zebra",
            instructions: "Use black and white stripes for the zebra",
            canvasData: "zebra_outline.png"
          }
        }
      ]
    },
    thumbnail: "african_coloring.jpg",
    isActive: true
  },

  {
    name: "Traditional Patterns",
    description: "Learn about traditional African patterns and create your own designs.",
    category: "art",
    subcategory: "patterns",
    difficulty: "intermediate",
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ["patterns", "traditional", "african_design"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "pattern_1",
          type: "drawing-task",
          content: {
            task: "Draw a traditional pattern",
            instructions: "Create a repeating pattern with shapes"
          }
        },
        {
          id: "pattern_2",
          type: "drawing-task",
          content: {
            task: "Color your pattern",
            instructions: "Use bright colors for your pattern"
          }
        }
      ]
    },
    thumbnail: "traditional_patterns.jpg",
    isActive: true
  },

  {
    name: "Landscape Painting",
    description: "Paint beautiful African landscapes with mountains, trees, and animals.",
    category: "art",
    subcategory: "painting",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["landscape", "painting", "african_scenery"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "landscape_1",
          type: "drawing-task",
          content: {
            task: "Paint an African sunset",
            instructions: "Use orange, red, and yellow colors"
          }
        },
        {
          id: "landscape_2",
          type: "drawing-task",
          content: {
            task: "Add animals to your landscape",
            instructions: "Draw animals in your sunset scene"
          }
        }
      ]
    },
    thumbnail: "landscape_painting.jpg",
    isActive: true
  },

  // ===== SCIENCE TEMPLATES =====
  {
    name: "Weather Watchers",
    description: "Learn about different weather conditions and how they affect animals and plants.",
    category: "science",
    subcategory: "weather",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 5,
    culturalTags: ["weather", "nature", "observation"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "weather_1",
          type: "question",
          content: {
            question: "What do animals do when it rains?",
            options: ["Hide under trees", "Dance in the rain", "Fly away", "Sleep"],
            correct: 0
          }
        },
        {
          id: "weather_2",
          type: "drawing-task",
          content: {
            task: "Draw a sunny day",
            instructions: "Draw the sun, clouds, and animals"
          }
        }
      ]
    },
    thumbnail: "weather_watchers.jpg",
    isActive: true
  },

  {
    name: "Plant Life Cycle",
    description: "Learn about how plants grow from seeds to flowers.",
    category: "science",
    subcategory: "plants",
    difficulty: "intermediate",
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ["plants", "growth", "life_cycle"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "plant_1",
          type: "question",
          content: {
            question: "What do plants need to grow?",
            options: ["Water and sun", "Candy", "Toys", "Books"],
            correct: 0
          }
        },
        {
          id: "plant_2",
          type: "drawing-task",
          content: {
            task: "Draw a plant growing",
            instructions: "Draw a seed, sprout, and flower"
          }
        }
      ]
    },
    thumbnail: "plant_life_cycle.jpg",
    isActive: true
  },

  // ===== CULTURAL TEMPLATES =====
  {
    name: "Traditional Dance",
    description: "Learn about traditional African dances and create your own dance moves.",
    category: "cultural",
    subcategory: "dance",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 6,
    culturalTags: ["dance", "traditional", "african_culture"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "dance_1",
          type: "audio-recording",
          content: {
            task: "Record a traditional dance song",
            instructions: "Sing or clap to a traditional rhythm"
          }
        },
        {
          id: "dance_2",
          type: "drawing-task",
          content: {
            task: "Draw people dancing",
            instructions: "Draw people in traditional dance clothes"
          }
        }
      ]
    },
    thumbnail: "traditional_dance.jpg",
    isActive: true
  },

  {
    name: "Traditional Food",
    description: "Learn about traditional African foods and healthy eating habits.",
    category: "cultural",
    subcategory: "food",
    difficulty: "intermediate",
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ["food", "traditional", "healthy_eating"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "food_1",
          type: "question",
          content: {
            question: "What traditional food is made from corn?",
            options: ["Sadza", "Pizza", "Burger", "Cake"],
            correct: 0
          }
        },
        {
          id: "food_2",
          type: "drawing-task",
          content: {
            task: "Draw traditional foods",
            instructions: "Draw sadza, vegetables, and meat"
          }
        }
      ]
    },
    thumbnail: "traditional_food.jpg",
    isActive: true
  },

  {
    name: "Family and Community",
    description: "Learn about family relationships and community values in African culture.",
    category: "cultural",
    subcategory: "family",
    difficulty: "beginner",
    ageGroupMin: 3,
    ageGroupMax: 5,
    culturalTags: ["family", "community", "values"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "family_1",
          type: "question",
          content: {
            question: "Who helps take care of children in the community?",
            options: ["Everyone", "Only parents", "Only teachers", "Only doctors"],
            correct: 0
          }
        },
        {
          id: "family_2",
          type: "drawing-task",
          content: {
            task: "Draw your family",
            instructions: "Draw your family members together"
          }
        }
      ]
    },
    thumbnail: "family_community.jpg",
    isActive: true
  },

  // ===== ADVANCED MATH TEMPLATES =====
  {
    name: "Money Math",
    description: "Learn about coins and basic money concepts using African currency.",
    category: "math",
    subcategory: "money",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["money", "currency", "african_coins"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "money_1",
          type: "question",
          content: {
            question: "How many 10 cent coins make 50 cents?",
            options: ["3", "4", "5", "6"],
            correct: 2
          }
        },
        {
          id: "money_2",
          type: "drawing-task",
          content: {
            task: "Draw coins to make 1 dollar",
            instructions: "Draw different coins that add up to 1 dollar"
          }
        }
      ]
    },
    thumbnail: "money_math.jpg",
    isActive: true
  },

  {
    name: "Pattern Recognition",
    description: "Identify and create patterns using colors, shapes, and numbers.",
    category: "math",
    subcategory: "patterns",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["patterns", "logic", "sequence"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "pattern_math_1",
          type: "question",
          content: {
            question: "What comes next: 2, 4, 6, 8, ?",
            options: ["9", "10", "11", "12"],
            correct: 1
          }
        },
        {
          id: "pattern_math_2",
          type: "drawing-task",
          content: {
            task: "Create a color pattern",
            instructions: "Draw a repeating pattern with 3 colors"
          }
        }
      ]
    },
    thumbnail: "pattern_recognition.jpg",
    isActive: true
  },

  // ===== LANGUAGE ADVANCED TEMPLATES =====
  {
    name: "Story Writing",
    description: "Write creative stories about African animals and adventures.",
    category: "language",
    subcategory: "writing",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["writing", "stories", "imagination"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "writing_1",
          type: "text-input",
          content: {
            task: "Write a story about a brave lion",
            instructions: "Write 3-4 sentences about a lion's adventure"
          }
        },
        {
          id: "writing_2",
          type: "drawing-task",
          content: {
            task: "Draw your story characters",
            instructions: "Draw the lion and other characters from your story"
          }
        }
      ]
    },
    thumbnail: "story_writing.jpg",
    isActive: true
  },

  {
    name: "Reading Comprehension",
    description: "Read short passages about African culture and answer questions.",
    category: "language",
    subcategory: "reading",
    difficulty: "advanced",
    ageGroupMin: 5,
    ageGroupMax: 6,
    culturalTags: ["reading", "comprehension", "african_culture"],
    languages: ["en"],
    content: {
      elements: [
        {
          id: "reading_1",
          type: "text-display",
          content: {
            text: "The lion is the king of the jungle. He lives with his family called a pride. Lions are very strong and brave animals."
          }
        },
        {
          id: "reading_2",
          type: "question",
          content: {
            question: "What is a group of lions called?",
            options: ["A herd", "A pride", "A pack", "A family"],
            correct: 1
          }
        }
      ]
    },
    thumbnail: "reading_comprehension.jpg",
    isActive: true
  }
];

const populateTemplates = async () => {
  try {
    console.log('Starting template population...');
    
    // Clear existing templates
    await Template.destroy({ where: {} });
    console.log('Cleared existing templates');
    
    // Create new templates
    for (const template of templates) {
      await Template.create(template);
      console.log(`Created template: ${template.name}`);
    }
    
    console.log(`✅ Successfully created ${templates.length} templates!`);
    console.log('\n📊 Template Summary:');
    console.log(`- Math templates: ${templates.filter(t => t.category === 'math').length}`);
    console.log(`- Language templates: ${templates.filter(t => t.category === 'language').length}`);
    console.log(`- Art templates: ${templates.filter(t => t.category === 'art').length}`);
    console.log(`- Science templates: ${templates.filter(t => t.category === 'science').length}`);
    console.log(`- Cultural templates: ${templates.filter(t => t.category === 'cultural').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating templates:', error);
    process.exit(1);
  }
};

populateTemplates(); 