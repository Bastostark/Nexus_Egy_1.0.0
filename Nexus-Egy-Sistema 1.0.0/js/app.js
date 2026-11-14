/* ============================================
   NEXUS EGY — Main Application v3
   - Sons PS5 Graves & Aveludados
   - Cores Customizáveis Funcionais
   - Edição de Perfil (Nome & Avatar com upload)
   - Sistema de Idiomas Funcional (PT-BR, EN-US, ES-ES)
   - Consoles 3D com Relevo & Filtro de Jogos ao Clicar
   ============================================ */

const NexusEgy = (() => {
  'use strict';

  // ====== CONSOLE DATABASE COM IMAGENS 3D DE RELEVO ======
  const CONSOLES_DB = [
    { id: 'nes', name: 'NES / Famicom', icon: '🎮', era: '8-bit', year: '1983', formats: ['.nes'], tier: 1,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/NES-Console-Set.png/480px-NES-Console-Set.png' },
    { id: 'snes', name: 'Super Nintendo', icon: '🕹️', era: '16-bit', year: '1990', formats: ['.sfc', '.smc'], tier: 1,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/SNES-Mod1-Console-Set.png/480px-SNES-Mod1-Console-Set.png' },
    { id: 'megadrive', name: 'Mega Drive / Genesis', icon: '🎵', era: '16-bit', year: '1988', formats: ['.md', '.bin'], tier: 1,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sega-Genesis-Mod2-Bare.png/480px-Sega-Genesis-Mod2-Bare.png' },
    { id: 'gb', name: 'Game Boy / GBC', icon: '🟢', era: '8-bit Portátil', year: '1989', formats: ['.gb', '.gbc'], tier: 1,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Game-Boy-FL.png/480px-Game-Boy-FL.png' },
    { id: 'gba', name: 'Game Boy Advance', icon: '💜', era: '32-bit Portátil', year: '2001', formats: ['.gba'], tier: 1,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nintendo-Game-Boy-Advance-Purple-FL.png/480px-Nintendo-Game-Boy-Advance-Purple-FL.png' },
    { id: 'n64', name: 'Nintendo 64', icon: '🏔️', era: '64-bit', year: '1996', formats: ['.z64', '.n64', '.v64'], tier: 2,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/N64-Console-Set.png/480px-N64-Console-Set.png' },
    { id: 'ps1', name: 'PlayStation 1', icon: '💿', era: '32-bit', year: '1994', formats: ['.bin/.cue', '.iso', '.chd'], tier: 2,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/PSX-Console-wController.png/480px-PSX-Console-wController.png' },
    { id: 'nds', name: 'Nintendo DS', icon: '📱', era: 'Dual Screen', year: '2004', formats: ['.nds'], tier: 2,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nintendo-DS-Lite-Black-Open.png/480px-Nintendo-DS-Lite-Black-Open.png' },
    { id: 'psp', name: 'PlayStation Portable', icon: '🔷', era: 'Portátil HD', year: '2004', formats: ['.iso', '.cso'], tier: 2,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Sony-PSP-1000-Body.png/480px-Sony-PSP-1000-Body.png' },
    { id: 'dreamcast', name: 'Dreamcast', icon: '🌀', era: '128-bit', year: '1998', formats: ['.gdi', '.cdi'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Dreamcast-Console-Set.png/480px-Dreamcast-Console-Set.png' },
    { id: 'gamecube', name: 'GameCube', icon: '🟪', era: '128-bit', year: '2001', formats: ['.iso', '.gcz', '.rvz'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/GameCube-Console-Set.png/480px-GameCube-Console-Set.png' },
    { id: 'ps2', name: 'PlayStation 2', icon: '🎮', era: '128-bit', year: '2000', formats: ['.iso', '.chd'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PS2-Versions.png/480px-PS2-Versions.png' },
    { id: 'wii', name: 'Nintendo Wii', icon: '🕹️', era: '7ª Geração', year: '2006', formats: ['.iso', '.wbfs', '.rvz'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Wii-Console.png/480px-Wii-Console.png' },
    { id: 'ps3', name: 'PlayStation 3', icon: '🎮', era: '7ª Geração HD', year: '2006', formats: ['.iso', '.pkg'], tier: 4,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sony-PlayStation-3-2001A-wController-L.png/480px-Sony-PlayStation-3-2001A-wController-L.png' },
    { id: 'wiiu', name: 'Wii U', icon: '📺', era: '8ª Geração', year: '2012', formats: ['.wux', '.wud'], tier: 4,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Wii_U_Console_and_Gamepad.png/480px-Wii_U_Console_and_Gamepad.png' },
    { id: 'switch', name: 'Nintendo Switch', icon: '🔴', era: '9ª Geração', year: '2017', formats: ['.nsp', '.xci'], tier: 4,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nintendo-Switch-wJoyCons-BlRd-Standing-FL.png/480px-Nintendo-Switch-wJoyCons-BlRd-Standing-FL.png' },
  ];

  // ====== BANCO DE JOGOS COM CAPAS OFICIAIS ======
  const GAMES_DB = [
    // NES
    { id: 'smb', title: 'Super Mario Bros.', console: 'NES', year: '1985', genre: 'Plataforma', format: '.nes', color: '#e74c3c',
      cover: 'https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png',
      desc: 'O clássico que revolucionou os videogames. Ajude Mario a salvar a Princesa Peach do terrível Bowser em 8 mundos repletos de desafios.' },
    { id: 'zelda', title: 'The Legend of Zelda', console: 'NES', year: '1986', genre: 'Aventura / RPG', format: '.nes', color: '#27ae60',
      cover: 'https://upload.wikimedia.org/wikipedia/en/4/41/Legend_of_zelda_cover_%28with_samples%29_gold.png',
      desc: 'Explore a terra de Hyrule como Link em busca dos fragmentos da Triforce. O início de uma das maiores franquias da história.' },
    { id: 'megaman2', title: 'Mega Man 2', console: 'NES', year: '1988', genre: 'Ação / Plataforma', format: '.nes', color: '#3498db',
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/11/Mega_Man_2_%28NA%29.jpg',
      desc: 'Enfrente os Robot Masters e derrote o Dr. Wily nesta aventura de ação side-scrolling que definiu um gênero.' },
    { id: 'contra', title: 'Contra', console: 'NES', year: '1988', genre: 'Ação / Run and Gun', format: '.nes', color: '#e67e22',
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/16/Contra_cover.jpg',
      desc: 'Ação intensa cooperativa para dois jogadores. O famoso código Konami nasceu aqui.' },
    // SNES
    { id: 'smw', title: 'Super Mario World', console: 'SNES', year: '1990', genre: 'Plataforma', format: '.sfc', color: '#2ecc71',
      cover: 'https://upload.wikimedia.org/wikipedia/en/3/32/Super_Mario_World_Coverart.png',
      desc: 'A obra-prima da era 16-bit. Mario e Yoshi embarcam na maior aventura de Dinosaur Land.' },
    { id: 'lttp', title: 'Zelda: A Link to the Past', console: 'SNES', year: '1991', genre: 'Aventura / RPG', format: '.sfc', color: '#8e44ad',
      cover: 'https://upload.wikimedia.org/wikipedia/en/2/21/The_Legend_of_Zelda_A_Link_to_the_Past_SNES_Game_Cover.jpg',
      desc: 'Uma das melhores entradas da série Zelda. Explore dois mundos paralelos e derrote Ganon.' },
    { id: 'ct', title: 'Chrono Trigger', console: 'SNES', year: '1995', genre: 'RPG', format: '.sfc', color: '#f39c12',
      cover: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Chrono_Trigger.jpg',
      desc: 'Viaje no tempo para salvar o futuro neste RPG lendário criado pelos mestres da Square e Enix.' },
    { id: 'smk', title: 'Super Mario Kart', console: 'SNES', year: '1992', genre: 'Corrida', format: '.sfc', color: '#e74c3c',
      cover: 'https://upload.wikimedia.org/wikipedia/en/3/38/Super_Mario_Kart_Box_Art.png',
      desc: 'O jogo de corrida que criou um gênero. Mode 7 puro e diversão multiplayer inesquecível.' },
    { id: 'dkc', title: 'Donkey Kong Country', console: 'SNES', year: '1994', genre: 'Plataforma', format: '.sfc', color: '#795548',
      cover: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Donkey_Kong_Country_SNES_cover.png',
      desc: 'Gráficos pré-renderizados revolucionários e gameplay impecável. DK e Diddy contra os Kremlings.' },
    // Mega Drive
    { id: 'sonic', title: 'Sonic the Hedgehog', console: 'Mega Drive', year: '1991', genre: 'Plataforma', format: '.md', color: '#2196F3',
      cover: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis.png',
      desc: 'Velocidade pura! O mascote da SEGA corre através de Green Hill Zone e além para deter Dr. Robotnik.' },
    { id: 'streets2', title: 'Streets of Rage 2', console: 'Mega Drive', year: '1992', genre: 'Beat \'em Up', format: '.md', color: '#FF5722',
      cover: 'https://upload.wikimedia.org/wikipedia/en/a/ab/Streets_of_Rage_2_cover.jpg',
      desc: 'O melhor beat \'em up de todos os tempos. Axel, Blaze e novos aliados limpam as ruas do crime.' },
    // Game Boy
    { id: 'pokemon-rb', title: 'Pokémon Red / Blue', console: 'Game Boy', year: '1996', genre: 'RPG', format: '.gb', color: '#f44336',
      cover: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Pok%C3%A9mon_box_art_-_Red_Version.png',
      desc: 'Comece sua jornada como treinador Pokémon em Kanto. Capture todos os 151 e torne-se o campeão!' },
    { id: 'tetris-gb', title: 'Tetris', console: 'Game Boy', year: '1989', genre: 'Puzzle', format: '.gb', color: '#607D8B',
      cover: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Tetris_Boxshot.jpg',
      desc: 'O jogo que vendeu o Game Boy. Simples, viciante e eterno.' },
    // GBA
    { id: 'pokemon-em', title: 'Pokémon Emerald', console: 'GBA', year: '2004', genre: 'RPG', format: '.gba', color: '#4CAF50',
      cover: 'https://upload.wikimedia.org/wikipedia/en/f/f7/PokemonEmeraldBox.jpg',
      desc: 'A versão definitiva da terceira geração Pokémon em Hoenn. Battle Frontier desafiará até veteranos.' },
    { id: 'metroid-f', title: 'Metroid Fusion', console: 'GBA', year: '2002', genre: 'Ação / Aventura', format: '.gba', color: '#00BCD4',
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/16/Metroid_Fusion_box_art.jpg',
      desc: 'Samus enfrenta o parasita X nesta aventura intensa e atmosférica no GBA.' },
    { id: 'ff6-gba', title: 'Final Fantasy VI Advance', console: 'GBA', year: '2006', genre: 'RPG', format: '.gba', color: '#9C27B0',
      cover: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Final_Fantasy_VI.jpg',
      desc: 'O RPG épico remasterizado para GBA. Uma história grandiosa com o icônico vilão Kefka.' },
    // PS1
    { id: 'ff7', title: 'Final Fantasy VII', console: 'PS1', year: '1997', genre: 'RPG', format: '.bin/.cue', color: '#1a237e',
      cover: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      desc: 'Cloud Strife e AVALANCHE contra a megacorporação Shinra. O RPG que mudou tudo.' },
    { id: 'mgs', title: 'Metal Gear Solid', console: 'PS1', year: '1998', genre: 'Stealth / Ação', format: '.bin/.cue', color: '#37474f',
      cover: 'https://upload.wikimedia.org/wikipedia/en/3/33/Metal_Gear_Solid_cover_art.png',
      desc: 'Infiltre-se em Shadow Moses como Solid Snake. Stealth action que redefiniu narrativas em jogos.' },
    { id: 'crash', title: 'Crash Bandicoot', console: 'PS1', year: '1996', genre: 'Plataforma', format: '.bin/.cue', color: '#FF9800',
      cover: 'https://upload.wikimedia.org/wikipedia/en/2/22/Crash_Bandicoot_Cover.png',
      desc: 'O marsupial mais louco dos videogames! Plataforma 3D com carisma e desafio na medida certa.' },
    // N64
    { id: 'sm64', title: 'Super Mario 64', console: 'N64', year: '1996', genre: 'Plataforma 3D', format: '.z64', color: '#f44336',
      cover: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg',
      desc: 'O jogo que inventou o 3D nos plataformas. 120 estrelas esperam por você no Castelo da Peach.' },
    { id: 'oot', title: 'Zelda: Ocarina of Time', console: 'N64', year: '1998', genre: 'Aventura / RPG', format: '.z64', color: '#4CAF50',
      cover: 'https://upload.wikimedia.org/wikipedia/en/5/57/The_Legend_of_Zelda_Ocarina_of_Time.jpg',
      desc: 'Considerado por muitos o melhor jogo de todos os tempos. A jornada de Link através do tempo.' },
    // NDS
    { id: 'pokemon-hgss', title: 'Pokémon HeartGold / SoulSilver', console: 'NDS', year: '2009', genre: 'RPG', format: '.nds', color: '#FFC107',
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/1e/Pok%C3%A9monHGSS.png',
      desc: 'O remake perfeito de Gold e Silver. Duas regiões, 16 ginásios e seu Pokémon te segue!' },
    { id: 'mkds', title: 'Mario Kart DS', console: 'NDS', year: '2005', genre: 'Corrida', format: '.nds', color: '#f44336',
      cover: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Mario_Kart_DS_cover.jpg',
      desc: 'Corridas frenéticas com o melhor modo online do DS. Pistas clássicas e novas se encontram.' },
    // PSP
    { id: 'gta-lcs', title: 'GTA: Liberty City Stories', console: 'PSP', year: '2005', genre: 'Ação / Sandbox', format: '.iso/.cso', color: '#FF5722',
      cover: 'https://upload.wikimedia.org/wikipedia/en/c/cc/GTALibertyCityStories.jpg',
      desc: 'A liberdade de GTA no portátil. Explore Liberty City com Toni Cipriani.' },
    { id: 'god-of-war-psp', title: 'God of War: Chains of Olympus', console: 'PSP', year: '2008', genre: 'Ação / Aventura', format: '.iso/.cso', color: '#b71c1c',
      cover: 'https://upload.wikimedia.org/wikipedia/en/b/be/God_of_War_Chains_of_Olympus_cover.jpg',
      desc: 'Kratos em ação brutal no PSP. Qualidade de console de mesa no portátil.' },
    // PS2
    { id: 'gta-sa', title: 'GTA: San Andreas', console: 'PS2', year: '2004', genre: 'Ação / Sandbox', format: '.iso', color: '#FF9800',
      cover: 'https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_San_Andreas_Box_Art.jpg',
      desc: 'CJ retorna a Los Santos na maior aventura sandbox da era PS2. O mapa mais ambicioso de GTA.' },
    { id: 'gow2', title: 'God of War II', console: 'PS2', year: '2007', genre: 'Ação / Aventura', format: '.iso', color: '#c62828',
      cover: 'https://upload.wikimedia.org/wikipedia/en/8/80/God_of_War_II_cover.jpg',
      desc: 'A fúria de Kratos contra os deuses do Olimpo. Ação cinematográfica épica no PS2.' },
    { id: 'sotc', title: 'Shadow of the Colossus', console: 'PS2', year: '2005', genre: 'Aventura', format: '.iso', color: '#78909C',
      cover: 'https://upload.wikimedia.org/wikipedia/en/8/82/Shadow_of_the_Colossus_%282005%29_cover.jpg',
      desc: 'Derrote 16 colossos gigantescos para salvar uma garota. Uma obra de arte interativa.' },
  ];

  // ====== ACERVO LINKS ======
  const ACERVO_DB = [
    { title: 'Internet Archive - Retro ROMs', icon: '📚', format: 'Multi-formato', desc: 'O maior acervo público de preservação digital. ROMs de NES, SNES, Mega Drive, GBA e mais.', url: 'https://archive.org/details/softwarelibrary_msdos_games' },
    { title: 'Vimm\'s Lair', icon: '🏛️', format: '.nes .sfc .z64 .gba .nds', desc: 'Acervo clássico mantido pela comunidade com verificação de integridade para ROMs e ISOs.', url: 'https://vimm.net/' },
    { title: 'CDRomance', icon: '💿', format: '.iso .bin/.cue .chd', desc: 'Especializado em jogos de CD/DVD — PS1, PS2, PSP, Dreamcast e mais. Traduções em português.', url: 'https://cdromance.org/' },
    { title: 'Romhacking.net', icon: '🔧', format: 'Patches .ips .bps', desc: 'Traduções, hacks e patches da comunidade. Encontre traduções PT-BR para seus jogos favoritos.', url: 'https://www.romhacking.net/' },
    { title: 'Homebrew Hub', icon: '🏠', format: 'Multi-formato', desc: 'Jogos homebrew criados pela comunidade — legais e gratuitos para download direto.', url: 'https://hh.gbdev.io/' },
    { title: 'No-Intro & Redump', icon: '✅', format: 'DAT files', desc: 'Bancos de dados de verificação para garantir que suas ROMs são versões corretas e sem corrupção.', url: 'https://no-intro.org/' },
  ];

  // ====== PALETAS DE CORES DO TEMA ======
  const THEMES = {
    gold: {
      name: 'Dourado',
      accent: '#d4a857',
      rgb: '212, 168, 87',
      accent2: '#c49a3c',
      accent2Rgb: '196, 154, 60',
      light: '#e8c872'
    },
    cyan: {
      name: 'Ciano Neon',
      accent: '#00f0ff',
      rgb: '0, 240, 255',
      accent2: '#7b2ff7',
      accent2Rgb: '123, 47, 247',
      light: '#67e8f9'
    },
    crimson: {
      name: 'Carmim',
      accent: '#ff2d55',
      rgb: '255, 45, 85',
      accent2: '#ff758c',
      accent2Rgb: '255, 117, 140',
      light: '#ff6b8b'
    },
    emerald: {
      name: 'Esmeralda',
      accent: '#00ff88',
      rgb: '0, 255, 136',
      accent2: '#00b894',
      accent2Rgb: '0, 184, 148',
      light: '#55efc4'
    },
    amber: {
      name: 'Âmbar',
      accent: '#ff9500',
      rgb: '255, 149, 0',
      accent2: '#ff5e3a',
      accent2Rgb: '255, 94, 58',
      light: '#ffb347'
    },
    purple: {
      name: 'Violeta PS5',
      accent: '#a855f7',
      rgb: '168, 85, 247',
      accent2: '#ec4899',
      accent2Rgb: '236, 72, 153',
      light: '#c084fc'
    }
  };

  // ====== SISTEMA DE IDIOMAS (i18n) ======
  const I18N = {
    'pt-BR': {
      name: 'Português (Brasil)',
      nav_home: 'Início',
      nav_library: 'Biblioteca',
      nav_store: 'Acervo',
      nav_consoles: 'Consoles',
      nav_community: 'Comunidade',
      nav_settings: 'Config',
      nav_search: 'Buscar',
      title_featured: 'Destaques',
      title_quick_resume: 'Retomar Jogo',
      title_by_console: 'Por Console',
      title_recent: 'Adicionados Recentemente',
      title_library: 'Minha Biblioteca',
      filter_all: 'Todos',
      filter_fav: 'Favoritos',
      filter_recent: 'Recentes',
      filter_az: 'A-Z',
      title_store: 'Acervo de Jogos',
      desc_store: 'Encontre ROMs e jogos no formato correto para cada console. Links para acervos verificados da comunidade.',
      btn_open_store: 'Abrir Acervo',
      title_consoles: 'Consoles Suportados',
      desc_consoles: 'Compatibilidade detectada automaticamente com base no hardware do seu dispositivo.',
      title_settings: 'Configurações',
      group_profile: 'Perfil do Jogador',
      label_player_name: 'Nome do Jogador',
      label_avatar: 'Avatar do Perfil',
      btn_edit: 'Editar',
      btn_change: 'Alterar',
      group_preferences: 'Preferências do Sistema',
      label_language: 'Idioma do Sistema',
      label_theme_color: 'Cor de Destaque',
      group_audio_video: 'Vídeo & Áudio',
      label_resolution: 'Resolução Padrão',
      label_video_filter: 'Filtro de Imagem',
      label_volume: 'Volume Master',
      group_controls: 'Controles',
      label_gamepad: 'Gamepad Detectado',
      label_touch: 'Controles Virtuais (Touch)',
      group_system: 'Hardware & Sistema',
      label_hw_detected: 'Hardware Detectado',
      label_system_version: 'Versão do Sistema',
      edit_name_title: 'Editar Nome do Jogador',
      edit_name_desc: 'Escolha como o seu perfil será exibido no console.',
      btn_save: 'Salvar',
      btn_cancel: 'Cancelar',
      btn_play: 'Jogar',
      btn_fav: 'Favoritar',
      clear_filter_btn: 'Limpar Filtro',
      all_consoles_view: 'Todos os consoles',
      games_count: 'jogos disponíveis'
    },
    'en-US': {
      name: 'English (US)',
      nav_home: 'Home',
      nav_library: 'Library',
      nav_store: 'Archive',
      nav_consoles: 'Consoles',
      nav_community: 'Community',
      nav_settings: 'Settings',
      nav_search: 'Search',
      title_featured: 'Featured',
      title_quick_resume: 'Quick Resume',
      title_by_console: 'By Console',
      title_recent: 'Recently Added',
      title_library: 'My Library',
      filter_all: 'All',
      filter_fav: 'Favorites',
      filter_recent: 'Recent',
      filter_az: 'A-Z',
      title_store: 'Game Archive',
      desc_store: 'Find ROMs and games in the exact format for each console. Links to verified preservation archives.',
      btn_open_store: 'Open Archive',
      title_consoles: 'Supported Consoles',
      desc_consoles: 'Hardware compatibility calculated automatically based on your device specs.',
      title_settings: 'Settings',
      group_profile: 'Player Profile',
      label_player_name: 'Player Name',
      label_avatar: 'Profile Avatar',
      btn_edit: 'Edit',
      btn_change: 'Change',
      group_preferences: 'System Preferences',
      label_language: 'System Language',
      label_theme_color: 'Accent Color',
      group_audio_video: 'Video & Audio',
      label_resolution: 'Default Resolution',
      label_video_filter: 'Image Filter',
      label_volume: 'Master Volume',
      group_controls: 'Controls',
      label_gamepad: 'Gamepad Status',
      label_touch: 'Touch Controls (On-Screen)',
      group_system: 'Hardware & System',
      label_hw_detected: 'Detected Hardware',
      label_system_version: 'System Version',
      edit_name_title: 'Edit Player Name',
      edit_name_desc: 'Choose how your profile name appears across the console.',
      btn_save: 'Save',
      btn_cancel: 'Cancel',
      btn_play: 'Play',
      btn_fav: 'Favorite',
      clear_filter_btn: 'Clear Filter',
      all_consoles_view: 'All consoles',
      games_count: 'games available'
    },
    'es-ES': {
      name: 'Español',
      nav_home: 'Inicio',
      nav_library: 'Biblioteca',
      nav_store: 'Colección',
      nav_consoles: 'Consolas',
      nav_community: 'Comunidad',
      nav_settings: 'Ajustes',
      nav_search: 'Buscar',
      title_featured: 'Destacados',
      title_quick_resume: 'Reanudar',
      title_by_console: 'Por Consola',
      title_recent: 'Añadidos Recientemente',
      title_library: 'Mi Biblioteca',
      filter_all: 'Todos',
      filter_fav: 'Favoritos',
      filter_recent: 'Recientes',
      filter_az: 'A-Z',
      title_store: 'Colección de Juegos',
      desc_store: 'Encuentra ROMs e imágenes en el formato exacto para cada consola. Enlaces verificados.',
      btn_open_store: 'Abrir Colección',
      title_consoles: 'Consolas Compatibles',
      desc_consoles: 'Compatibilidad calculada automáticamente según el hardware de tu dispositivo.',
      title_settings: 'Ajustes',
      group_profile: 'Perfil del Jugador',
      label_player_name: 'Nombre del Jugador',
      label_avatar: 'Avatar del Perfil',
      btn_edit: 'Editar',
      btn_change: 'Cambiar',
      group_preferences: 'Preferencias del Sistema',
      label_language: 'Idioma del Sistema',
      label_theme_color: 'Color de Acento',
      group_audio_video: 'Vídeo y Audio',
      label_resolution: 'Resolución Predeterminada',
      label_video_filter: 'Filtro de Imagen',
      label_volume: 'Volumen Master',
      group_controls: 'Mandos y Controles',
      label_gamepad: 'Mando Detectado',
      label_touch: 'Controles Táctiles',
      group_system: 'Hardware y Sistema',
      label_hw_detected: 'Hardware Detectado',
      label_system_version: 'Versión del Sistema',
      edit_name_title: 'Editar Nombre del Jugador',
      edit_name_desc: 'Elige cómo aparecerá tu nombre en la consola.',
      btn_save: 'Guardar',
      btn_cancel: 'Cancelar',
      btn_play: 'Jugar',
      btn_fav: 'Favorito',
      clear_filter_btn: 'Limpiar Filtro',
      all_consoles_view: 'Todas las consolas',
      games_count: 'juegos disponibles'
    }
  };

  // ====== GERENCIADOR DE IDIOMA ======
  const I18nManager = {
    current: 'pt-BR',
    init() {
      const saved = localStorage.getItem('nexus_language') || 'pt-BR';
      this.apply(saved, false);

      const select = document.getElementById('setting-lang-select');
      if (select) {
        select.value = this.current;
        select.addEventListener('change', (e) => {
          this.apply(e.target.value);
        });
      }
    },
    t(key) {
      const dict = I18N[this.current] || I18N['pt-BR'];
      return dict[key] || key;
    },
    apply(langCode, playSfx = true) {
      if (!I18N[langCode]) langCode = 'pt-BR';
      this.current = langCode;
      const dict = I18N[langCode];

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      const sidebarMapping = {
        home: dict.nav_home,
        library: dict.nav_library,
        store: dict.nav_store,
        consoles: dict.nav_consoles,
        community: dict.nav_community,
        settings: dict.nav_settings,
        search: dict.nav_search
      };
      document.querySelectorAll('.sidebar-btn[data-section]').forEach(btn => {
        const sec = btn.dataset.section;
        const label = btn.querySelector('.sidebar-label');
        if (label && sidebarMapping[sec]) {
          label.textContent = sidebarMapping[sec];
        }
      });

      const langVal = document.getElementById('setting-lang-value');
      if (langVal) langVal.textContent = dict.name;

      localStorage.setItem('nexus_language', langCode);
      if (playSfx && window.NexusSound) NexusSound.select();
    }
  };

  // ====== GERENCIADOR DE TEMA / CORES ======
  const ThemeManager = {
    current: 'gold',
    init() {
      const saved = localStorage.getItem('nexus_theme') || 'gold';
      this.apply(saved, false);
      this.setupListeners();
    },
    apply(themeKey, playSfx = true) {
      const t = THEMES[themeKey] || THEMES.gold;
      this.current = themeKey;

      const root = document.documentElement;
      root.style.setProperty('--accent', t.accent);
      root.style.setProperty('--accent-rgb', t.rgb);
      root.style.setProperty('--accent2', t.accent2);
      root.style.setProperty('--accent2-rgb', t.accent2Rgb);
      root.style.setProperty('--accent-light', t.light);

      document.querySelectorAll('#theme-color-options .color-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === themeKey);
      });

      const label = document.getElementById('setting-theme-name');
      if (label) label.textContent = t.name;

      localStorage.setItem('nexus_theme', themeKey);
      if (playSfx && window.NexusSound) NexusSound.select();
    },
    setupListeners() {
      document.querySelectorAll('#theme-color-options .color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          this.apply(dot.dataset.theme);
        });
        dot.addEventListener('mouseenter', () => NexusSound.hover());
      });
    }
  };

  // ====== GERENCIADOR DE PERFIL DO JOGADOR ======
  const ProfileManager = {
    name: 'Player One',
    avatar: null,
    init() {
      const savedName = localStorage.getItem('nexus_player_name');
      if (savedName) this.setName(savedName, false);

      const savedAvatar = localStorage.getItem('nexus_player_avatar');
      if (savedAvatar) this.setAvatar(savedAvatar, false);

      this.setupListeners();
    },
    setName(newName, playSfx = true) {
      if (!newName || !newName.trim()) return;
      this.name = newName.trim();
      document.querySelectorAll('.player-name').forEach(el => el.textContent = this.name);
      const settingVal = document.getElementById('setting-player-name');
      if (settingVal) settingVal.textContent = this.name;
      localStorage.setItem('nexus_player_name', this.name);
      if (playSfx && window.NexusSound) NexusSound.select();
    },
    setAvatar(dataUrl, playSfx = true) {
      this.avatar = dataUrl;
      const topAvatar = document.getElementById('player-avatar');
      const settingPreview = document.getElementById('setting-avatar-preview');
      const label = document.getElementById('setting-avatar-label');

      if (topAvatar) {
        topAvatar.style.backgroundImage = `url("${dataUrl}")`;
        topAvatar.innerHTML = '';
      }
      if (settingPreview) {
        settingPreview.style.backgroundImage = `url("${dataUrl}")`;
        settingPreview.innerHTML = '';
      }
      if (label) {
        label.textContent = 'Imagem Personalizada';
      }
      localStorage.setItem('nexus_player_avatar', dataUrl);
      if (playSfx && window.NexusSound) NexusSound.select();
    },
    setupListeners() {
      const btnEditName = document.getElementById('btn-edit-player-name');
      const nameModal = document.getElementById('name-modal');
      const nameInput = document.getElementById('name-input');
      const btnSaveName = document.getElementById('btn-save-name');
      const btnCancelName = document.getElementById('btn-cancel-name');
      const nameModalClose = document.getElementById('name-modal-close');

      if (btnEditName && nameModal && nameInput) {
        btnEditName.addEventListener('click', () => {
          NexusSound.select();
          nameInput.value = this.name;
          nameModal.classList.add('active');
          setTimeout(() => nameInput.focus(), 150);
        });
      }

      const closeNameModal = () => {
        if (nameModal) {
          nameModal.classList.remove('active');
          NexusSound.back();
        }
      };

      if (btnCancelName) btnCancelName.addEventListener('click', closeNameModal);
      if (nameModalClose) nameModalClose.addEventListener('click', closeNameModal);

      if (btnSaveName && nameInput) {
        btnSaveName.addEventListener('click', () => {
          if (nameInput.value.trim()) {
            this.setName(nameInput.value);
            if (nameModal) nameModal.classList.remove('active');
          }
        });
      }

      if (nameInput) {
        nameInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && nameInput.value.trim()) {
            this.setName(nameInput.value);
            if (nameModal) nameModal.classList.remove('active');
          } else if (e.key === 'Escape') {
            closeNameModal();
          }
        });
      }

      const btnChangeAvatar = document.getElementById('btn-change-avatar');
      const fileInput = document.getElementById('avatar-file-input');

      if (btnChangeAvatar && fileInput) {
        btnChangeAvatar.addEventListener('click', () => {
          NexusSound.select();
          fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              this.setAvatar(evt.target.result);
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }
  };

  // ====== HARDWARE ANALYZER ======
  const HWAnalyzer = {
    tier: 2,
    info: {},

    analyze() {
      const info = {};
      try {
        const gl = document.createElement('canvas').getContext('webgl');
        if (gl) {
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          info.gpu = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
          info.vendor = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : 'Unknown';
        }
      } catch(e) { info.gpu = 'N/A'; }

      info.cores = navigator.hardwareConcurrency || 2;
      info.ram = navigator.deviceMemory || null;
      info.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      info.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      info.screen = `${screen.width}x${screen.height}`;
      info.dpr = window.devicePixelRatio || 1;
      info.webgl2 = !!document.createElement('canvas').getContext('webgl2');

      this.info = info;
      this.tier = this.calculateTier(info);
      return { tier: this.tier, info };
    },

    calculateTier(info) {
      let score = 0;
      if (info.cores >= 8) score += 3;
      else if (info.cores >= 4) score += 2;
      else score += 1;

      if (info.ram) {
        if (info.ram >= 8) score += 3;
        else if (info.ram >= 4) score += 2;
        else score += 1;
      } else { score += 2; }

      const gpuStr = (info.gpu || '').toLowerCase();
      if (/rtx|radeon rx [5-9]|apple m[2-9]|mali-g[7-9]|adreno [6-9]/i.test(gpuStr)) score += 4;
      else if (/gtx|radeon rx|apple m1|mali-g5|adreno 5/i.test(gpuStr)) score += 3;
      else if (/intel.*iris|mali-g4|adreno 4/i.test(gpuStr)) score += 2;
      else score += 1;

      if (info.webgl2) score += 1;
      if (info.isMobile) score -= 1;

      if (score >= 10) return 4;
      if (score >= 7) return 3;
      if (score >= 4) return 2;
      return 1;
    },

    getTierLabel(tier) {
      const labels = {
        1: { text: 'Básico', color: 'var(--accent)', desc: '8/16-bit (NES, SNES, GB)' },
        2: { text: 'Médio', color: '#00ff88', desc: '32/64-bit (PS1, N64, GBA, NDS)' },
        3: { text: 'Avançado', color: 'var(--accent-light)', desc: '128-bit (PS2, GameCube, PSP)' },
        4: { text: 'Entusiasta', color: 'var(--accent2)', desc: 'Moderno (PS3, Switch, Wii U)' },
      };
      return labels[tier] || labels[1];
    },

    getConsoleCompat(consoleTier) {
      if (consoleTier <= this.tier) return 'green';
      if (consoleTier === this.tier + 1) return 'yellow';
      return 'red';
    },

    getCompatLabel(compat) {
      return { green: '🟢 Roda Perfeitamente', yellow: '🟡 Pode Engasgar', red: '🔴 Não Recomendado' }[compat];
    }
  };

  // ====== UI CONTROLLER ======
  const UI = {
    currentSection: 'home',
    activeConsoleFilter: null,

    init() {
      ThemeManager.init();
      ProfileManager.init();
      I18nManager.init();

      this.setupSidebar();
      this.setupCarousels();
      this.setupClock();
      this.setupModal();
      this.setupSearch();
      this.setupVolume();
      this.renderHome();
      this.renderLibrary();
      this.renderStore();
      this.renderConsoles();
      this.setupBgParticles();
      this.setupGamepadDetection();
      this.setupHWInSettings();
    },

    // -- Volume Slider --
    setupVolume() {
      const slider = document.getElementById('volume-slider');
      const valLabel = document.getElementById('volume-val');
      if (slider) {
        slider.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          if (valLabel) valLabel.textContent = `${v}%`;
          if (window.NexusSound) NexusSound.setVolume(v / 100);
        });
      }
    },

    // -- HW Info in Settings --
    setupHWInSettings() {
      const result = HWAnalyzer.analyze();
      const tierInfo = HWAnalyzer.getTierLabel(result.tier);

      const hwSetting = document.getElementById('hw-info-setting');
      if (hwSetting) {
        const gpu = (result.info.gpu || 'N/A').substring(0, 60);
        hwSetting.textContent = `${gpu}`;
      }

      const hwDetail = document.getElementById('hw-detail-panel');
      if (hwDetail) {
        hwDetail.innerHTML = `
          <div class="hw-detail-row"><span>GPU</span><span>${result.info.gpu || 'N/A'}</span></div>
          <div class="hw-detail-row"><span>CPU Threads</span><span>${result.info.cores}</span></div>
          <div class="hw-detail-row"><span>RAM</span><span>${result.info.ram ? '~' + result.info.ram + ' GB' : 'N/A'}</span></div>
          <div class="hw-detail-row"><span>Tela</span><span>${result.info.screen} @${result.info.dpr}x</span></div>
          <div class="hw-detail-row"><span>WebGL 2</span><span>${result.info.webgl2 ? 'Sim' : 'Não'}</span></div>
          <div class="hw-detail-row"><span>Plataforma</span><span>${result.info.isMobile ? 'Mobile' : 'Desktop'}</span></div>
          <div class="hw-detail-row"><span>Touch</span><span>${result.info.hasTouch ? 'Sim' : 'Não'}</span></div>
          <div class="hw-detail-tier">
            <span class="tier-badge" style="color:${tierInfo.color};border-color:${tierInfo.color}">
              TIER ${result.tier} — ${tierInfo.text}
            </span>
            <span class="tier-desc">${tierInfo.desc}</span>
          </div>
        `;
      }
    },

    // -- Sidebar Navigation --
    setupSidebar() {
      const btns = document.querySelectorAll('.sidebar-btn[data-section]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const section = btn.dataset.section;
          this.switchSection(section);
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          NexusSound.tab();
        });
        btn.addEventListener('mouseenter', () => NexusSound.hover());
      });
    },

    switchSection(sectionId) {
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(`section-${sectionId}`);
      if (target) {
        target.classList.add('active');
        this.currentSection = sectionId;

        const activeSidebarBtn = document.querySelector(`.sidebar-btn[data-section="${sectionId}"]`);
        if (activeSidebarBtn) {
          document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
          activeSidebarBtn.classList.add('active');
        }

        if (sectionId === 'search') {
          setTimeout(() => document.getElementById('search-input')?.focus(), 250);
        }
      }
    },

    // -- Clock --
    setupClock() {
      const el = document.getElementById('time-display');
      const update = () => {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      };
      update();
      setInterval(update, 30000);
    },

    // -- Create Game Card --
    createGameCard(game, featured = false) {
      const consoleDef = CONSOLES_DB.find(c => c.name.includes(game.console) || game.console.includes(c.name))
                          || CONSOLES_DB.find(c => c.id === game.console.toLowerCase().replace(/\s/g,''));
      const consoleTier = consoleDef ? consoleDef.tier : 2;
      const compat = HWAnalyzer.getConsoleCompat(consoleTier);

      const card = document.createElement('div');
      card.className = `game-card${featured ? ' featured' : ''}`;
      card.dataset.gameId = game.id;
      card.dataset.console = game.console;

      const bgStyle = `background: linear-gradient(135deg, ${game.color}55, ${game.color}22, #0a0a0f)`;

      card.innerHTML = `
        <div class="game-card-bg" style="${bgStyle}">
          ${game.cover ? `<img src="${game.cover}" alt="${game.title}" class="game-card-cover" loading="lazy" 
            onerror="this.style.display='none'">` : ''}
        </div>
        <div class="game-card-overlay"></div>
        <div class="game-card-compat compat-${compat}"></div>
        <div class="game-card-info">
          <div class="game-card-title">${game.title}</div>
          <div class="game-card-console">${game.console}</div>
        </div>
      `;

      card.addEventListener('click', () => this.openGameModal(game));
      card.addEventListener('mouseenter', () => NexusSound.cardFocus());
      return card;
    },

    // -- Filtrar Biblioteca pelo Console Selecionado (Ao clicar num console) --
    filterByConsole(consoleDef) {
      NexusSound.select();
      this.activeConsoleFilter = consoleDef;

      // 1. Muda para a aba da Biblioteca
      this.switchSection('library');

      // 2. Monta o banner 3D do console no topo da biblioteca
      const banner = document.getElementById('console-filter-banner');
      if (banner) {
        const compat = HWAnalyzer.getConsoleCompat(consoleDef.tier);
        const compatLabel = HWAnalyzer.getCompatLabel(compat);

        banner.style.display = 'flex';
        banner.className = 'console-filter-banner';
        banner.innerHTML = `
          <div class="console-filter-banner-left">
            <img src="${consoleDef.image3d}" alt="${consoleDef.name}" class="console-filter-banner-img">
            <div class="console-filter-banner-info">
              <div class="console-filter-banner-title">${consoleDef.name}</div>
              <div class="console-filter-banner-subtitle">
                ${consoleDef.era} · ${consoleDef.year} · <span style="font-family:monospace">${consoleDef.formats.join(', ')}</span> · <b>${compatLabel}</b>
              </div>
            </div>
          </div>
          <button class="btn-clear-console-filter" id="btn-clear-filter">
            <span class="material-icons-round">close</span>
            <span>${I18nManager.t('clear_filter_btn')}</span>
          </button>
        `;

        document.getElementById('btn-clear-filter')?.addEventListener('click', () => {
          this.clearConsoleFilter();
        });
      }

      // 3. Filtra os jogos
      const grid = document.getElementById('library-grid');
      if (grid) {
        grid.innerHTML = '';
        const matchingGames = GAMES_DB.filter(g => {
          const consoleName = consoleDef.name.toLowerCase();
          const gameConsole = g.console.toLowerCase();
          return consoleName.includes(gameConsole) || gameConsole.includes(consoleDef.id);
        });

        if (matchingGames.length > 0) {
          matchingGames.forEach(g => grid.appendChild(this.createGameCard(g)));
        } else {
          grid.innerHTML = `
            <div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--text-secondary)">
              <span class="material-icons-round" style="font-size:48px;color:var(--accent);opacity:0.6">search_off</span>
              <p style="margin-top:12px;font-size:15px">Nenhum jogo deste console instalado ainda.</p>
              <button class="btn-primary" style="margin:16px auto 0;" onclick="NexusEgy.UI.switchSection('store')">
                <span class="material-icons-round">storefront</span>
                <span>Buscar ROMs no Acervo</span>
              </button>
            </div>
          `;
        }
      }
    },

    clearConsoleFilter() {
      NexusSound.select();
      this.activeConsoleFilter = null;
      const banner = document.getElementById('console-filter-banner');
      if (banner) banner.style.display = 'none';

      const grid = document.getElementById('library-grid');
      if (grid) {
        grid.innerHTML = '';
        GAMES_DB.forEach(g => grid.appendChild(this.createGameCard(g)));
      }
    },

    // -- Render Home --
    renderHome() {
      const featuredEl = document.getElementById('featured-carousel');
      [GAMES_DB[4], GAMES_DB[6], GAMES_DB[16], GAMES_DB[19], GAMES_DB[20], GAMES_DB[9], GAMES_DB[25]].forEach(g => featuredEl.appendChild(this.createGameCard(g, true)));

      const resumeEl = document.getElementById('resume-carousel');
      [GAMES_DB[0], GAMES_DB[11], GAMES_DB[13], GAMES_DB[7], GAMES_DB[17], GAMES_DB[22], GAMES_DB[3]].forEach(g => resumeEl.appendChild(this.createGameCard(g)));

      // Carrossel "Por Console" com Imagens 3D flutuantes com Relevo
      const consoleEl = document.getElementById('console-carousel');
      CONSOLES_DB.forEach(c => {
        const compat = HWAnalyzer.getConsoleCompat(c.tier);
        const chip = document.createElement('div');
        chip.className = 'console-card';
        chip.title = `Clique para ver jogos de ${c.name}`;
        chip.innerHTML = `
          <div class="console-card-compat compat-${compat}"></div>
          <div class="console-3d-wrap">
            <img src="${c.image3d}" alt="${c.name}" class="console-3d-img" loading="lazy" onerror="this.src='assets/logo.svg'">
          </div>
          <div class="console-card-name">${c.name.split('/')[0].trim()}</div>
        `;

        chip.addEventListener('click', () => {
          this.filterByConsole(c);
        });
        chip.addEventListener('mouseenter', () => NexusSound.hover());
        consoleEl.appendChild(chip);
      });

      const recentEl = document.getElementById('recent-carousel');
      [GAMES_DB[14], GAMES_DB[23], GAMES_DB[26], GAMES_DB[5], GAMES_DB[10], GAMES_DB[8], GAMES_DB[15], GAMES_DB[2]].forEach(g => recentEl.appendChild(this.createGameCard(g)));
    },

    renderLibrary() {
      const grid = document.getElementById('library-grid');
      GAMES_DB.forEach(g => grid.appendChild(this.createGameCard(g)));

      document.querySelectorAll('#library-filter-buttons .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#library-filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          NexusSound.select();

          const filter = btn.dataset.filter;
          if (filter === 'all') {
            this.clearConsoleFilter();
          } else if (filter === 'az') {
            const sorted = [...GAMES_DB].sort((a,b) => a.title.localeCompare(b.title));
            grid.innerHTML = '';
            sorted.forEach(g => grid.appendChild(this.createGameCard(g)));
          }
        });
        btn.addEventListener('mouseenter', () => NexusSound.hover());
      });
    },

    renderStore() {
      const grid = document.getElementById('acervo-grid');
      ACERVO_DB.forEach(a => {
        const card = document.createElement('div');
        card.className = 'acervo-card';
        card.innerHTML = `
          <div class="acervo-card-header">
            <div class="acervo-card-icon">${a.icon}</div>
            <div>
              <div class="acervo-card-title">${a.title}</div>
              <div class="acervo-card-format">${a.format}</div>
            </div>
          </div>
          <div class="acervo-card-desc">${a.desc}</div>
          <a class="acervo-card-link" href="${a.url}" target="_blank" rel="noopener">
            <span class="material-icons-round" style="font-size:14px">open_in_new</span>
            <span>${I18nManager.t('btn_open_store')}</span>
          </a>
        `;
        card.addEventListener('mouseenter', () => NexusSound.hover());
        grid.appendChild(card);
      });
    },

    // -- Render Consoles na Aba Consoles (3D Relevo Clicável) --
    renderConsoles() {
      const grid = document.getElementById('consoles-grid');
      CONSOLES_DB.forEach(c => {
        const compat = HWAnalyzer.getConsoleCompat(c.tier);
        const card = document.createElement('div');
        card.className = 'console-detail-card';
        card.title = `Clique para abrir os jogos de ${c.name}`;
        card.innerHTML = `
          <div class="console-detail-header">
            <div class="console-detail-name">${c.name}</div>
            <span class="console-detail-compat compat-badge-${compat}">
              ${compat === 'green' ? 'Compatível' : compat === 'yellow' ? 'Parcial' : 'Pesado'}
            </span>
          </div>
          <div class="console-detail-3d-wrap">
            <img src="${c.image3d}" alt="${c.name}" class="console-detail-3d-img" loading="lazy" onerror="this.src='assets/logo.svg'">
          </div>
          <div class="console-detail-info">${c.era} · ${c.year} · Tier ${c.tier}</div>
          <div class="console-detail-formats">
            ${c.formats.map(f => `<span>${f}</span>`).join('')}
          </div>
        `;

        card.addEventListener('click', () => {
          this.filterByConsole(c);
        });
        card.addEventListener('mouseenter', () => NexusSound.hover());
        grid.appendChild(card);
      });
    },

    // -- Carousel Drag & Arrows --
    setupCarousels() {
      document.querySelectorAll('.game-carousel, .console-carousel').forEach(carousel => {
        let isDown = false, startX, scrollLeft, velocity = 0, lastX = 0, lastTime = 0, momentumFrame;

        carousel.addEventListener('mousedown', (e) => {
          isDown = true;
          carousel.style.cursor = 'grabbing';
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
          velocity = 0;
          lastX = e.pageX;
          lastTime = Date.now();
          cancelAnimationFrame(momentumFrame);
        });

        const endDrag = () => {
          if (isDown) applyMomentum();
          isDown = false;
          carousel.style.cursor = 'grab';
        };

        carousel.addEventListener('mouseleave', endDrag);
        carousel.addEventListener('mouseup', endDrag);

        carousel.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          carousel.scrollLeft = scrollLeft - (x - startX) * 1.5;
          const now = Date.now();
          const dt = now - lastTime;
          if (dt > 0) velocity = (e.pageX - lastX) / dt;
          lastX = e.pageX;
          lastTime = now;
        });

        function applyMomentum() {
          let v = velocity * 15;
          function step() {
            if (Math.abs(v) < 0.5) return;
            carousel.scrollLeft -= v;
            v *= 0.92;
            momentumFrame = requestAnimationFrame(step);
          }
          step();
        }

        let touchStartX, touchScrollLeft;
        carousel.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].pageX;
          touchScrollLeft = carousel.scrollLeft;
          cancelAnimationFrame(momentumFrame);
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
          const walk = (e.touches[0].pageX - touchStartX) * 1.2;
          carousel.scrollLeft = touchScrollLeft - walk;
        }, { passive: true });
      });

      document.querySelectorAll('.carousel-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
          const carousel = document.getElementById(arrow.dataset.carousel);
          if (!carousel) return;
          const dir = arrow.classList.contains('left') ? -1 : 1;
          carousel.scrollBy({ left: carousel.clientWidth * 0.7 * dir, behavior: 'smooth' });
          NexusSound.hover();
        });
      });
    },

    // -- Game Modal --
    setupModal() {
      const modal = document.getElementById('game-modal');
      const closeBtn = document.getElementById('modal-close');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          NexusSound.back();
        });
      }

      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            NexusSound.back();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
          NexusSound.back();
        }
      });
    },

    openGameModal(game) {
      NexusSound.select();
      const modal = document.getElementById('game-modal');
      const consoleDef = CONSOLES_DB.find(c => c.name.includes(game.console) || game.console.includes(c.name))
                          || CONSOLES_DB.find(c => c.id === game.console.toLowerCase().replace(/\s/g,''));
      const consoleTier = consoleDef ? consoleDef.tier : 2;
      const compat = HWAnalyzer.getConsoleCompat(consoleTier);
      const compatLabel = HWAnalyzer.getCompatLabel(compat);

      const heroEl = document.getElementById('modal-hero');
      if (game.cover) {
        heroEl.style.backgroundImage = `url(${game.cover})`;
        heroEl.style.backgroundSize = 'cover';
        heroEl.style.backgroundPosition = 'center';
      } else {
        heroEl.style.backgroundImage = '';
        heroEl.style.background = `linear-gradient(135deg, ${game.color}66, ${game.color}22, #0a0a0f)`;
      }

      document.getElementById('modal-title').textContent = game.title;
      document.getElementById('modal-console').textContent = game.console;
      document.getElementById('modal-year').textContent = game.year;
      document.getElementById('modal-genre').textContent = game.genre;
      document.getElementById('modal-format').textContent = game.format;
      document.getElementById('modal-desc').textContent = game.desc;

      const compatEl = document.getElementById('modal-compat');
      compatEl.textContent = compatLabel;
      compatEl.className = `modal-compat compat-badge-${compat}`;

      modal.classList.add('active');
    },

    // -- Search --
    setupSearch() {
      const input = document.getElementById('search-input');
      const results = document.getElementById('search-results');

      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        results.innerHTML = '';

        if (query.length < 2) {
          results.innerHTML = `<p class="search-hint">${I18nManager.t('search_hint') || 'Digite pelo menos 2 caracteres...'}</p>`;
          return;
        }

        const matches = GAMES_DB.filter(g =>
          g.title.toLowerCase().includes(query) ||
          g.console.toLowerCase().includes(query) ||
          g.genre.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          results.innerHTML = '<p class="search-hint">Nenhum jogo encontrado.</p>';
          return;
        }

        const grid = document.createElement('div');
        grid.className = 'library-grid';
        matches.forEach(g => grid.appendChild(this.createGameCard(g)));
        results.appendChild(grid);
      });
    },

    // -- Background Particles --
    setupBgParticles() {
      const canvas = document.getElementById('bg-particles');
      const ctx = canvas.getContext('2d');
      let particles = [];

      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      function init() {
        resize();
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 40);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
            size: Math.random() * 1.5 + 0.3, opacity: Math.random() * 0.3 + 0.05,
            hue: Math.random() > 0.5 ? 42 : 35,
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(draw);
      }

      init(); draw();
      window.addEventListener('resize', init);
    },

    // -- Gamepad --
    setupGamepadDetection() {
      const statusEl = document.getElementById('gamepad-status');
      window.addEventListener('gamepadconnected', (e) => { if (statusEl) statusEl.textContent = e.gamepad.id; });
      window.addEventListener('gamepaddisconnected', () => { if (statusEl) statusEl.textContent = 'Nenhum conectado'; });
    }
  };

  // ====== BOOT COMPLETE ======
  window.addEventListener('nexus-boot-complete', () => {
    UI.init();
  });

  // ====== Keyboard Navigation ======
  document.addEventListener('keydown', (e) => {
    const sections = ['home', 'library', 'store', 'consoles', 'community', 'settings', 'search'];
    const idx = sections.indexOf(UI.currentSection);
    if (e.key === 'ArrowUp' && idx > 0) document.querySelector(`.sidebar-btn[data-section="${sections[idx - 1]}"]`)?.click();
    if (e.key === 'ArrowDown' && idx < sections.length - 1) document.querySelector(`.sidebar-btn[data-section="${sections[idx + 1]}"]`)?.click();
    if (e.key === 'F11') { e.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
  });

  return { UI, HWAnalyzer, ThemeManager, ProfileManager, I18nManager, GAMES_DB, CONSOLES_DB };
})();
