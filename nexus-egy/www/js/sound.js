/* ============================================
   NEXUS EGY — Sound System (Web Audio API)
   Sons sintéticos estilo console PS5/Xbox
   ============================================ */

const NexusSound = (() => {
  'use strict';

  let ctx = null;
  let enabled = true;
  let masterVolume = 0.3;

  function getContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  // — Hover / Navigate sound: soft high-pitched tick —
  function hover() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.04);

    gain.gain.setValueAtTime(masterVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // — Select / Confirm sound: two-tone chime —
  function select() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;

    // Tone 1
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    gain1.gain.setValueAtTime(masterVolume * 0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(ac.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Tone 2 (harmonic)
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(masterVolume * 0.25, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ac.destination);
    osc2.start(now);
    osc2.stop(now + 0.18);
  }

  // — Back / Cancel sound: descending tone —
  function back() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);

    gain.gain.setValueAtTime(masterVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // — Boot chime: warm ascending chord —
  function bootChime() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;
    const notes = [440, 554, 659, 880];

    notes.forEach((freq, i) => {
      const delay = i * 0.15;
      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(masterVolume * 0.2, now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.8);
    });
  }

  // — Tab / Section switch: subtle whoosh —
  function tab() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;

    // Noise-like effect with filtered oscillator
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(2, now);

    gain.gain.setValueAtTime(masterVolume * 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // — Card focus: gentle ping —
  function cardFocus() {
    if (!enabled) return;
    const ac = getContext();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.05);

    gain.gain.setValueAtTime(masterVolume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // — Set volume —
  function setVolume(v) {
    masterVolume = Math.max(0, Math.min(1, v));
  }

  // — Toggle on/off —
  function toggle(state) {
    enabled = typeof state === 'boolean' ? state : !enabled;
    return enabled;
  }

  return { hover, select, back, bootChime, tab, cardFocus, setVolume, toggle };
})();

// Make global
window.NexusSound = NexusSound;
