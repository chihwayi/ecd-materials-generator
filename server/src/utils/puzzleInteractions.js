// Interactive puzzle functionality for drag-and-drop activities

const puzzleInteractions = `
<script>
// Puzzle interaction system
class PuzzleGame {
  constructor() {
    this.score = 0;
    this.totalItems = 0;
    this.completedItems = 0;
    this.init();
  }

  init() {
    this.setupDragAndDrop();
    this.setupEventListeners();
    this.countTotalItems();
  }

  countTotalItems() {
    this.totalItems = document.querySelectorAll('[draggable="true"]').length;
  }

  setupDragAndDrop() {
    // Make items draggable
    const draggableItems = document.querySelectorAll('[draggable="true"]');
    draggableItems.forEach(item => {
      item.addEventListener('dragstart', this.handleDragStart.bind(this));
      item.addEventListener('dragend', this.handleDragEnd.bind(this));
    });

    // Setup drop zones
    const dropZones = document.querySelectorAll('.slot, .sound-slot, .color-slot, .number-slot, .puzzle-slot');
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', this.handleDragOver.bind(this));
      zone.addEventListener('drop', this.handleDrop.bind(this));
      zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
      zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
    });
  }

  setupEventListeners() {
    // Touch support for mobile devices
    const draggableItems = document.querySelectorAll('[draggable="true"]');
    draggableItems.forEach(item => {
      item.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      item.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      item.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    });
  }

  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.shape || e.target.dataset.color || e.target.dataset.number || e.target.dataset.animal || e.target.dataset.piece);
    e.target.style.opacity = '0.5';
    e.target.classList.add('dragging');
  }

  handleDragEnd(e) {
    e.target.style.opacity = '1';
    e.target.classList.remove('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
    e.target.style.backgroundColor = 'rgba(72, 187, 120, 0.2)';
  }

  handleDragLeave(e) {
    e.target.classList.remove('drag-over');
    e.target.style.backgroundColor = '';
  }

  handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    e.target.style.backgroundColor = '';

    const draggedData = e.dataTransfer.getData('text/plain');
    const targetData = e.target.dataset.shape || e.target.dataset.color || e.target.dataset.number || e.target.dataset.animal || e.target.dataset.piece;

    if (draggedData === targetData) {
      this.handleCorrectMatch(e, draggedData);
    } else {
      this.handleIncorrectMatch(e);
    }
  }

  handleCorrectMatch(e, data) {
    const draggedElement = document.querySelector(\`[draggable="true"][data-shape="\${data}"], [draggable="true"][data-color="\${data}"], [draggable="true"][data-number="\${data}"], [draggable="true"][data-animal="\${data}"], [draggable="true"][data-piece="\${data}"]\`);
    
    if (draggedElement) {
      // Success animation
      e.target.style.backgroundColor = '#48bb78';
      e.target.style.border = '3px solid #38a169';
      
      // Move the dragged element to the drop zone
      const rect = e.target.getBoundingClientRect();
      const containerRect = e.target.closest('.puzzle-container').getBoundingClientRect();
      
      draggedElement.style.position = 'absolute';
      draggedElement.style.left = (rect.left - containerRect.left + 10) + 'px';
      draggedElement.style.top = (rect.top - containerRect.top + 10) + 'px';
      draggedElement.style.pointerEvents = 'none';
      draggedElement.draggable = false;

      // Success feedback
      this.showFeedback('Correct! Well done! 🎉', 'success');
      this.completedItems++;
      this.score += 10;

      // Check if puzzle is complete
      if (this.completedItems === this.totalItems) {
        setTimeout(() => {
          this.showFeedback('Puzzle Complete! Amazing work! 🌟', 'complete');
        }, 1000);
      }
    }
  }

  handleIncorrectMatch(e) {
    // Error animation
    e.target.style.backgroundColor = '#fed7d7';
    e.target.style.border = '3px solid #e53e3e';
    
    setTimeout(() => {
      e.target.style.backgroundColor = '';
      e.target.style.border = '';
    }, 1000);

    this.showFeedback('Try again! You can do it! 💪', 'error');
  }

  showFeedback(message, type) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.puzzle-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'puzzle-feedback';
    feedback.textContent = message;
    
    const colors = {
      success: { bg: '#c6f6d5', border: '#38a169', color: '#22543d' },
      error: { bg: '#fed7d7', border: '#e53e3e', color: '#742a2a' },
      complete: { bg: '#fef5e7', border: '#ed8936', color: '#7b341e' }
    };

    const color = colors[type] || colors.success;
    
    feedback.style.cssText = \`
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      background: \${color.bg};
      border: 2px solid \${color.border};
      color: \${color.color};
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 16px;
      z-index: 1000;
      animation: feedbackSlide 0.3s ease-out;
    \`;

    document.querySelector('.puzzle-container').appendChild(feedback);

    // Remove feedback after 2 seconds
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 2000);
  }

  // Touch support methods
  handleTouchStart(e) {
    e.preventDefault();
    this.touchItem = e.target;
    this.touchItem.style.opacity = '0.5';
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (!this.touchItem) return;

    const touch = e.touches[0];
    this.touchItem.style.position = 'absolute';
    this.touchItem.style.left = (touch.clientX - 30) + 'px';
    this.touchItem.style.top = (touch.clientY - 30) + 'px';
    this.touchItem.style.zIndex = '1000';
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (!this.touchItem) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dropTarget && (dropTarget.classList.contains('slot') || 
                      dropTarget.classList.contains('sound-slot') || 
                      dropTarget.classList.contains('color-slot') || 
                      dropTarget.classList.contains('number-slot') || 
                      dropTarget.classList.contains('puzzle-slot'))) {
      
      const draggedData = this.touchItem.dataset.shape || this.touchItem.dataset.color || this.touchItem.dataset.number || this.touchItem.dataset.animal || this.touchItem.dataset.piece;
      const targetData = dropTarget.dataset.shape || dropTarget.dataset.color || dropTarget.dataset.number || dropTarget.dataset.animal || dropTarget.dataset.piece;

      if (draggedData === targetData) {
        this.handleCorrectMatch({ target: dropTarget }, draggedData);
      } else {
        this.handleIncorrectMatch({ target: dropTarget });
        // Reset position
        this.touchItem.style.position = '';
        this.touchItem.style.left = '';
        this.touchItem.style.top = '';
        this.touchItem.style.zIndex = '';
      }
    } else {
      // Reset position if not dropped on valid target
      this.touchItem.style.position = '';
      this.touchItem.style.left = '';
      this.touchItem.style.top = '';
      this.touchItem.style.zIndex = '';
    }

    this.touchItem.style.opacity = '1';
    this.touchItem = null;
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = \`
  @keyframes feedbackSlide {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .dragging {
    transform: rotate(5deg);
    transition: transform 0.2s ease;
  }

  .drag-over {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }

  [draggable="true"]:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }

  .puzzle-container * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
\`;
document.head.appendChild(style);

// Initialize puzzle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new PuzzleGame();
});
</script>
`;