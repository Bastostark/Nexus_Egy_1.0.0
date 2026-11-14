/* ============================================
   NEXUS EGY — Console Logo SVGs
   Retorna SVG inline para cada console
   ============================================ */

const ConsoleLogo = (() => {
  'use strict';

  const logos = {
    nes: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="72" height="24" rx="3" stroke="currentColor" stroke-width="2"/>
      <rect x="10" y="14" width="18" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="52" y="14" width="18" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <line x1="34" y1="18" x2="46" y2="18" stroke="currentColor" stroke-width="1.5"/>
      <line x1="34" y1="22" x2="46" y2="22" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="57" cy="20" r="2.5" fill="currentColor"/>
      <circle cx="65" cy="20" r="2.5" fill="currentColor"/>
      <rect x="12" y="16" width="6" height="2" rx="0.5" fill="currentColor"/>
      <rect x="17" y="18" width="2" height="6" rx="0.5" fill="currentColor"/>
      <rect x="12" y="22" width="6" height="2" rx="0.5" fill="currentColor"/>
      <rect x="14" y="18" width="2" height="6" rx="0.5" fill="currentColor"/>
    </svg>`,

    snes: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28V12a4 4 0 014-4h56a4 4 0 014 4v16a4 4 0 01-4 4H12a4 4 0 01-4-4z" stroke="currentColor" stroke-width="2"/>
      <rect x="30" y="4" width="20" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="58" cy="18" r="3" fill="currentColor"/>
      <circle cx="64" cy="24" r="3" fill="currentColor"/>
      <circle cx="52" cy="24" r="3" fill="currentColor"/>
      <circle cx="58" cy="30" r="3" fill="currentColor"/>
      <rect x="16" y="18" width="10" height="2" rx="1" fill="currentColor"/>
      <rect x="20" y="14" width="2" height="10" rx="1" fill="currentColor"/>
      <rect x="34" y="20" width="8" height="3" rx="1.5" stroke="currentColor" stroke-width="1"/>
    </svg>`,

    megadrive: `<svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26V12c0-2.2 1.8-4 4-4h64c2.2 0 4 1.8 4 4v14c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4z" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="4" width="24" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="56" cy="20" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="66" cy="20" r="2" fill="currentColor"/>
      <circle cx="62" cy="16" r="2" fill="currentColor"/>
      <rect x="18" y="18" width="10" height="2" rx="1" fill="currentColor"/>
      <rect x="22" y="14" width="2" height="10" rx="1" fill="currentColor"/>
      <line x1="42" y1="14" x2="42" y2="24" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    </svg>`,

    gb: `<svg viewBox="0 0 44 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="60" rx="4" stroke="currentColor" stroke-width="2"/>
      <rect x="8" y="6" width="28" height="24" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="12" y="10" width="20" height="16" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="18" y="38" width="3" height="8" rx="1" fill="currentColor"/>
      <rect x="14" y="41" width="11" height="3" rx="1" fill="currentColor"/>
      <circle cx="32" cy="42" r="3" fill="currentColor"/>
      <circle cx="28" cy="48" r="2" fill="currentColor"/>
      <rect x="14" y="54" width="6" height="2" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="24" y="54" width="6" height="2" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>`,

    gba: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20c0-8.8 7.2-16 16-16h40c8.8 0 16 7.2 16 16v0c0 8.8-7.2 16-16 16H20C11.2 36 4 28.8 4 20z" stroke="currentColor" stroke-width="2"/>
      <rect x="24" y="10" width="32" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="28" y="14" width="24" height="12" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="10" y="16" width="6" height="2" rx="1" fill="currentColor"/>
      <rect x="12" y="13" width="2" height="8" rx="1" fill="currentColor"/>
      <circle cx="66" cy="17" r="2.5" fill="currentColor"/>
      <circle cx="62" cy="23" r="2" fill="currentColor"/>
      <circle cx="70" cy="23" r="2" fill="currentColor"/>
    </svg>`,

    n64: `<svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 6L12 20v18l28 14 28-14V20L40 6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M40 6v32M12 20l28 18M68 20L40 38" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
      <text x="40" y="30" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="10" font-weight="700">N64</text>
    </svg>`,

    ps1: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 6v28M30 6c6 0 12 3 12 8s-6 8-12 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M18 34h38c4 0 6-2 6-4v-2c0-2-2-4-6-4H36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M44 18v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>`,

    nds: `<svg viewBox="0 0 44 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="5" width="32" height="22" rx="1" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <rect x="2" y="34" width="40" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="37" width="32" height="16" rx="1" stroke="currentColor" stroke-width="1" opacity="0.5"/>
      <line x1="2" y1="31" x2="42" y2="31" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="22" cy="58" r="2" fill="currentColor" opacity="0.5"/>
    </svg>`,

    psp: `<svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="76" height="32" rx="8" stroke="currentColor" stroke-width="2"/>
      <rect x="22" y="6" width="36" height="24" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="25" y="9" width="30" height="18" rx="1" fill="currentColor" opacity="0.12"/>
      <circle cx="12" cy="18" r="5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="68" cy="14" r="2" fill="currentColor"/>
      <circle cx="72" cy="18" r="2" fill="currentColor"/>
      <circle cx="68" cy="22" r="2" fill="currentColor"/>
      <circle cx="64" cy="18" r="2" fill="currentColor"/>
    </svg>`,

    dreamcast: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="26" stroke="currentColor" stroke-width="2"/>
      <path d="M30 8a22 22 0 0117.6 35.2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 16a14 14 0 0111.2 22.4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M30 24a6 6 0 014.8 9.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    gamecube: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="48" height="48" rx="8" stroke="currentColor" stroke-width="2"/>
      <rect x="16" y="16" width="28" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="4" width="12" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <text x="30" y="35" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="9" font-weight="700">GC</text>
    </svg>`,

    ps2: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6v28M24 6c7 0 14 3 14 8s-7 8-14 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 34h40c4 0 7-2 7-4v-2c0-2-3-4-7-4H30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <text x="64" y="22" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="14" font-weight="700">2</text>
    </svg>`,

    wii: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="30" y="32" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="20" font-weight="300" letter-spacing="2">Wii</text>
      <circle cx="46" cy="22" r="2" fill="currentColor"/>
      <circle cx="50" cy="22" r="2" fill="currentColor"/>
      <line x1="10" y1="40" x2="50" y2="40" stroke="currentColor" stroke-width="1" opacity="0.3"/>
    </svg>`,

    ps3: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6v28M20 6c7 0 14 3 14 8s-7 8-14 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M10 34h38c4 0 7-2 7-4v-2c0-2-3-4-7-4H26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <text x="64" y="24" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="16" font-weight="700">3</text>
    </svg>`,

    wiiu: `<svg viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
      <rect x="8" y="8" width="32" height="18" rx="2" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <rect x="10" y="10" width="28" height="14" rx="1" fill="currentColor" opacity="0.1"/>
      <text x="24" y="42" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="10" font-weight="300">Wii</text>
      <text x="24" y="50" text-anchor="middle" fill="currentColor" font-family="Outfit,sans-serif" font-size="8" font-weight="700">U</text>
      <circle cx="56" cy="16" r="8" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="56" cy="16" r="3" fill="currentColor" opacity="0.3"/>
    </svg>`,

    switch: `<svg viewBox="0 0 80 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="24" height="40" rx="6" stroke="currentColor" stroke-width="2"/>
      <rect x="54" y="2" width="24" height="40" rx="6" stroke="currentColor" stroke-width="2"/>
      <rect x="24" y="6" width="32" height="32" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="27" y="9" width="26" height="26" rx="1" fill="currentColor" opacity="0.1"/>
      <circle cx="14" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="66" cy="16" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="14" cy="30" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="66" cy="30" r="2" fill="currentColor" opacity="0.4"/>
    </svg>`
  };

  function get(consoleId) {
    return logos[consoleId] || '';
  }

  return { get };
})();

window.ConsoleLogo = ConsoleLogo;
