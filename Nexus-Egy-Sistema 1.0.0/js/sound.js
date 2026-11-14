/* ============================================
   NEXUS EGY — Sound System v2 (Estilo PS5)
   Sons aveludados, graves e suaves via Web Audio
   ============================================ */

const NexusSound = (() => {
  'use strict';

  let ctx = null;
  let enabled = true;
  let masterVolume = 0.45;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  // --- Som de Navegação / Hover (Estilo PS5: "Pock" aveludado e suave, sem agudos estridentes) ---
  function hover() {
    if (!enabled) return;
    try {
      const ac = getContext();
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.045);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(1.1, now);

      gain.gain.setValueAtTime(masterVolume * 0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch(e) {}
  }

  // --- Som de Seleção / Confirmar (Estilo PS5: Chime harmônico quente e encorpado) ---
  function select() {
    if (!enabled) return;
    try {
      const ac = getContext();
      const now = ac.currentTime;

      const freqs = [330, 495, 660];
      const gains = [0.35, 0.22, 0.12];

      freqs.forEach((f, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        const filter = ac.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 1.08, now + 0.09);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(masterVolume * gains[idx], now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);

        osc.start(now);
        osc.stop(now + 0.29);
      });
    } catch(e) {}
  }

  // --- Som de Voltar / Cancelar (Descendente aveludado) ---
  function back() {
    if (!enabled) return;
    try {
      const ac = getContext();
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.11);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      gain.gain.setValueAtTime(masterVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch(e) {}
  }

  // --- Troca de Seção / Abas (Whoosh aéreo suave) ---
  function tab() {
    if (!enabled) return;
    try {
      const ac = getContext();
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(1.2, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(masterVolume * 0.2, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch(e) {}
  }

  // --- Som de Inicialização (Boot Chime estilo PS5) ---
  function bootChime() {
    if (!enabled) return;
    try {
      const ac = getContext();
      const now = ac.currentTime;
      const chord = [130.81, 196.00, 261.63, 329.63, 392.00];

      chord.forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        const filter = ac.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, now);

        const delay = idx * 0.05;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(masterVolume * (0.3 / (idx + 1)), now + delay + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.95);
      });
    } catch(e) {}
  }

  function cardFocus() {
    hover();
  }

  function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
  }

  function toggle(state) {
    enabled = typeof state === 'boolean' ? state : !enabled;
    return enabled;
  }

  return { hover, select, back, tab, bootChime, cardFocus, setVolume, toggle };
})();

window.NexusSound = NexusSound;
