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
    { id: 'ps2', name: 'PlayStation 2', icon: '🎮', era: '128-bit', year: '2000', formats: ['.iso', '.chd', '.bin'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/PS2-Fat-Console-Set.png/480px-PS2-Fat-Console-Set.png',
      emulator: 'PCSX2 (Nativo)' },
    { id: 'ps3', name: 'PlayStation 3', icon: '🎮', era: '7ª Geração HD', year: '2006', formats: ['.iso', '.pkg'], tier: 4,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sony-PlayStation-3-2001A-wController-L.png/480px-Sony-PlayStation-3-2001A-wController-L.png',
      emulator: 'RPCS3 (Nativo)' },
    { id: 'xbox', name: 'Xbox Original', icon: '🟩', era: '6ª Geração', year: '2001', formats: ['.iso', '.xbe'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Xbox-Console-wController-L.png/480px-Xbox-Console-wController-L.png',
      emulator: 'Xemu (Nativo)' },
    { id: 'gamecube', name: 'GameCube', icon: '🟪', era: '128-bit', year: '2001', formats: ['.iso', '.gcz', '.rvz'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/GameCube-Console-Set.png/480px-GameCube-Console-Set.png',
      emulator: 'Dolphin (Nativo)' },
    { id: 'wii', name: 'Nintendo Wii', icon: '🕹️', era: '7ª Geração', year: '2006', formats: ['.iso', '.wbfs', '.rvz'], tier: 3,
      image3d: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Wii-Console.png/480px-Wii-Console.png',
      emulator: 'Dolphin (Nativo)' },
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
    // PS3
    { id: 'tlou', title: 'The Last of Us', console: 'PS3', year: '2013', genre: 'Ação / Sobrevivência', format: '.iso/.pkg', color: '#37474F',
      cover: 'https://upload.wikimedia.org/wikipedia/en/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg',
      desc: 'Joel e Ellie em uma jornada inesquecível pelos Estados Unidos pós-apocalíptico.' },
    { id: 'gow3', title: 'God of War III', console: 'PS3', year: '2010', genre: 'Ação / Hack and Slash', format: '.iso/.pkg', color: '#b71c1c',
      cover: 'https://upload.wikimedia.org/wikipedia/en/a/a9/God_of_War_III_cover.jpg',
      desc: 'A conclusão épica da vingança de Kratos escalando o Monte Olimpo.' },
    // Xbox
    { id: 'halo2', title: 'Halo 2', console: 'Xbox', year: '2004', genre: 'Tiro / FPS', format: '.iso/.xbe', color: '#2E7D32',
      cover: 'https://upload.wikimedia.org/wikipedia/en/9/92/Halo2-cover.png',
      desc: 'Master Chief lidera a defesa da Terra contra os Covenant neste clássico divisor de águas.' },
    { id: 'forza1', title: 'Forza Motorsport', console: 'Xbox', year: '2005', genre: 'Corrida / Simulação', format: '.iso/.xbe', color: '#E65100',
      cover: 'https://upload.wikimedia.org/wikipedia/en/8/81/Forza_Motorsport_Cover.jpg',
      desc: 'A consagrada física de corrida automotiva da Microsoft no Xbox original.' },
    // GameCube
    { id: 'smash-melee', title: 'Super Smash Bros. Melee', console: 'GameCube', year: '2001', genre: 'Luta', format: '.iso/.gcz', color: '#C2185B',
      cover: 'https://upload.wikimedia.org/wikipedia/en/4/41/Super_Smash_Bros_Melee_Box_Art.png',
      desc: 'O mais veloz e competitivo torneio de luta entre os maiores ícones da Nintendo.' },
    { id: 'zelda-ww', title: 'The Legend of Zelda: The Wind Waker', console: 'GameCube', year: '2002', genre: 'Aventura', format: '.iso/.rvz', color: '#00897B',
      cover: 'https://upload.wikimedia.org/wikipedia/en/7/7b/The_Legend_of_Zelda_The_Wind_Waker_cover.png',
      desc: 'Navegue pelos mares e ilhas cel shading no papel do lendário Herói do Vento.' },
    // Wii
    { id: 'mario-galaxy-2', title: 'Super Mario Galaxy 2', console: 'Wii', year: '2010', genre: 'Plataforma 3D', format: '.iso/.wbfs', color: '#1565C0',
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/15/Super_Mario_Galaxy_2_Box_Art.jpg',
      desc: 'Viaje pelo cosmos com Mario e Yoshi entre gravidade zero e quebra-cabeças espaciais.' },
    { id: 'mario-kart-wii', title: 'Mario Kart Wii', console: 'Wii', year: '2008', genre: 'Corrida', format: '.iso/.wbfs', color: '#FBC02D',
      cover: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Mario_Kart_Wii.png',
      desc: 'Dispute corridas insanas com karts, motos e o controle de movimento da Nintendo.' },
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
    ps5: {
      name: 'Azul PS5',
      accent: '#2979ff',
      rgb: '41, 121, 255',
      accent2: '#00e5ff',
      accent2Rgb: '0, 229, 255',
      light: '#82b1ff'
    },
    cyan: {
      name: 'Ciano Neon',
      accent: '#00f0ff',
      rgb: '0, 240, 255',
      accent2: '#7b2ff7',
      accent2Rgb: '123, 47, 247',
      light: '#67e8f9'
    },
    gold: {
      name: 'Dourado',
      accent: '#d4a857',
      rgb: '212, 168, 87',
      accent2: '#c49a3c',
      accent2Rgb: '196, 154, 60',
      light: '#e8c872'
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
    current: 'ps5',
    init() {
      const saved = localStorage.getItem('nexus_theme') || 'ps5';
      this.apply(saved, false);
      this.setupListeners();
    },
    apply(themeKey, playSfx = true) {
      const t = THEMES[themeKey] || THEMES.ps5;
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


  // ====== LEITOR UNIVERSAL DE JOGOS (zip, detecção por conteúdo) + EMULADOR LOCAL ======
  const ROM_EXTS = ['nes','unf','unif','sfc','smc','fig','swc','n64','z64','v64','gb','gbc','gba','nds','md','gen','smd','sms','gg','cso','chd','pbp','a26','ws','wsc','ngp','ngc','iso','bin','img'];
  const CORE_OF = { gb: 'gba', gbc: 'gba', segaMS: 'segaMD', segaGG: 'segaMD' }; // núcleos que vêm dentro do app
  const LOCAL_CORES = ['mgba', 'snes9x', 'fceumm', 'genesis_plus_gx', 'pcsx_rearmed', 'melonds', 'mupen64plus_next', 'ppsspp-thread'];
  const EJS_CDN = 'https://cdn.emulatorjs.org/4.2.3/data/';
  const extOf = n => (n.includes('.') ? n.split('.').pop() : '').toLowerCase();

  async function detectDisc(name, blob) {
    const ext = extOf(name), latin1 = u => new TextDecoder('latin1').decode(u);
    const nLower = (name || '').toLowerCase();

    // 1. Detecção direta por nome do arquivo
    if (nLower.includes('ps2') || nLower.includes('playstation 2')) return 'ps2';
    if (nLower.includes('ps3') || nLower.includes('playstation 3') || nLower.endsWith('.pkg')) return 'ps3';
    if (nLower.includes('xbox') || nLower.endsWith('.xbe')) return 'xbox';
    if (nLower.includes('gamecube') || nLower.includes('ngc') || nLower.endsWith('.gcz') || nLower.endsWith('.gcm')) return 'gamecube';
    if (nLower.includes('wii') || nLower.endsWith('.wbfs') || nLower.endsWith('.rvz')) return 'wii';
    if (nLower.includes('psp') || nLower.endsWith('.cso')) return 'psp';
    if (nLower.includes('ps1') || nLower.includes('psx')) return 'psx';

    // 2. Leitura de cabeçalhos internos na ISO
    const head = async (o, n) => {
      try {
        return new Uint8Array(await blob.slice(o, o + n).arrayBuffer());
      } catch (e) {
        return new Uint8Array(0);
      }
    };

    if (ext === 'iso' || ext === 'img') {
      try {
        const s = latin1(await head(0, 1048576));
        if (latin1(await head(0x10000, 20)) === 'MICROSOFT*XBOX*MEDIA' || latin1(await head(0xFD90000, 20)) === 'MICROSOFT*XBOX*MEDIA') return 'xbox';
        if (s.includes('PSP_GAME')) return 'psp';
        if (s.includes('PS3_GAME') || s.includes('PS3_DISC.SFB')) return 'ps3';
        if (s.includes('SYSTEM.CNF')) return (s.includes('BOOT2') || blob.size > 800 * 1048576) ? 'ps2' : 'psx';
      } catch (e) {}

      // 3. Heurística segura por tamanho do arquivo (ISOs sem cabeçalho padrão de 700kb)
      if (blob && blob.size > 800 * 1048576) return 'ps2'; // DVD de PS2 tem mais de 800MB
      if (blob && blob.size > 300 * 1048576) return 'psx'; // CD de PS1 tem entre 300MB e 800MB
      return 'psp';
    }

    if (ext === 'bin') {
      try {
        if (latin1(await head(0x100, 4)) === 'SEGA') return 'segaMD';
      } catch (e) {}
      return (blob && blob.size > 16 * 1048576) ? 'psx' : null;
    }

    return 'ps2';
  }
  async function zipEntries(file) {
    const tail = new DataView(await file.slice(Math.max(0, file.size - 65557)).arrayBuffer());
    let p = tail.byteLength - 22;
    while (p >= 0 && tail.getUint32(p, true) !== 0x06054b50) p--;
    if (p < 0) throw new Error('zip inválido');
    const n = tail.getUint16(p + 10, true), size = tail.getUint32(p + 12, true), off = tail.getUint32(p + 16, true);
    const cd = new DataView(await file.slice(off, off + size).arrayBuffer()), dec = new TextDecoder(), out = [];
    let q = 0;
    for (let i = 0; i < n && cd.getUint32(q, true) === 0x02014b50; i++) {
      const nl = cd.getUint16(q + 28, true), el = cd.getUint16(q + 30, true), cl = cd.getUint16(q + 32, true);
      out.push({ method: cd.getUint16(q + 10, true), csize: cd.getUint32(q + 20, true), lo: cd.getUint32(q + 42, true),
        name: dec.decode(new Uint8Array(cd.buffer, q + 46, nl)) });
      q += 46 + nl + el + cl;
    }
    return out;
  }
  async function zipExtract(file, e) {
    const lh = new DataView(await file.slice(e.lo, e.lo + 30).arrayBuffer());
    const start = e.lo + 30 + lh.getUint16(26, true) + lh.getUint16(28, true), raw = file.slice(start, start + e.csize);
    if (e.method === 0) return raw;
    if (e.method === 8) return await new Response(raw.stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob();
    throw new Error('compressão não suportada');
  }
  let ejsReady;
  function loadLocalEJS() {
    if (ejsReady) return ejsReady;
    ejsReady = (async () => {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'emulator/emulator.min.css'; document.head.appendChild(link);
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'emulator/emulator.min.js'; s.onload = res; s.onerror = () => rej(new Error('emulador')); document.body.appendChild(s); });
      const P = window.EmulatorJS.prototype, orig = P.getBaseFileName;
      // o jogo chega como blob: sem isto ele perde a extensão (.iso/.sms/.gbc) e o núcleo não o reconhece
      P.getBaseFileName = function (forContent) {
        const r = orig.call(this, forContent);
        return (forContent && window.__ROM_FILENAME) ? window.__ROM_FILENAME.replace(/[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/g, '') : r;
      };
      const paths = {};
      LOCAL_CORES.forEach(c => { const f = c + '-wasm.data'; paths[f] = 'emulator/' + f; paths[c + '-legacy-wasm.data'] = 'emulator/' + f; });
      let ready = []; try { ready = await (await fetch('emulator/ready.json')).json(); } catch (e) {}
      ['extract7z.js', 'extractzip.js', 'libunrar.js', 'libunrar.js.mem'].forEach(f => paths[f] = ready.includes(f) ? 'emulator/compression/' + f : EJS_CDN + 'compression/' + f);
      return paths;
    })();
    ejsReady.catch(() => { ejsReady = null; });
    return ejsReady;
  }

  // ====== GERENCIADOR DE EMULAÇÃO & JOGOS ======
  // ====== MENU DE PAUSA DO JOGO (Esc / Select+Start / botão ☰) ======
  const NexusPause = (() => {
    let el, list, titleEl, subEl, noteEl, items = [], idx = 0, open = false, mode = 'main', noteTimer;
    let volume = parseFloat(localStorage.getItem('nexus_ingame_volume') || '1.0');
    let muted = false;

    const frame = () => document.getElementById('nexus-game-frame');
    const emu = () => { const f = frame(); try { return f && f.contentWindow && f.contentWindow.EJS_emulator; } catch (e) { return null; } };
    const gm = () => { const e = emu(); return e && e.gameManager; };
    const say = t => { if (!noteEl) return; noteEl.textContent = t; clearTimeout(noteTimer); noteTimer = setTimeout(() => noteEl.textContent = '', 2500); };
    const toggleFs = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else { EmulatorManager._fs = true; document.documentElement.requestFullscreen().catch(() => {}); } };

    function applyVolume(vol, isMuteToggle = false) {
      if (isMuteToggle) {
        muted = !muted;
      } else {
        volume = Math.max(0, Math.min(1, vol));
        if (volume > 0) muted = false;
        localStorage.setItem('nexus_ingame_volume', volume.toString());
      }

      const activeVol = muted ? 0 : volume;
      const pct = Math.round(activeVol * 100);
      const iconName = activeVol === 0 ? 'volume_off' : (activeVol > 0.5 ? 'volume_up' : 'volume_down');

      // Atualiza controles na TopBar e no HUD flutuante
      const topSlider = document.getElementById('in-game-volume-slider');
      const topText = document.getElementById('in-game-vol-text');
      const topIcon = document.getElementById('in-game-vol-icon');
      const hudSlider = document.getElementById('nx-hud-vol-slider');
      const hudText = document.getElementById('nx-hud-vol-val');
      const hudIcon = document.getElementById('nx-hud-vol-icon');

      if (topSlider) topSlider.value = pct;
      if (topText) topText.textContent = pct + '%';
      if (topIcon) topIcon.textContent = iconName;

      if (hudSlider) hudSlider.value = pct;
      if (hudText) hudText.textContent = pct + '%';
      if (hudIcon) hudIcon.textContent = iconName;

      // Aplica no emulador via postMessage e API direta
      try {
        const e = emu();
        if (e && e.setVolume) e.setVolume(activeVol);
      } catch (err) {}

      try {
        const f = frame();
        if (f && f.contentWindow) {
          f.contentWindow.postMessage({ type: 'SET_VOLUME', volume: activeVol }, '*');
          if (f.contentWindow.setGameVolume) f.contentWindow.setGameVolume(activeVol);
        }
      } catch (err) {}
    }

    function build() {
      el = document.createElement('div'); el.id = 'nx-pause'; el.className = 'nx-pause';
      el.innerHTML = '<div class="nx-pause-card"><div class="nx-pause-head"><span class="nx-pause-ico">⏸</span><div><div class="nx-pause-title" id="nx-pause-title"></div><div class="nx-pause-sub" id="nx-pause-sub"></div></div></div><div class="nx-pause-list" id="nx-pause-list"></div><div class="nx-pause-note" id="nx-pause-note"></div><div class="nx-pause-keys">↑ ↓ navegar &nbsp;·&nbsp; Enter confirmar &nbsp;·&nbsp; Esc continuar</div></div>';
      document.getElementById('emulator-overlay').appendChild(el);
      list = el.querySelector('#nx-pause-list'); titleEl = el.querySelector('#nx-pause-title'); subEl = el.querySelector('#nx-pause-sub'); noteEl = el.querySelector('#nx-pause-note');
      el.addEventListener('mousedown', e => { if (e.target === el) close(); });

      // Botão Menu Flutuante (☰)
      const b = document.createElement('button'); b.id = 'nx-menu-btn'; b.className = 'nx-menu-btn'; b.title = 'Menu (Esc)'; b.textContent = '☰';
      b.addEventListener('click', () => { open ? close() : openMenu(); });
      document.getElementById('emulator-overlay').appendChild(b);

      // Regulador de Som Flutuante no Jogo (HUD Topo Direito)
      const vHud = document.createElement('div');
      vHud.id = 'nx-hud-volume';
      vHud.className = 'nx-hud-volume';
      vHud.innerHTML = `
        <button class="nx-hud-vol-btn" id="nx-hud-vol-btn" title="Mutar / Desmutar Som">
          <span class="material-icons-round" id="nx-hud-vol-icon">${muted || volume === 0 ? 'volume_off' : 'volume_up'}</span>
        </button>
        <div class="nx-hud-slider-wrap">
          <input type="range" id="nx-hud-vol-slider" min="0" max="100" value="${Math.round(volume * 100)}" title="Regulador de Volume do Jogo">
          <span id="nx-hud-vol-val">${Math.round(volume * 100)}%</span>
        </div>
      `;
      document.getElementById('emulator-overlay').appendChild(vHud);

      const hBtn = vHud.querySelector('#nx-hud-vol-btn');
      const hSlider = vHud.querySelector('#nx-hud-vol-slider');
      if (hBtn) hBtn.addEventListener('click', () => applyVolume(volume, true));
      if (hSlider) hSlider.addEventListener('input', (e) => applyVolume(parseInt(e.target.value, 10) / 100));

      // Controles na barra superior do emulador
      const topMute = document.getElementById('in-game-vol-mute');
      const topSlider = document.getElementById('in-game-volume-slider');
      if (topMute) topMute.addEventListener('click', () => applyVolume(volume, true));
      if (topSlider) topSlider.addEventListener('input', (e) => applyVolume(parseInt(e.target.value, 10) / 100));

      const h = document.createElement('div'); h.id = 'nx-game-hint'; h.className = 'nx-game-hint'; h.textContent = 'Pressione ESC para abrir o menu';
      document.getElementById('emulator-overlay').appendChild(h);
    }

    function mainItems() {
      const g = EmulatorManager.activeGame || {};
      return [
        { sec: 'Jogo' },
        { icon: '▶', label: 'Continuar', run: () => close() },
        { icon: '↺', label: 'Reiniciar jogo', run: () => { try { gm().restart(); } catch (e) {} close(); } },
        { icon: '💾', label: 'Salvar estado', run: () => { try { gm().quickSave(1); say('Estado salvo ✓'); } catch (e) { say('Não foi possível salvar'); } } },
        { icon: '📂', label: 'Carregar estado', run: () => { try { gm().quickLoad(1); say('Estado carregado ✓'); close(); } catch (e) { say('Nenhum estado salvo'); } } },
        { sec: 'Áudio e Vídeo' },
        { isVolumeRow: true },
        { icon: '⛶', label: document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia', run: () => { toggleFs(); setTimeout(render, 250); } },
        { icon: '👆', label: document.getElementById('emulator-overlay').classList.contains('clean-screen') ? 'Controles de toque: ocultos' : 'Controles de toque: visíveis',
          run: () => { const ov = document.getElementById('emulator-overlay'); EmulatorManager.cleanScreen = ov.classList.toggle('clean-screen'); render(); } },
        { sec: 'Sair' },
        { icon: '⏏', label: 'Voltar ao menu do Nexus', danger: true, run: () => { mode = 'confirm'; idx = 0; render(); } }
      ];
    }

    function confirmItems() {
      return [
        { icon: '💾', label: 'Salvar e voltar ao menu', run: () => { try { gm().quickSave(1); } catch (e) {} setTimeout(() => EmulatorManager.closeGame(), 350); } },
        { icon: '⏏', label: 'Voltar sem salvar', danger: true, run: () => EmulatorManager.closeGame() },
        { icon: '✕', label: 'Cancelar', run: () => { mode = 'main'; idx = 1; render(); } }
      ];
    }

    function render() {
      const g = EmulatorManager.activeGame || {};
      titleEl.textContent = mode === 'confirm' ? 'Voltar ao menu do Nexus?' : (g.title || 'Jogo');
      subEl.textContent = mode === 'confirm' ? 'O progresso não salvo será perdido.' : (g.console || '').toUpperCase();
      items = mode === 'confirm' ? confirmItems() : mainItems();
      if (!items[idx] || items[idx].sec) idx = items.findIndex(i => !i.sec);
      list.innerHTML = '';
      items.forEach((it, i) => {
        const d = document.createElement('div');
        if (it.sec) { d.className = 'nx-pause-sec'; d.textContent = it.sec; }
        else if (it.isVolumeRow) {
          d.className = 'nx-pause-item nx-pause-volume-row';
          const currentPct = Math.round((muted ? 0 : volume) * 100);
          const currentIco = muted || volume === 0 ? '🔇' : (volume > 0.5 ? '🔊' : '🔉');
          d.innerHTML = `
            <span class="i" style="font-size:20px;cursor:pointer;" title="Mutar / Desmutar">${currentIco}</span>
            <div style="flex:1;display:flex;align-items:center;gap:12px;">
              <span style="font-size:13px;font-weight:600;min-width:60px;">Volume</span>
              <input type="range" class="nx-pause-vol-slider" min="0" max="100" value="${currentPct}" style="flex:1;height:6px;accent-color:var(--accent,#3888ff);cursor:pointer;">
              <span class="nx-pause-vol-val" style="min-width:42px;text-align:right;font-size:13px;font-weight:700;color:var(--accent,#3888ff);">${muted ? 'MUDO' : currentPct + '%'}</span>
            </div>
          `;
          const s = d.querySelector('input');
          const spk = d.querySelector('.i');
          s.addEventListener('input', (e) => {
            applyVolume(parseInt(e.target.value, 10) / 100);
            d.querySelector('.nx-pause-vol-val').textContent = s.value + '%';
            d.querySelector('.i').textContent = s.value === '0' ? '🔇' : (parseInt(s.value, 10) > 50 ? '🔊' : '🔉');
          });
          spk.addEventListener('click', () => {
            applyVolume(volume, true);
            render();
          });
        }
        else {
          d.className = 'nx-pause-item' + (i === idx ? ' on' : '') + (it.danger ? ' danger' : '');
          d.innerHTML = '<span class="i"></span><span class="l"></span>'; d.firstChild.textContent = it.icon; d.lastChild.textContent = it.label;
          d.addEventListener('mouseenter', () => { if (idx !== i) { idx = i; mark(); NexusSound.hover(); } });
          d.addEventListener('click', () => { NexusSound.select(); it.run(); });
        }
        list.appendChild(d);
      });
    }

    function mark() { [...list.children].forEach((c, i) => c.classList.toggle('on', i === idx)); }
    function move(d) {
      let n = idx; do { n = (n + d + items.length) % items.length; } while (items[n].sec || items[n].isVolumeRow);
      idx = n; mark(); NexusSound.hover();
    }
    function openMenu() {
      if (open || !EmulatorManager.activeGame) return;
      if (!el) build();
      open = true; mode = 'main'; idx = 1; render(); el.classList.add('on');
      try { const e = emu(); e && e.pause && e.pause(); } catch (e) {}
      try { document.activeElement && document.activeElement.blur(); window.focus(); } catch (e) {}
      NexusSound.tab();
    }
    function close() {
      if (!open) return;
      open = false; el.classList.remove('on'); mode = 'main';
      try { const e = emu(); e && e.play && e.play(); frame().contentWindow.focus(); } catch (e) {}
      NexusSound.back();
    }
    function reset() { open = false; mode = 'main'; if (el) el.classList.remove('on'); }
    function key(e) {
      if (!EmulatorManager.activeGame) return;
      if (!open) { if (e.key === 'Escape') { e.preventDefault(); openMenu(); } return; }
      const k = e.key;
      if (['ArrowDown', 's', 'S'].includes(k)) move(1);
      else if (['ArrowUp', 'w', 'W'].includes(k)) move(-1);
      else if (k === 'Enter' || k === ' ') { NexusSound.select(); items[idx] && items[idx].run && items[idx].run(); }
      else if (k === 'Escape' || k === 'Backspace') { mode === 'confirm' ? (mode = 'main', idx = 1, render()) : close(); }
      else return;
      e.preventDefault(); e.stopPropagation();
    }
    document.addEventListener('keydown', key, true);
    // Esc é "consumido" pelo navegador ao sair da tela cheia: se isso acontecer durante o jogo, abre o menu
    document.addEventListener('fullscreenchange', () => {
      if (EmulatorManager.activeGame && EmulatorManager._fs && !document.fullscreenElement && !open) { EmulatorManager._fs = false; openMenu(); }
      else if (open) render();
    });
    // controle (gamepad): Select+Start abre o menu; no menu: D-pad/A/B
    let prev = [];
    (function pad() {
      const gp = (navigator.getGamepads ? navigator.getGamepads() : [])[0];
      if (gp && EmulatorManager.activeGame) {
        const p = i => !!(gp.buttons[i] && gp.buttons[i].pressed), edge = i => p(i) && !prev[i];
        if (!open) { if (p(8) && p(9) && !(prev[8] && prev[9])) openMenu(); }
        else {
          if (edge(13) || gp.axes[1] > 0.7 && !(prev.ay > 0.7)) move(1);
          if (edge(12) || gp.axes[1] < -0.7 && !(prev.ay < -0.7)) move(-1);
          if (edge(0)) { NexusSound.select(); items[idx] && items[idx].run(); }
          if (edge(1) || edge(9)) { mode === 'confirm' ? (mode = 'main', idx = 1, render()) : close(); }
        }
        prev = gp.buttons.map(b => b.pressed); prev.ay = gp.axes[1];
      } else prev = [];
      requestAnimationFrame(pad);
    })();
    return { open: openMenu, close, toggle: () => (open ? close() : openMenu()), reset, get isOpen() { return open; } };
  })();

  const EmulatorManager = {
    activeGame: null,
    pendingGame: null,
    db: null,
    cleanScreen: false,

    // Demonstrações jogáveis públicas inclusas para teste imediato (CORS liberado via jsdelivr)
    DEMO_ROMS: {
      'NES': 'https://cdn.jsdelivr.net/gh/bfirsh/jsnes/roms/croom/croom.nes',
      'SNES': 'https://cdn.jsdelivr.net/gh/snes9xgit/snes9x/gtk/data/test.smc',
      'Game Boy Advance': 'https://cdn.jsdelivr.net/gh/danproc/gba-roms/anguna.gba',
      'Game Boy': 'https://cdn.jsdelivr.net/gh/binji/binjgb/roms/tobudokai.gb',
      'Game Boy Color': 'https://cdn.jsdelivr.net/gh/binji/binjgb/roms/tobudokai.gb',
      'Mega Drive': 'https://cdn.jsdelivr.net/gh/bfirsh/jsnes/roms/croom/croom.nes'
    },

    // Mapeamento por console para o core do EmulatorJS
    CONSOLE_CORE_MAP: {
      'NES': 'nes',
      'SNES': 'snes',
      'Mega Drive': 'segaMD',
      'Master System': 'segaMS',
      'Game Boy': 'gb',
      'Game Boy Color': 'gbc',
      'Game Boy Advance': 'gba',
      'Nintendo 64': 'n64',
      'Nintendo DS': 'nds',
      'PlayStation': 'psx',
      'PSP': 'psp',
      'PS2': 'ps2', 'PlayStation 2': 'ps2', 'PS3': 'ps3', 'PlayStation 3': 'ps3', 'Xbox': 'xbox', 'Xbox Original': 'xbox',
      'GameCube': 'gamecube', 'Nintendo Wii': 'wii', 'Wii': 'wii',
      'Atari 2600': 'atari2600',
      'Arcade': 'arcade',
      'WonderSwan': 'ws',
      'Neo Geo Pocket': 'ngp',
      'Game Gear': 'segaGG'
    },

    async init() {
      await this.initDb();
      this.setupUI();
      this.setupFolderScan();
      this.setupDragAndDrop();
      await this.loadSavedGames();
    },

    initDb() {
      return new Promise((resolve) => {
        if (!window.indexedDB) return resolve(null);
        try {
          const req = indexedDB.open('nexus_roms_db', 1);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('games')) {
              db.createObjectStore('games', { keyPath: 'id' });
            }
          };
          req.onsuccess = (e) => {
            this.db = e.target.result;
            resolve(this.db);
          };
          req.onerror = () => resolve(null);
        } catch (err) {
          resolve(null);
        }
      });
    },

    saveGameToDb(gameData) {
      return new Promise((resolve) => {
        if (!this.db) return resolve();
        try {
          const tx = this.db.transaction('games', 'readwrite');
          tx.objectStore('games').put(gameData);
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch (e) {
          resolve();
        }
      });
    },

    getAllSavedGames() {
      return new Promise((resolve) => {
        if (!this.db) return resolve([]);
        try {
          const tx = this.db.transaction('games', 'readonly');
          const req = tx.objectStore('games').getAll();
          req.onsuccess = (e) => resolve(e.target.result || []);
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
    },

    async loadSavedGames() {
      try {
        const saved = await this.getAllSavedGames();
        if (saved && saved.length > 0) {
          saved.forEach(g => {
            if (!GAMES_DB.find(ex => ex.id === g.id)) {
              GAMES_DB.unshift(g);
            }
          });
          UI.renderLibrary();
        }
      } catch (err) {
        console.warn('Erro ao carregar jogos salvos:', err);
      }
    },

    async expandFiles(files) {
      const out = [];
      for (const f of files) {
        if (extOf(f.name) !== 'zip') { out.push(f); continue; }
        try {
          const es = (await zipEntries(f)).filter(e => !e.name.endsWith('/') && ROM_EXTS.includes(extOf(e.name)) && !['pbp','a26','ws','wsc','ngp','ngc'].includes('') );
          if (!es.length) { out.push(f); continue; } // zip sem ROM conhecida = jogo de Arcade
          for (const e of es) out.push(new File([await zipExtract(f, e)], e.name.split('/').pop()));
        } catch (err) { console.warn('zip ilegível', f.name, err); out.push(f); }
      }
      const hasDisc = out.some(f => ['bin', 'iso', 'chd'].includes(extOf(f.name)));
      return hasDisc ? out.filter(f => extOf(f.name) !== 'cue') : out;
    },

    async detectFile(file) {
      const ext = extOf(file.name);
      if (['iso', 'img', 'bin', 'chd', 'pkg', 'xbe', 'gcz', 'rvz', 'wbfs', 'gcm', 'ciso', 'wad', 'dol'].includes(ext)) {
        let sys = null;
        try { sys = await detectDisc(file.name, file); } catch (e) {}
        if (!sys) sys = 'ps2';

        const consoleMap = {
          ps2: 'PlayStation 2',
          ps3: 'PlayStation 3',
          xbox: 'Xbox Original',
          gamecube: 'GameCube',
          wii: 'Nintendo Wii',
          psp: 'PSP',
          psx: 'PlayStation 1',
          segaMD: 'Mega Drive'
        };

        const isNative = ['ps2', 'ps3', 'xbox', 'gamecube', 'wii'].includes(sys);
        return {
          valid: true,
          system: sys,
          console: consoleMap[sys] || 'PlayStation 2',
          format: '.' + ext,
          native: isNative
        };
      }
      return this.validateFile(file.name);
    },

    setupFolderScan() {
      const b = document.getElementById('btn-load-rom'); if (!b) return;
      const ri = document.getElementById('rom-file-input'); if (ri) ri.removeAttribute('accept');
      const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.style.display = 'none';
      i.setAttribute('webkitdirectory', ''); i.setAttribute('directory', ''); document.body.appendChild(i);
      const nb = b.cloneNode(false); nb.id = 'btn-scan-folder';
      nb.innerHTML = '<span class="material-icons-round">folder_open</span> Escanear Pasta';
      b.insertAdjacentElement('afterend', nb);
      nb.addEventListener('click', () => { NexusSound.select(); i.click(); });
      i.addEventListener('change', e => { this.handleFiles(Array.from(e.target.files)); i.value = ''; });
    },

    validateFile(name) {
      const ext = name.split('.').pop().toLowerCase();
      if (['7z', 'rar'].includes(ext)) {
        return { valid: false, error: '7z' };
      }
      const EXT_MAP = {
        'nes': { system: 'nes', console: 'NES', format: '.nes' },
        'sfc': { system: 'snes', console: 'SNES', format: '.sfc' },
        'smc': { system: 'snes', console: 'SNES', format: '.smc' },
        'gba': { system: 'gba', console: 'Game Boy Advance', format: '.gba' },
        'gbc': { system: 'gbc', console: 'Game Boy Color', format: '.gbc' },
        'gb': { system: 'gb', console: 'Game Boy', format: '.gb' },
        'nds': { system: 'nds', console: 'Nintendo DS', format: '.nds' },
        'n64': { system: 'n64', console: 'Nintendo 64', format: '.n64' },
        'z64': { system: 'n64', console: 'Nintendo 64', format: '.z64' },
        'iso': { system: 'psx', console: 'PlayStation', format: '.iso' },
        'cso': { system: 'psp', console: 'PSP', format: '.cso' },
        'bin': { system: 'psx', console: 'PlayStation', format: '.bin' },
        'cue': { system: 'psx', console: 'PlayStation', format: '.cue' },
        'chd': { system: 'psx', console: 'PlayStation', format: '.chd' },
        'pbp': { system: 'psx', console: 'PlayStation', format: '.pbp' },
        'md': { system: 'segaMD', console: 'Mega Drive', format: '.md' },
        'gen': { system: 'segaMD', console: 'Mega Drive', format: '.gen' },
        'smd': { system: 'segaMD', console: 'Mega Drive', format: '.smd' },
        'sms': { system: 'segaMS', console: 'Master System', format: '.sms' },
        'gg': { system: 'segaGG', console: 'Game Gear', format: '.gg' },
        'a26': { system: 'atari2600', console: 'Atari 2600', format: '.a26' },
        'ws': { system: 'ws', console: 'WonderSwan', format: '.ws' },
        'wsc': { system: 'ws', console: 'WonderSwan', format: '.wsc' },
        'ngp': { system: 'ngp', console: 'Neo Geo Pocket', format: '.ngp' },
        'ngc': { system: 'ngp', console: 'Neo Geo Pocket', format: '.ngc' },
        'zip': { system: 'arcade', console: 'Arcade', format: '.zip' }
      };
      if (EXT_MAP[ext]) return { valid: true, ...EXT_MAP[ext] };
      return { valid: false, error: 'unknown' };
    },

    cleanTitle(name) {
      const base = name.substring(0, name.lastIndexOf('.')) || name;
      return base.replace(/_/g, ' ')
                 .replace(/\(.*?\)/g, '')
                 .replace(/\[.*?\]/g, '')
                 .replace(/v[0-9].*?$/i, '')
                 .trim();
    },

    async handleFiles(files) {
      if (!files || files.length === 0) return;
      let firstGameToLaunch = null, imported = 0;
      files = await this.expandFiles(files);
      const many = files.length > 1;

      for (const file of files) {
        const check = await this.detectFile(file);
        if (!check.valid) {
          if (check.error === 'native') { if (!many) alert('PS2, PS3 e Xbox só rodam no programa do PC (Nexus Egy para Windows).'); continue; }
          if (check.error === 'disc') { if (!many) alert('Disco não reconhecido (aceito: PS1, PS2, PS3, PSP e Xbox).'); continue; }
          if (many && check.error !== '7z') continue;
          if (check.error === '7z') {
            alert(`O arquivo "${file.name}" está compactado (.7z ou .rar).\n\nPara rodar no Nexus Egy, descompacte o arquivo no seu computador e selecione o arquivo extraído (ex: .iso, .nds, .gba, .sfc).`);
          } else {
            alert(`Formato de "${file.name}" não reconhecido.\nFormatos suportados: .nes, .sfc, .gba, .nds, .n64, .iso, .bin, .md, .sms e outros.`);
          }
          continue;
        }

        const title = this.cleanTitle(file.name);
        const gameId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const gameData = {
          id: gameId,
          title: title,
          console: check.console,
          system: check.system,
          year: new Date().getFullYear().toString(),
          genre: 'Jogo Carregado',
          format: check.format,
          color: '#2979ff',
          desc: `Arquivo: ${file.name} (${(file.size / (1024*1024)).toFixed(1)} MB). Carregado pelo usuário.`,
          fileBlob: check.native ? undefined : file, nativePath: check.native ? window.nexusNative.pathOf(file) : undefined,
          userLoaded: true
        };

        try {
          await this.saveGameToDb({
            id: gameId,
            title: title,
            console: check.console,
            system: check.system,
            year: gameData.year,
            genre: gameData.genre,
            format: check.format,
            color: gameData.color,
            desc: gameData.desc,
            fileBlob: check.native ? undefined : file, nativePath: check.native ? window.nexusNative.pathOf(file) : undefined,
            userLoaded: true
          });
        } catch (err) {
          console.warn('Erro ao salvar no IndexedDB:', err);
        }

        GAMES_DB.unshift(gameData); imported++;
        if (!firstGameToLaunch) {
          firstGameToLaunch = gameData;
        }
      }

      UI.renderLibrary();
      if (firstGameToLaunch && imported === 1) {
        this.launchGame(firstGameToLaunch);
      }
    },

    setupUI() {
      // Botão + Carregar Jogo na Biblioteca
      const btnLoadRom = document.getElementById('btn-load-rom');
      const romInput = document.getElementById('rom-file-input');
      if (btnLoadRom && romInput) {
        btnLoadRom.addEventListener('click', () => {
          NexusSound.select();
          romInput.click();
        });
        romInput.addEventListener('change', (e) => {
          this.handleFiles(Array.from(e.target.files));
          romInput.value = '';
        });
      }

      // Modal de Escolha de ROM
      const romPickerModal = document.getElementById('rom-picker-modal');
      const romPickerClose = document.getElementById('rom-picker-close');
      const btnChoiceLocal = document.getElementById('btn-choice-local');
      const gameDetailRomInput = document.getElementById('game-detail-rom-input');
      const btnChoiceDemo = document.getElementById('btn-choice-demo');
      const btnChoiceStore = document.getElementById('btn-choice-store');

      if (romPickerClose && romPickerModal) {
        romPickerClose.addEventListener('click', () => {
          romPickerModal.classList.remove('active');
          NexusSound.back();
        });
        romPickerModal.addEventListener('click', (e) => {
          if (e.target === romPickerModal) {
            romPickerModal.classList.remove('active');
            NexusSound.back();
          }
        });
      }

      if (btnChoiceLocal && gameDetailRomInput) {
        btnChoiceLocal.addEventListener('click', () => {
          NexusSound.select();
          gameDetailRomInput.click();
        });
        gameDetailRomInput.addEventListener('change', (e) => {
          if (romPickerModal) romPickerModal.classList.remove('active');
          this.handleFiles(Array.from(e.target.files));
          gameDetailRomInput.value = '';
        });
      }

      if (btnChoiceDemo) {
        btnChoiceDemo.addEventListener('click', () => {
          if (romPickerModal) romPickerModal.classList.remove('active');
          if (!this.pendingGame) return;
          const demoUrl = this.DEMO_ROMS[this.pendingGame.console] || this.DEMO_ROMS['NES'];
          this.launchGame({
            ...this.pendingGame,
            romUrl: demoUrl,
            system: this.CONSOLE_CORE_MAP[this.pendingGame.console] || 'nes'
          });
        });
      }

      if (btnChoiceStore) {
        btnChoiceStore.addEventListener('click', () => {
          if (romPickerModal) romPickerModal.classList.remove('active');
          UI.switchSection('store');
        });
      }

      // Controles do Overlay do Emulador
      const btnClean = document.getElementById('btn-clean-screen');
      const overlay = document.getElementById('emulator-overlay');
      if (btnClean && overlay) {
        btnClean.addEventListener('click', () => {
          this.cleanScreen = !this.cleanScreen;
          overlay.classList.toggle('clean-screen', this.cleanScreen);
          const st = document.getElementById('clean-screen-status');
          if (st) st.textContent = this.cleanScreen ? 'Tela Limpa (Ativa)' : 'Controles Virtuais';
          NexusSound.select();
        });
      }

      const btnFullscreen = document.getElementById('btn-fullscreen-toggle');
      if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
          NexusSound.select();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        });
      }

      const btnExit = document.getElementById('btn-exit-game');
      if (btnExit) {
        btnExit.addEventListener('click', () => {
          NexusSound.back();
          this.exitGame();
        });
      }
    },

    setupDragAndDrop() {
      window.addEventListener('dragover', (e) => e.preventDefault());
      window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          NexusSound.select();
          this.handleFiles(Array.from(e.dataTransfer.files));
        }
      });
    },

    handlePlayRequest(game) {
      if (game.fileBlob || game.romUrl || game.nativePath) {
        this.launchGame(game);
        return;
      }
      this.pendingGame = game;
      const modal = document.getElementById('rom-picker-modal');
      const title = document.getElementById('rom-picker-title');
      const hint = document.getElementById('rom-choice-format-hint');
      if (title) title.textContent = `Iniciar ${game.title}`;
      if (hint) hint.textContent = `Selecione arquivo ${game.format} no seu PC ou celular`;
      const fileInput = document.getElementById('game-detail-rom-input');
      if (fileInput) fileInput.accept = `${game.format},.zip,.bin`;
      if (modal) modal.classList.add('active');
    },

    launchGame(game) { if (this.launchIfNative(game)) return;
      if (this.activeGame) this.closeGame(true);
      this.activeGame = game;
      NexusSound.boot();

      const overlay = document.getElementById('emulator-overlay');
      const titleEl = document.getElementById('emulator-game-title');
      const consoleEl = document.getElementById('emulator-game-console');
      const target = document.getElementById('emulator-target');
      if (titleEl) titleEl.textContent = game.title;
      if (consoleEl) consoleEl.textContent = (game.console || 'RETRO').toUpperCase();
      if (overlay) overlay.classList.add('active', 'immersive');
      NexusPause.reset();

      const sys = game.system || this.CONSOLE_CORE_MAP[game.console] || 'nes';
      const core = CORE_OF[sys] || sys;
      if (sys === 'psp' && !window.crossOriginIsolated) alert('O PSP só roda no programa do PC (o Android/navegador comum não libera os recursos que ele precisa).');
      this._blobUrl = game.fileBlob ? URL.createObjectURL(game.fileBlob) : '';
      const cfg = { gameUrl: game.romUrl || this._blobUrl, system: core, gameName: game.title, romName: (game.fileBlob && game.fileBlob.name) || '' };

      // tela cheia ao entrar no jogo (o Esc devolve o menu do Nexus)
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen({ navigationUI: 'hide' }).then(() => {
          this._fs = true;
          if (navigator.keyboard && navigator.keyboard.lock) navigator.keyboard.lock(['Escape']).catch(() => {});
        }).catch(() => {});
      } catch (e) {}

      // emulador em moldura própria: ao sair, ela é removida e tudo é destruído, sem recarregar o Nexus
      if (target) {
        target.innerHTML = '';
        const f = document.createElement('iframe');
        f.id = 'nexus-game-frame'; f.src = 'emulator-frame.html'; f.setAttribute('allow', 'autoplay; fullscreen; gamepad; cross-origin-isolated');
        f.onload = () => { const fail = err => alert('Não foi possível iniciar o emulador.' + (err ? '\n\nMotivo: ' + (err.message || err) : '')); try { f.contentWindow.nexusStart(cfg).catch(fail); } catch (e) { fail(e); } };
        target.appendChild(f);
      }
      const hint = document.getElementById('nx-game-hint');
      if (hint) { hint.classList.remove('show'); void hint.offsetWidth; hint.classList.add('show'); }
    },

    launchIfNative(game) {
      const sys = game.system || this.CONSOLE_CORE_MAP[game.console];
      if (game.nativePath || ['ps2', 'ps3', 'xbox', 'gamecube', 'wii'].includes(sys)) { this.launchNative(game, sys); return true; }
      return false;
    },

    async launchNative(game, sys) {
      const nn = window.nexusNative;
      let path = game.nativePath || game.filePath || (game.fileBlob && game.fileBlob.path) || '';

      if (!path) {
        path = prompt(`Para iniciar ${game.title} no emulador de ${(game.console || sys).toUpperCase()}:\n\nInforme o caminho do arquivo no seu computador:\n(Exemplo: C:\\Jogos\\${game.title || 'jogo'}.iso)`, `C:\\Jogos\\${game.title || 'jogo'}.iso`);
        if (!path) return;
      }

      NexusSound.boot();

      if (nn) {
        const r = await nn.launch(sys, path);
        if (!r.ok) alert(r.error);
      } else {
        // Suporte para quando rodando pelo servidor local Python (serve.py)
        try {
          const res = await fetch(`/api/launch?system=${encodeURIComponent(sys)}&rom=${encodeURIComponent(path)}`);
          const data = await res.json();
          if (!data.ok) alert(data.error);
        } catch (e) {
          alert('Erro ao iniciar emulador nativo: ' + e.message);
        }
      }
    },

    closeGame(silent) {
      const overlay = document.getElementById('emulator-overlay');
      const target = document.getElementById('emulator-target');
      const f = document.getElementById('nexus-game-frame');
      if (f) { try { f.contentWindow.EJS_emulator && f.contentWindow.EJS_emulator.pause && f.contentWindow.EJS_emulator.pause(); } catch (e) {} f.src = 'about:blank'; }
      if (target) target.innerHTML = '';
      if (this._blobUrl) { URL.revokeObjectURL(this._blobUrl); this._blobUrl = ''; }
      if (overlay) overlay.classList.remove('active', 'immersive', 'clean-screen');
      this.activeGame = null; this._fs = false; this.cleanScreen = false;
      NexusPause.reset();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      try { if (navigator.keyboard && navigator.keyboard.unlock) navigator.keyboard.unlock(); } catch (e) {}
      if (!silent) NexusSound.back();
      window.focus();
    },

    exitGame() { NexusPause.open(); }
  };

  // ====== UI CONTROLLER ======
  const UI = {
    currentSection: 'home',
    activeConsoleFilter: null,

    init() {
      ThemeManager.init();
      ProfileManager.init();
      I18nManager.init();
      EmulatorManager.init();

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
          const gameConsole = (g.console || '').toLowerCase();
          const defId = (consoleDef.id || '').toLowerCase();
          return consoleName.includes(gameConsole) || 
                 gameConsole.includes(consoleName) || 
                 gameConsole.includes(defId) ||
                 defId.includes(gameConsole) ||
                 (defId === 'ps2' && (gameConsole === 'ps2' || gameConsole.includes('playstation 2'))) ||
                 (defId === 'ps3' && (gameConsole === 'ps3' || gameConsole.includes('playstation 3'))) ||
                 (defId === 'ps1' && (gameConsole === 'ps1' || gameConsole.includes('playstation'))) ||
                 (defId === 'xbox' && gameConsole.includes('xbox')) ||
                 (defId === 'gamecube' && (gameConsole.includes('gamecube') || gameConsole.includes('ngc'))) ||
                 (defId === 'wii' && gameConsole.includes('wii'));
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
      grid.innerHTML = '';
      GAMES_DB.forEach(g => grid.appendChild(this.createGameCard(g)));
      if (this._libBound) return; this._libBound = true;

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
      if (!grid) return;
      grid.innerHTML = '';
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
          <div class="console-detail-info">${c.era} · ${c.year} · Tier ${c.tier}${c.emulator ? ` · <b style="color:var(--accent2);">${c.emulator}</b>` : ''}</div>
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
      const playBtn = document.getElementById('modal-play');

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          NexusSound.select();
          if (this.selectedGame) {
            modal.classList.remove('active');
            EmulatorManager.handlePlayRequest(this.selectedGame);
          }
        });
      }

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
      this.selectedGame = game;
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
    // -- Search (Busca Global de Jogos, Consoles e Configurações) --
    setupSearch() {
      const input = document.getElementById('search-input');
      const results = document.getElementById('search-results');
      const globalInput = document.getElementById('global-search-input');
      const globalClear = document.getElementById('global-search-clear');

      const performSearch = (query) => {
        if (!results) return;
        results.innerHTML = '';

        if (query.length < 2) {
          results.innerHTML = `<p class="search-hint">${I18nManager.t('search_hint') || 'Digite o nome do jogo, console ou configuração...'}</p>`;
          return;
        }

        // 1. Busca em Jogos
        const matchedGames = GAMES_DB.filter(g =>
          g.title.toLowerCase().includes(query) ||
          g.console.toLowerCase().includes(query) ||
          (g.genre && g.genre.toLowerCase().includes(query)) ||
          (g.year && g.year.includes(query))
        );

        // 2. Busca em Consoles
        const matchedConsoles = CONSOLES_DB.filter(c =>
          c.name.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query) ||
          c.era.toLowerCase().includes(query)
        );

        // 3. Busca em Configurações
        const settingsTerms = [
          { name: 'Tema e Cores da Interface', key: 'theme', icon: 'palette', desc: 'Mude as cores de destaque e iluminação azul do PS5' },
          { name: 'Perfil e Avatar do Jogador', key: 'profile', icon: 'account_circle', desc: 'Altere seu nome de jogador e foto de avatar' },
          { name: 'Idioma do Sistema (PT-BR, EN, ES, JA)', key: 'language', icon: 'translate', desc: 'Altere a linguagem da interface' },
          { name: 'Áudio e Sons Sintetizados do PS5', key: 'audio', icon: 'volume_up', desc: 'Ajuste o volume dos efeitos acústicos de navegação' },
          { name: 'Emuladores Pesados (PCSX2, RPCS3, Xemu)', key: 'emulators', icon: 'sports_esports', desc: 'Gerencie pastas e configurações no config.json' }
        ];
        const matchedSettings = settingsTerms.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.desc.toLowerCase().includes(query) ||
          s.key.toLowerCase().includes(query)
        );

        if (matchedGames.length === 0 && matchedConsoles.length === 0 && matchedSettings.length === 0) {
          results.innerHTML = `<p class="search-hint">Nenhum resultado encontrado para "${query}".</p>`;
          return;
        }

        // Renderiza Jogos
        if (matchedGames.length > 0) {
          const h = document.createElement('h3');
          h.className = 'section-subtitle';
          h.style.cssText = 'margin:12px 0;font-size:16px;color:#fff;display:flex;align-items:center;gap:8px;';
          h.innerHTML = `<span class="material-icons-round" style="color:var(--accent)">sports_esports</span> Jogos Encontrados (${matchedGames.length})`;
          results.appendChild(h);

          const grid = document.createElement('div');
          grid.className = 'library-grid';
          matchedGames.forEach(g => grid.appendChild(this.createGameCard(g)));
          results.appendChild(grid);
        }

        // Renderiza Consoles
        if (matchedConsoles.length > 0) {
          const ch = document.createElement('h3');
          ch.className = 'section-subtitle';
          ch.style.cssText = 'margin:24px 0 12px;font-size:16px;color:#fff;display:flex;align-items:center;gap:8px;';
          ch.innerHTML = `<span class="material-icons-round" style="color:var(--accent)">videogame_asset</span> Consoles (${matchedConsoles.length})`;
          results.appendChild(ch);

          const cGrid = document.createElement('div');
          cGrid.className = 'consoles-grid';
          matchedConsoles.forEach(c => {
            const card = document.createElement('div');
            card.className = 'console-card-3d';
            card.innerHTML = `
              <div class="console-card-header">
                <span class="console-icon">${c.icon}</span>
                <span class="console-name">${c.name}</span>
              </div>
              <p class="console-era">${c.era} (${c.year})</p>
              <button class="btn btn-primary" style="margin-top:10px;width:100%;font-size:12px;">Ver Jogos</button>
            `;
            card.addEventListener('click', () => {
              NexusSound.select();
              UI.switchSection('library');
              UI.activeConsoleFilter = c.name;
              UI.renderLibrary();
            });
            cGrid.appendChild(card);
          });
          results.appendChild(cGrid);
        }

        // Renderiza Configurações
        if (matchedSettings.length > 0) {
          const sh = document.createElement('h3');
          sh.className = 'section-subtitle';
          sh.style.cssText = 'margin:24px 0 12px;font-size:16px;color:#fff;display:flex;align-items:center;gap:8px;';
          sh.innerHTML = `<span class="material-icons-round" style="color:var(--accent)">settings</span> Configurações (${matchedSettings.length})`;
          results.appendChild(sh);

          const sList = document.createElement('div');
          sList.style.display = 'flex';
          sList.style.flexDirection = 'column';
          sList.style.gap = '10px';

          matchedSettings.forEach(s => {
            const item = document.createElement('div');
            item.style.cssText = 'display:flex;align-items:center;gap:14px;padding:14px 20px;background:rgba(15,28,60,0.6);border:1px solid rgba(56,136,255,0.2);border-radius:12px;cursor:pointer;transition:all 0.2s ease;';
            item.innerHTML = `
              <span class="material-icons-round" style="font-size:24px;color:var(--accent);">${s.icon}</span>
              <div style="flex:1;">
                <div style="font-weight:600;font-size:14px;color:#fff;">${s.name}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6);">${s.desc}</div>
              </div>
              <span class="material-icons-round" style="color:rgba(255,255,255,0.4);">arrow_forward</span>
            `;
            item.addEventListener('mouseenter', () => { item.style.borderColor = 'var(--accent)'; item.style.transform = 'translateX(4px)'; });
            item.addEventListener('mouseleave', () => { item.style.borderColor = 'rgba(56,136,255,0.2)'; item.style.transform = 'none'; });
            item.addEventListener('click', () => {
              NexusSound.select();
              UI.switchSection('settings');
            });
            sList.appendChild(item);
          });
          results.appendChild(sList);
        }
      };

      if (input) {
        input.addEventListener('input', () => {
          const q = input.value.toLowerCase().trim();
          if (globalInput && globalInput.value !== input.value) globalInput.value = input.value;
          if (globalClear) globalClear.style.display = q ? 'flex' : 'none';
          performSearch(q);
        });
      }

      if (globalInput) {
        globalInput.addEventListener('input', () => {
          const q = globalInput.value.toLowerCase().trim();
          if (globalClear) globalClear.style.display = q ? 'flex' : 'none';
          if (input && input.value !== globalInput.value) input.value = globalInput.value;
          if (UI.currentSection !== 'search') UI.switchSection('search');
          performSearch(q);
        });

        globalInput.addEventListener('focus', () => {
          if (UI.currentSection !== 'search') UI.switchSection('search');
          if (globalInput.value.trim().length >= 2) performSearch(globalInput.value.toLowerCase().trim());
        });
      }

      if (globalClear) {
        globalClear.addEventListener('click', () => {
          NexusSound.back();
          if (globalInput) globalInput.value = '';
          if (input) input.value = '';
          globalClear.style.display = 'none';
          results.innerHTML = `<p class="search-hint">${I18nManager.t('search_hint') || 'Digite o nome do jogo, console ou configuração...'}</p>`;
        });
      }
    },

    // -- PS5 Flowing Silk Ribbons & Atmospheric Waves --
    setupBgParticles() {
      const canvas = document.getElementById('bg-particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let width, height;
      let time = 0;

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      // Definição das Ondas Suaves Estilo PS5 (Silky Ribbons)
      const waves = [
        { amp: 65, freq: 0.0016, speed: 0.006, yRatio: 0.38, color: 'rgba(56, 136, 255, 0.28)', width: 2.2, fill: 'rgba(20, 65, 150, 0.025)' },
        { amp: 85, freq: 0.0012, speed: 0.004, yRatio: 0.47, color: 'rgba(0, 229, 255, 0.20)', width: 1.8, fill: 'rgba(10, 40, 100, 0.02)' },
        { amp: 105, freq: 0.0009, speed: 0.007, yRatio: 0.56, color: 'rgba(80, 160, 255, 0.16)', width: 2.5, fill: 'rgba(15, 50, 120, 0.02)' },
        { amp: 55, freq: 0.0020, speed: 0.009, yRatio: 0.65, color: 'rgba(130, 85, 255, 0.14)', width: 1.5, fill: null },
        { amp: 75, freq: 0.0014, speed: 0.005, yRatio: 0.73, color: 'rgba(30, 105, 215, 0.22)', width: 2.0, fill: 'rgba(8, 25, 75, 0.02)' }
      ];

      // Partículas luminosas suaves flutuando
      const particles = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (width || 1280),
          y: Math.random() * (height || 720),
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18 - 0.05,
          size: Math.random() * 2 + 0.6,
          opacity: Math.random() * 0.35 + 0.08,
          hue: Math.random() > 0.5 ? 212 : 196
        });
      }

      function draw() {
        time += 1;
        ctx.clearRect(0, 0, width, height);

        // Desenhar Ondas Suaves do PS5
        for (const w of waves) {
          const baseY = height * w.yRatio;
          ctx.beginPath();
          ctx.moveTo(0, baseY);

          for (let x = 0; x <= width; x += 6) {
            const y = baseY + 
              Math.sin(x * w.freq + time * w.speed) * w.amp + 
              Math.cos(x * w.freq * 0.5 + time * (w.speed * 0.7)) * (w.amp * 0.35);
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = w.color;
          ctx.lineWidth = w.width;
          ctx.stroke();

          if (w.fill) {
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = w.fill;
            ctx.fill();
          }
        }

        // Desenhar partículas flutuantes
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, 0.4)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
      }

      draw();
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

  return { UI, HWAnalyzer, ThemeManager, ProfileManager, I18nManager, EmulatorManager, GAMES_DB, CONSOLES_DB };
})();
