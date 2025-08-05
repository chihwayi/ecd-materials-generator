// Interactive puzzle/quiz templates for children

const puzzleTemplates = {
  shapeMatching: `<div class="puzzle-container" style="width: 600px; height: 500px; background: #f0f8ff; border: 2px solid #4a90e2; border-radius: 10px; position: relative; font-family: Arial, sans-serif;">
    <h3 style="text-align: center; color: #2c5aa0; margin: 10px 0;">Match the Shapes!</h3>
    
    <!-- Shape slots (drop zones) -->
    <div class="shape-slots" style="position: absolute; top: 80px; left: 50px;">
      <div class="slot circle-slot" data-shape="circle" style="width: 80px; height: 80px; border: 3px dashed #ff6b6b; border-radius: 50%; margin: 20px; display: inline-block; position: relative;">
        <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; color: #666;">Circle</span>
      </div>
      <div class="slot square-slot" data-shape="square" style="width: 80px; height: 80px; border: 3px dashed #4ecdc4; margin: 20px; display: inline-block; position: relative;">
        <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; color: #666;">Square</span>
      </div>
      <div class="slot triangle-slot" data-shape="triangle" style="width: 80px; height: 80px; border: 3px dashed #ffe66d; margin: 20px; display: inline-block; position: relative;">
        <span style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; color: #666;">Triangle</span>
      </div>
    </div>
    
    <!-- Draggable shapes -->
    <div class="draggable-shapes" style="position: absolute; bottom: 80px; left: 50px;">
      <div class="shape circle" draggable="true" data-shape="circle" style="width: 60px; height: 60px; background: #ff6b6b; border-radius: 50%; margin: 15px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
      <div class="shape square" draggable="true" data-shape="square" style="width: 60px; height: 60px; background: #4ecdc4; margin: 15px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
      <div class="shape triangle" draggable="true" data-shape="triangle" style="width: 0; height: 0; border-left: 30px solid transparent; border-right: 30px solid transparent; border-bottom: 52px solid #ffe66d; margin: 15px; display: inline-block; cursor: grab; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));"></div>
    </div>
    
    <div class="instructions" style="position: absolute; top: 20px; right: 20px; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="margin: 0; font-size: 12px; color: #666;">Drag shapes to matching slots!</p>
    </div>
  </div>`,

  colorMatching: `<div class="puzzle-container" style="width: 600px; height: 500px; background: #fff5f5; border: 2px solid #e53e3e; border-radius: 10px; position: relative; font-family: Arial, sans-serif;">
    <h3 style="text-align: center; color: #c53030; margin: 10px 0;">Match the Colors!</h3>
    
    <!-- Color objects to match -->
    <div class="color-objects" style="position: absolute; top: 80px; left: 50px;">
      <div class="object apple" style="position: relative; display: inline-block; margin: 20px;">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M30 10 C20 10, 10 20, 10 35 C10 50, 20 55, 30 55 C40 55, 50 50, 50 35 C50 20, 40 10, 30 10 Z" fill="#ddd" stroke="#999" stroke-width="2"/>
          <path d="M30 5 Q35 0, 40 5" stroke="#8B4513" stroke-width="2" fill="none"/>
        </svg>
        <div class="color-slot" data-color="red" style="position: absolute; top: 70px; left: 50%; transform: translateX(-50%); width: 40px; height: 20px; border: 2px dashed #e53e3e; border-radius: 10px;"></div>
      </div>
      
      <div class="object banana" style="position: relative; display: inline-block; margin: 20px;">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M15 30 Q20 15, 35 20 Q50 25, 45 40 Q40 50, 25 45 Q10 40, 15 30 Z" fill="#ddd" stroke="#999" stroke-width="2"/>
        </svg>
        <div class="color-slot" data-color="yellow" style="position: absolute; top: 70px; left: 50%; transform: translateX(-50%); width: 40px; height: 20px; border: 2px dashed #ecc94b; border-radius: 10px;"></div>
      </div>
      
      <div class="object leaf" style="position: relative; display: inline-block; margin: 20px;">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M30 10 Q45 20, 40 35 Q35 50, 30 45 Q25 50, 20 35 Q15 20, 30 10 Z" fill="#ddd" stroke="#999" stroke-width="2"/>
        </svg>
        <div class="color-slot" data-color="green" style="position: absolute; top: 70px; left: 50%; transform: translateX(-50%); width: 40px; height: 20px; border: 2px dashed #48bb78; border-radius: 10px;"></div>
      </div>
    </div>
    
    <!-- Color paint drops -->
    <div class="color-paints" style="position: absolute; bottom: 80px; left: 50px;">
      <div class="paint red" draggable="true" data-color="red" style="width: 40px; height: 50px; background: #e53e3e; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; margin: 15px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
      <div class="paint yellow" draggable="true" data-color="yellow" style="width: 40px; height: 50px; background: #ecc94b; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; margin: 15px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
      <div class="paint green" draggable="true" data-color="green" style="width: 40px; height: 50px; background: #48bb78; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; margin: 15px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
    </div>
    
    <div class="instructions" style="position: absolute; top: 20px; right: 20px; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="margin: 0; font-size: 12px; color: #666;">Drag colors to match objects!</p>
    </div>
  </div>`,

  numberSequence: `<div class="puzzle-container" style="width: 600px; height: 500px; background: #f0fff4; border: 2px solid #38a169; border-radius: 10px; position: relative; font-family: Arial, sans-serif;">
    <h3 style="text-align: center; color: #2f855a; margin: 10px 0;">Complete the Number Sequence!</h3>
    
    <!-- Number sequence with missing numbers -->
    <div class="number-sequence" style="position: absolute; top: 120px; left: 50px; display: flex; align-items: center;">
      <div class="number-box filled" style="width: 60px; height: 60px; background: #68d391; border: 2px solid #38a169; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px; font-size: 24px; font-weight: bold; color: white;">1</div>
      
      <div class="number-box filled" style="width: 60px; height: 60px; background: #68d391; border: 2px solid #38a169; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px; font-size: 24px; font-weight: bold; color: white;">2</div>
      
      <div class="number-slot" data-number="3" style="width: 60px; height: 60px; border: 3px dashed #38a169; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px; background: #f0fff4;">?</div>
      
      <div class="number-box filled" style="width: 60px; height: 60px; background: #68d391; border: 2px solid #38a169; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px; font-size: 24px; font-weight: bold; color: white;">4</div>
      
      <div class="number-slot" data-number="5" style="width: 60px; height: 60px; border: 3px dashed #38a169; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px; background: #f0fff4;">?</div>
    </div>
    
    <!-- Draggable numbers -->
    <div class="draggable-numbers" style="position: absolute; bottom: 100px; left: 50px;">
      <div class="number" draggable="true" data-number="3" style="width: 50px; height: 50px; background: #4299e1; border: 2px solid #3182ce; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin: 15px; font-size: 20px; font-weight: bold; color: white; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">3</div>
      
      <div class="number" draggable="true" data-number="5" style="width: 50px; height: 50px; background: #4299e1; border: 2px solid #3182ce; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin: 15px; font-size: 20px; font-weight: bold; color: white; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">5</div>
      
      <div class="number" draggable="true" data-number="7" style="width: 50px; height: 50px; background: #ed8936; border: 2px solid #dd6b20; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin: 15px; font-size: 20px; font-weight: bold; color: white; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">7</div>
    </div>
    
    <div class="instructions" style="position: absolute; top: 20px; right: 20px; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="margin: 0; font-size: 12px; color: #666;">Drag numbers to complete 1-2-?-4-?</p>
    </div>
  </div>`,

  animalSounds: `<div class="puzzle-container" style="width: 600px; height: 500px; background: #fffaf0; border: 2px solid #ed8936; border-radius: 10px; position: relative; font-family: Arial, sans-serif;">
    <h3 style="text-align: center; color: #c05621; margin: 10px 0;">Match Animals to Their Sounds!</h3>
    
    <!-- Animals -->
    <div class="animals" style="position: absolute; top: 80px; left: 30px;">
      <div class="animal-item" style="display: flex; align-items: center; margin: 20px 0;">
        <div class="animal cow" style="width: 80px; height: 60px; background: #f7fafc; border: 2px solid #4a5568; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
          <svg width="50" height="40" viewBox="0 0 50 40">
            <ellipse cx="25" cy="25" rx="20" ry="12" fill="#8B4513" stroke="#654321" stroke-width="1"/>
            <ellipse cx="20" cy="20" rx="3" ry="2" fill="#000"/>
            <ellipse cx="30" cy="20" rx="3" ry="2" fill="#000"/>
            <path d="M15 15 Q12 10, 15 8" stroke="#654321" stroke-width="2" fill="none"/>
            <path d="M35 15 Q38 10, 35 8" stroke="#654321" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <div class="sound-slot" data-animal="cow" style="width: 100px; height: 40px; border: 2px dashed #ed8936; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fffaf0;">Drop sound here</div>
      </div>
      
      <div class="animal-item" style="display: flex; align-items: center; margin: 20px 0;">
        <div class="animal cat" style="width: 80px; height: 60px; background: #f7fafc; border: 2px solid #4a5568; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
          <svg width="50" height="40" viewBox="0 0 50 40">
            <ellipse cx="25" cy="25" rx="15" ry="10" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
            <ellipse cx="20" cy="22" rx="2" ry="2" fill="#000"/>
            <ellipse cx="30" cy="22" rx="2" ry="2" fill="#000"/>
            <path d="M18 15 L22 10 L20 15" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
            <path d="M32 15 L28 10 L30 15" fill="#FFA500" stroke="#FF8C00" stroke-width="1"/>
          </svg>
        </div>
        <div class="sound-slot" data-animal="cat" style="width: 100px; height: 40px; border: 2px dashed #ed8936; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fffaf0;">Drop sound here</div>
      </div>
      
      <div class="animal-item" style="display: flex; align-items: center; margin: 20px 0;">
        <div class="animal dog" style="width: 80px; height: 60px; background: #f7fafc; border: 2px solid #4a5568; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
          <svg width="50" height="40" viewBox="0 0 50 40">
            <ellipse cx="25" cy="25" rx="18" ry="10" fill="#8B4513" stroke="#654321" stroke-width="1"/>
            <ellipse cx="20" cy="22" rx="2" ry="2" fill="#000"/>
            <ellipse cx="30" cy="22" rx="2" ry="2" fill="#000"/>
            <path d="M15 20 Q10 15, 12 18" fill="#8B4513" stroke="#654321" stroke-width="1"/>
            <path d="M35 20 Q40 15, 38 18" fill="#8B4513" stroke="#654321" stroke-width="1"/>
          </svg>
        </div>
        <div class="sound-slot" data-animal="dog" style="width: 100px; height: 40px; border: 2px dashed #ed8936; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: #fffaf0;">Drop sound here</div>
      </div>
    </div>
    
    <!-- Sound bubbles -->
    <div class="sounds" style="position: absolute; bottom: 60px; right: 50px;">
      <div class="sound" draggable="true" data-animal="cow" style="background: #4299e1; color: white; padding: 10px 15px; border-radius: 20px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-weight: bold;">MOO!</div>
      <div class="sound" draggable="true" data-animal="cat" style="background: #ed64a6; color: white; padding: 10px 15px; border-radius: 20px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-weight: bold;">MEOW!</div>
      <div class="sound" draggable="true" data-animal="dog" style="background: #48bb78; color: white; padding: 10px 15px; border-radius: 20px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-weight: bold;">WOOF!</div>
    </div>
    
    <div class="instructions" style="position: absolute; top: 20px; right: 20px; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="margin: 0; font-size: 12px; color: #666;">Match each animal with its sound!</p>
    </div>
  </div>`,

  puzzlePieces: `<div class="puzzle-container" style="width: 600px; height: 500px; background: #f7fafc; border: 2px solid #805ad5; border-radius: 10px; position: relative; font-family: Arial, sans-serif;">
    <h3 style="text-align: center; color: #553c9a; margin: 10px 0;">Complete the Picture Puzzle!</h3>
    
    <!-- Puzzle frame -->
    <div class="puzzle-frame" style="position: absolute; top: 80px; left: 150px; width: 300px; height: 200px; border: 3px solid #805ad5; border-radius: 10px; background: #e6fffa;">
      <div class="puzzle-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; width: 100%; height: 100%;">
        <div class="puzzle-slot" data-piece="1" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="30" r="15" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
            <path d="M10 60 Q40 50, 70 60 L70 80 L10 80 Z" fill="#90EE90" stroke="#228B22" stroke-width="1"/>
          </svg>
        </div>
        <div class="puzzle-slot" data-piece="2" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);"></div>
        <div class="puzzle-slot" data-piece="3" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <rect x="20" y="40" width="40" height="30" fill="#8B4513" stroke="#654321" stroke-width="1"/>
            <polygon points="15,40 40,20 65,40" fill="#DC143C" stroke="#B22222" stroke-width="1"/>
          </svg>
        </div>
        <div class="puzzle-slot" data-piece="4" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);"></div>
        <div class="puzzle-slot" data-piece="5" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <ellipse cx="40" cy="50" rx="25" ry="15" fill="#32CD32" stroke="#228B22" stroke-width="1"/>
            <rect x="38" y="35" width="4" height="15" fill="#8B4513"/>
          </svg>
        </div>
        <div class="puzzle-slot" data-piece="6" style="border: 1px dashed #805ad5; display: flex; align-items: center; justify-content: center; background: rgba(128, 90, 213, 0.1);"></div>
      </div>
    </div>
    
    <!-- Puzzle pieces -->
    <div class="puzzle-pieces" style="position: absolute; bottom: 60px; left: 50px;">
      <div class="piece" draggable="true" data-piece="2" style="width: 60px; height: 60px; background: #87CEEB; border: 2px solid #4682B4; border-radius: 5px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); position: relative;">
        <svg width="56" height="56" viewBox="0 0 56 56" style="position: absolute; top: 2px; left: 2px;">
          <path d="M5 40 Q15 35, 25 40 Q35 45, 45 40 L50 50 L5 50 Z" fill="#87CEEB"/>
          <circle cx="15" cy="20" r="8" fill="white" stroke="#ddd" stroke-width="1"/>
          <circle cx="35" cy="25" r="6" fill="white" stroke="#ddd" stroke-width="1"/>
        </svg>
      </div>
      
      <div class="piece" draggable="true" data-piece="4" style="width: 60px; height: 60px; background: #90EE90; border: 2px solid #228B22; border-radius: 5px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); position: relative;">
        <svg width="56" height="56" viewBox="0 0 56 56" style="position: absolute; top: 2px; left: 2px;">
          <ellipse cx="28" cy="35" rx="20" ry="10" fill="#32CD32"/>
          <ellipse cx="15" cy="30" rx="8" ry="12" fill="#228B22"/>
          <ellipse cx="40" cy="32" rx="6" ry="10" fill="#228B22"/>
        </svg>
      </div>
      
      <div class="piece" draggable="true" data-piece="6" style="width: 60px; height: 60px; background: #DDA0DD; border: 2px solid #9370DB; border-radius: 5px; margin: 10px; display: inline-block; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.2); position: relative;">
        <svg width="56" height="56" viewBox="0 0 56 56" style="position: absolute; top: 2px; left: 2px;">
          <circle cx="20" cy="25" r="8" fill="#FF69B4"/>
          <circle cx="35" cy="30" r="6" fill="#FFB6C1"/>
          <path d="M10 40 L45 40 L40 50 L15 50 Z" fill="#DDA0DD"/>
        </svg>
      </div>
    </div>
    
    <div class="instructions" style="position: absolute; top: 20px; right: 20px; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <p style="margin: 0; font-size: 12px; color: #666;">Drag pieces to complete the picture!</p>
    </div>
  </div>`
};

module.exports = puzzleTemplates;