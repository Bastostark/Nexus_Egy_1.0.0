/* ============================================
   NEXUS EGY — Boot Sequence
   ============================================ */

(function() {
  'use strict';

  const BOOT_DURATION = 5500;
  const bootScreen = document.getElementById('boot-screen');
  const progressBar = document.getElementById('boot-progress');
  const bootText = document.getElementById('boot-text');

  // ---- Boot Particles ----
  const canvas = document.getElementById('boot-particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 42 : 35, // gold tones
    };
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(42, 80%, 55%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.3})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    animFrame = requestAnimationFrame(drawParticles);
  }

  // ---- Boot Messages ----
  const bootMessages = [
    'Inicializando sistema...',
    'Detectando hardware...',
    'Analisando GPU...',
    'Verificando núcleos de CPU...',
    'Carregando núcleos de emulação...',
    'Inicializando motor gráfico...',
    'Preparando interface...',
    'Nexus Egy pronto.'
  ];

  // ---- Hardware Detection (for display during boot) ----
  function getHardwareInfo() {
    const info = [];
    
    // GPU via WebGL
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
          const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
          info.push(`GPU: ${renderer}`);
          info.push(`Vendor: ${vendor}`);
        } else {
          info.push(`GPU: ${gl.getParameter(gl.RENDERER)}`);
        }
      }
    } catch(e) {
      info.push('GPU: Não detectada');
    }

    // CPU Cores
    const cores = navigator.hardwareConcurrency || 'N/A';
    info.push(`CPU Threads: ${cores}`);

    // RAM (estimated via deviceMemory)
    if (navigator.deviceMemory) {
      info.push(`RAM: ~${navigator.deviceMemory} GB`);
    }

    // Screen
    info.push(`Display: ${screen.width}x${screen.height} @${window.devicePixelRatio || 1}x`);

    // Platform
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    info.push(`Plataforma: ${isMobile ? 'Mobile' : 'Desktop'}`);

    // Touch
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    info.push(`Touch: ${hasTouch ? 'Sim' : 'Não'}`);

    return info;
  }

  // ---- Run Boot Sequence ----
  function startBoot() {
    initParticles();
    drawParticles();

    // Animate progress bar and messages
    const startTime = Date.now();
    const msgInterval = BOOT_DURATION / bootMessages.length;

    let msgIndex = 0;
    const msgTimer = setInterval(() => {
      if (msgIndex < bootMessages.length) {
        bootText.textContent = bootMessages[msgIndex];
        msgIndex++;
      } else {
        clearInterval(msgTimer);
      }
    }, msgInterval);

    // Progress bar animation
    function updateProgress() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / BOOT_DURATION) * 100, 100);
      progressBar.style.width = progress + '%';

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        finishBoot();
      }
    }
    requestAnimationFrame(updateProgress);
  }

  function finishBoot() {
    bootText.textContent = 'Nexus Egy pronto.';

    // Play boot chime
    if (window.NexusSound) {
      NexusSound.bootChime();
    }
    
    setTimeout(() => {
      bootScreen.classList.add('fade-out');
      
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        cancelAnimationFrame(animFrame);
        
        // Show app
        const app = document.getElementById('app');
        app.classList.remove('hidden');
        
        // Dispatch custom event so app.js knows boot is done
        window.dispatchEvent(new CustomEvent('nexus-boot-complete'));
      }, 1000);
    }, 500);
  }

  // ---- Event Listeners ----
  window.addEventListener('resize', () => {
    if (!bootScreen.classList.contains('hidden')) {
      resizeCanvas();
    }
  });

  // Start boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBoot);
  } else {
    startBoot();
  }
})();
