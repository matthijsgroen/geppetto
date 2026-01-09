import { setupWebGL, prepareAnimation } from '../src/index';
import sceneryData from './scenery.json';
import sceneryImageUrl from 'url:./scenery.png';

document.addEventListener('DOMContentLoaded', async () => {
  let player;
  let imageDefinition;
  let animationControls;

  async function loadImage() {
    try {
      const data = sceneryData;
      
      const texture = new Image();
      texture.src = sceneryImageUrl;
      await new Promise((resolve, reject) => { 
        texture.onload = resolve;
        texture.onerror = reject;
      });
      
      imageDefinition = prepareAnimation(data);
      console.log('Image loaded:', imageDefinition);
      console.log('Available animations:', Array.from(imageDefinition.animationNames.keys()));
      console.log('Available controls:', Array.from(imageDefinition.controlNames.keys()));
      
      // Setup WebGL
      const canvas = document.getElementById('canvas');
      if (!canvas) {
        throw new Error('Canvas element not found');
      }
      
      player = setupWebGL(canvas);
      
      // Add the animation to the player
      animationControls = player.addAnimation(imageDefinition, texture, 0, {
        zoom: 0.5,
        panX: 0,
        panY: 0,
        zIndex: 0
      });
      
      // Setup UI controls
      setupControls();
      
      // Start render loop
      function render() {
        player.render();
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
      
    } catch (error) {
      console.error('Error loading image:', error);
      const errorDiv = document.getElementById('error');
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Error: ${error.message}`;
      }
    }
  }

  function setupControls() {
    // Animation buttons
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    const animations = Array.from(imageDefinition.animationNames.keys());
    let currentAnimation = null;
    
    if (startBtn && animations.length > 0) {
      startBtn.textContent = `▶ Start ${animations[0]}`;
      startBtn.addEventListener('click', () => {
        if (currentAnimation === null && animations.length > 0) {
          currentAnimation = animations[0];
          animationControls.startAnimation(currentAnimation);
          startBtn.disabled = true;
          stopBtn.disabled = false;
          console.log('Started animation:', currentAnimation);
        }
      });
    }
    
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        if (currentAnimation !== null) {
          animationControls.stopAnimation(currentAnimation);
          startBtn.disabled = false;
          stopBtn.disabled = true;
          currentAnimation = null;
          console.log('Stopped animation');
        }
      });
    }
    
    // Control sliders
    const controlSliders = document.getElementById('controlSliders');
    if (controlSliders) {
      const controls = Array.from(imageDefinition.controlNames.entries()).slice(0, 5);
      
      controls.forEach(([name, index]) => {
        const container = document.createElement('div');
        container.className = 'control-group';
        
        const label = document.createElement('label');
        label.textContent = `${name}:`;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100'; // 0-100 for smooth sliding
        slider.value = '0';
        slider.id = `control-${index}`;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        valueDisplay.textContent = '0.00';
        
        slider.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value) / 100; // Convert to 0-1 range
          valueDisplay.textContent = value.toFixed(2);
          animationControls.setControlValue(name, value);
        });
        
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        controlSliders.appendChild(container);
      });
    }
    
    // Tween controls
    const tweenToDayBtn = document.getElementById('tweenToDayBtn');
    const tweenToNightBtn = document.getElementById('tweenToNightBtn');
    const easingSelect = document.getElementById('easingSelect');
    const durationInput = document.getElementById('durationInput');
    const tweenStatus = document.getElementById('tweenStatus');
    
    if (tweenToDayBtn && tweenToNightBtn) {
      tweenToDayBtn.addEventListener('click', () => {
        const easing = easingSelect.value;
        const duration = parseInt(durationInput.value);
        tweenStatus.textContent = 'Tweening to day...';
        animationControls.tweenControlTo('DayNight', 0, duration, {
          easing,
          onComplete: () => {
            tweenStatus.textContent = '✓ Day tween complete';
            setTimeout(() => tweenStatus.textContent = '', 2000);
          }
        });
      });
      
      tweenToNightBtn.addEventListener('click', () => {
        const easing = easingSelect.value;
        const duration = parseInt(durationInput.value);
        tweenStatus.textContent = 'Tweening to night...';
        animationControls.tweenControlTo('DayNight', 0.5, duration, {
          easing,
          onComplete: () => {
            tweenStatus.textContent = '✓ Night tween complete';
            setTimeout(() => tweenStatus.textContent = '', 2000);
          }
        });
      });
    }
    
    // Zoom control
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    if (zoomSlider && zoomValue) {
      zoomSlider.addEventListener('input', (e) => {
        const zoom = parseFloat(e.target.value);
        zoomValue.textContent = zoom.toFixed(1);
        animationControls.setZoom(zoom);
      });
    }
    
    // Pan controls
    const panXSlider = document.getElementById('panXSlider');
    const panXValue = document.getElementById('panXValue');
    if (panXSlider && panXValue) {
      panXSlider.addEventListener('input', (e) => {
        const panX = parseFloat(e.target.value);
        panXValue.textContent = panX.toFixed(1);
        const panY = parseFloat(document.getElementById('panYSlider')?.value || 0);
        animationControls.setPanning(panX, panY);
      });
    }
    
    const panYSlider = document.getElementById('panYSlider');
    const panYValue = document.getElementById('panYValue');
    if (panYSlider && panYValue) {
      panYSlider.addEventListener('input', (e) => {
        const panY = parseFloat(e.target.value);
        panYValue.textContent = panY.toFixed(1);
        const panX = parseFloat(document.getElementById('panXSlider')?.value || 0);
        animationControls.setPanning(panX, panY);
      });
    }
  }

  // Load the image
  loadImage();
});

