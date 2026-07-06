(function() {
  if (document.getElementById('ap-visual-tuner')) return;

  const tuner = document.createElement('div');
  tuner.id = 'ap-visual-tuner';
  tuner.style.position = 'fixed';
  tuner.style.top = '10px';
  tuner.style.right = '10px';
  tuner.style.width = '240px';
  tuner.style.maxHeight = '95vh';
  tuner.style.overflowY = 'auto';
  tuner.style.background = 'rgba(10, 10, 20, 0.95)';
  tuner.style.border = '1px solid #745bff';
  tuner.style.borderRadius = '6px';
  tuner.style.padding = '10px';
  tuner.style.color = '#fff';
  tuner.style.fontFamily = 'monospace';
  tuner.style.zIndex = '999999';
  tuner.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';

  tuner.innerHTML = `
    <div style="cursor: move; padding-bottom: 5px; margin-bottom: 10px; border-bottom: 1px solid #333;">
      <h3 style="margin: 0; color: #c8ff00 !important; font-size: 14px !important; text-align: center; pointer-events: none;">UI Tuner</h3>
      <p style="margin: 2px 0 0 0; font-size: 9px !important; text-align: center; color: #aaa !important; pointer-events: none;">Drag me!</p>
    </div>

    <button id="vt-inspect" style="width:100%; padding: 6px; background: #ff0055; color: #fff !important; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; margin-bottom: 5px; font-size:11px !important;">🎯 Select Element</button>
    <div style="display:flex; justify-content:space-between; margin-bottom: 10px; align-items:center;">
      <div id="vt-target-name" style="font-size: 10px !important; color: #c8ff00 !important; word-break: break-all; max-width: 75%;">Target: None</div>
      <button id="vt-reset" style="font-size: 9px !important; padding: 2px 5px; background: #555; color: #fff !important; border: none; border-radius: 3px; cursor: pointer;">Reset</button>
    </div>
    
    <div style="margin-bottom: 8px;">
      <label style="display:block; font-size:11px !important; margin-bottom: 2px; color: #fff !important; font-weight: bold;">Text Override</label>
      <input type="text" id="vt-text" placeholder="Freeze text..." style="width:100%; padding:2px; font-size:11px !important; background:#222; color:#fff !important; border:1px solid #555; border-radius:3px;">
    </div>

    <div style="margin-bottom: 8px;">
      <label style="display:block; font-size:11px !important; margin-bottom: 2px; color: #fff !important; font-weight: bold;">Font Size (<span id="vt-size-val" style="color:#c8ff00 !important;">70px</span>)</label>
      <input type="range" id="vt-size" min="10" max="150" value="70" style="width:100%; height: 10px;">
    </div>

    <div style="margin-bottom: 8px;">
      <label style="display:block; font-size:11px !important; margin-bottom: 2px; color: #fff !important; font-weight: bold;">Letter Spacing (<span id="vt-spacing-val" style="color:#c8ff00 !important;">0px</span>)</label>
      <input type="range" id="vt-spacing" min="-10" max="50" value="0" style="width:100%; height: 10px;">
    </div>

    <div style="margin-bottom: 8px;">
      <label style="display:block; font-size:11px !important; margin-bottom: 2px; color: #fff !important; font-weight: bold;">Move X (<span id="vt-x-val" style="color:#c8ff00 !important;">0px</span>)</label>
      <input type="range" id="vt-x" min="-400" max="400" value="0" style="width:100%; height: 10px;">
      <div style="display:flex; justify-content:space-between; font-size:10px !important; margin-top:2px;">
        <button id="vt-x-minus" style="padding:1px 4px; cursor:pointer; background:#c8ff00; border:none; color:#000 !important; font-weight:bold;">-1px</button>
        <button id="vt-x-plus" style="padding:1px 4px; cursor:pointer; background:#c8ff00; border:none; color:#000 !important; font-weight:bold;">+1px</button>
      </div>
    </div>

    <div style="margin-bottom: 8px;">
      <label style="display:block; font-size:11px !important; margin-bottom: 2px; color: #fff !important; font-weight: bold;">Move Y (<span id="vt-y-val" style="color:#c8ff00 !important;">0px</span>)</label>
      <input type="range" id="vt-y" min="-200" max="200" value="0" style="width:100%; height: 10px;">
      <div style="display:flex; justify-content:space-between; font-size:10px !important; margin-top:2px;">
        <button id="vt-y-minus" style="padding:1px 4px; cursor:pointer; background:#c8ff00; border:none; color:#000 !important; font-weight:bold;">-1px</button>
        <button id="vt-y-plus" style="padding:1px 4px; cursor:pointer; background:#c8ff00; border:none; color:#000 !important; font-weight:bold;">+1px</button>
      </div>
    </div>

    <button id="vt-copy" style="width:100%; padding: 6px; background: #c8ff00; color: #000 !important; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; margin-top: 5px; font-size: 12px !important;">Copy Values</button>
  `;

  document.body.appendChild(tuner);

  let isInspecting = false;
  let hoveredElement = null;
  let activeTargetId = null;

  // Dictionary to store state for ALL tuned elements
  let tunedElements = {};

  let styleEl = document.createElement('style');
  styleEl.id = 'vt-injected-styles';
  document.head.appendChild(styleEl);

  function update() {
    if (activeTargetId && tunedElements[activeTargetId]) {
      const elState = tunedElements[activeTargetId];
      elState.x = parseInt(document.getElementById('vt-x').value);
      elState.y = parseInt(document.getElementById('vt-y').value);
      elState.size = parseInt(document.getElementById('vt-size').value);
      elState.spacing = parseInt(document.getElementById('vt-spacing').value);
      
      document.getElementById('vt-x-val').innerText = elState.x + 'px';
      document.getElementById('vt-y-val').innerText = elState.y + 'px';
      document.getElementById('vt-size-val').innerText = elState.size + 'px';
      document.getElementById('vt-spacing-val').innerText = elState.spacing + 'px';
    }
    
    // Regenerate CSS for ALL elements
    let fullCss = '';
    for (const id in tunedElements) {
      const s = tunedElements[id];
      const displayRule = s.forceInlineBlock ? 'display: inline-block !important;' : '';
      fullCss += `
        [data-ap-tuner-id="${id}"] {
          transform: translate(${s.x}px, ${s.y}px) !important;
          font-size: ${s.size}px !important;
          letter-spacing: ${s.spacing}px !important;
          ${displayRule}
        }
      `;
    }
    styleEl.innerHTML = fullCss;
  }

  function startInspect() {
    isInspecting = true;
    document.getElementById('vt-inspect').style.background = '#00ffcc';
    document.getElementById('vt-inspect').style.color = '#000 !important';
    document.getElementById('vt-inspect').innerText = 'Hover & Click an Element';
  }

  function stopInspect() {
    isInspecting = false;
    document.getElementById('vt-inspect').style.background = '#ff0055';
    document.getElementById('vt-inspect').style.color = '#fff !important';
    document.getElementById('vt-inspect').innerText = '🎯 Select Element';
    if (hoveredElement) hoveredElement.style.outline = '';
  }

  document.addEventListener('mousemove', (e) => {
    if (!isInspecting) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el.closest('#ap-visual-tuner')) return;
    
    if (hoveredElement && hoveredElement !== el) {
      hoveredElement.style.outline = '';
    }
    hoveredElement = el;
    hoveredElement.style.outline = '2px solid #ff0055';
    e.stopPropagation();
  }, true);

  document.addEventListener('click', (e) => {
    if (!isInspecting) return;
    if (e.target.closest('#ap-visual-tuner')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const target = hoveredElement;
    stopInspect();
    
    if (target) {
      if (!target.getAttribute('data-ap-tuner-id')) {
        target.setAttribute('data-ap-tuner-id', 'tuner-' + Math.random().toString(36).substr(2, 9));
      }
      
      activeTargetId = target.getAttribute('data-ap-tuner-id');
      
      let humanName = target.tagName.toLowerCase();
      if (target.id) humanName += '#' + target.id;
      else if (target.className && typeof target.className === 'string') {
        humanName += '.' + target.className.trim().split(/\s+/)[0];
      }
      
      document.getElementById('vt-target-name').innerText = 'Target: ' + humanName;
      target.style.outline = '2px dashed #c8ff00';
      
      // Initialize state if first time
      if (!tunedElements[activeTargetId]) {
        const comp = window.getComputedStyle(target);
        tunedElements[activeTargetId] = {
          humanName: humanName,
          targetNode: target,
          initialSize: parseInt(comp.fontSize) || 16,
          initialSpacing: parseInt(comp.letterSpacing) || 0,
          forceInlineBlock: (comp.display === 'inline'),
          size: parseInt(comp.fontSize) || 16,
          spacing: parseInt(comp.letterSpacing) || 0,
          x: 0,
          y: 0
        };
      }
      
      const s = tunedElements[activeTargetId];
      document.getElementById('vt-size').value = s.size;
      document.getElementById('vt-spacing').value = s.spacing;
      document.getElementById('vt-x').value = s.x;
      document.getElementById('vt-y').value = s.y;
      
      update();
    }
  }, true);

  document.getElementById('vt-inspect').addEventListener('click', () => {
    if (isInspecting) stopInspect();
    else startInspect();
  });
  
  document.getElementById('vt-reset').addEventListener('click', () => {
    if (!activeTargetId || !tunedElements[activeTargetId]) return;
    const s = tunedElements[activeTargetId];
    s.x = 0; s.y = 0;
    s.size = s.initialSize; s.spacing = s.initialSpacing;
    document.getElementById('vt-x').value = s.x;
    document.getElementById('vt-y').value = s.y;
    document.getElementById('vt-size').value = s.size;
    document.getElementById('vt-spacing').value = s.spacing;
    update();
  });

  document.getElementById('vt-text').addEventListener('input', (e) => { 
    if (activeTargetId && tunedElements[activeTargetId]) {
      tunedElements[activeTargetId].targetNode.innerText = e.target.value;
    }
  });

  document.getElementById('vt-size').addEventListener('input', () => update());
  document.getElementById('vt-spacing').addEventListener('input', () => update());
  document.getElementById('vt-x').addEventListener('input', () => update());
  document.getElementById('vt-y').addEventListener('input', () => update());
  
  document.getElementById('vt-x-minus').addEventListener('click', () => { 
    document.getElementById('vt-x').value = parseInt(document.getElementById('vt-x').value) - 1; update(); 
  });
  document.getElementById('vt-x-plus').addEventListener('click', () => { 
    document.getElementById('vt-x').value = parseInt(document.getElementById('vt-x').value) + 1; update(); 
  });
  document.getElementById('vt-y-minus').addEventListener('click', () => { 
    document.getElementById('vt-y').value = parseInt(document.getElementById('vt-y').value) - 1; update(); 
  });
  document.getElementById('vt-y-plus').addEventListener('click', () => { 
    document.getElementById('vt-y').value = parseInt(document.getElementById('vt-y').value) + 1; update(); 
  });

  document.getElementById('vt-copy').addEventListener('click', () => {
    if (Object.keys(tunedElements).length === 0) return;
    
    let code = `/* --- UI Tuner Export --- */\n`;
    for (const id in tunedElements) {
      const s = tunedElements[id];
      // Only export if values changed from initial
      if (s.x === 0 && s.y === 0 && s.size === s.initialSize && s.spacing === s.initialSpacing) continue;
      
      code += `\n/* Tuned: ${s.humanName} */\n`;
      code += `[data-ap-tuner-id="${id}"] {\n`;
      if (s.x !== 0 || s.y !== 0) code += `  transform: translate(${s.x}px, ${s.y}px) !important;\n`;
      if (s.size !== s.initialSize) code += `  font-size: ${s.size}px !important;\n`;
      if (s.spacing !== s.initialSpacing) code += `  letter-spacing: ${s.spacing}px !important;\n`;
      code += `}\n`;
    }
    
    navigator.clipboard.writeText(code);
    const btn = document.getElementById('vt-copy');
    btn.innerText = 'Copied All!';
    setTimeout(() => { btn.innerText = 'Copy Values'; }, 2000);
  });

  // Draggable logic
  let isDragging = false;
  let offsetX, offsetY;
  tuner.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    isDragging = true;
    offsetX = e.clientX - tuner.getBoundingClientRect().left;
    offsetY = e.clientY - tuner.getBoundingClientRect().top;
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    tuner.style.left = (e.clientX - offsetX) + 'px';
    tuner.style.top = (e.clientY - offsetY) + 'px';
    tuner.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => { isDragging = false; });
})();
