/**
 * HeavyEmuLauncher.js
 * Módulo de Process Spawning para emuladores standalone pesados (PS2, PS3, Xbox, Xbox 360, GameCube, Wii, Wii U, 3DS, etc.).
 * Gerencia ciclo de vida, flags de tela cheia/kiosk e carregamento dinâmico com auto-detecção prioritária.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class HeavyEmuLauncher {
  constructor() {
    this.configPath = path.join(__dirname, 'config.json');
    this.activeProcess = null;
    this.activeGameInfo = null;
    this.onProcessExit = null;
  }

  /**
   * Configura arquivos portáteis dos emuladores para iniciar DIRETO em TELA CHEIA (Fullscreen),
   * sem abrir a janela/interface do emulador primeiro.
   */
  ensureDirectFullscreenConfig(platformKey, exePath) {
    try {
      const emuDir = path.dirname(exePath);
      const key = (platformKey || '').toLowerCase();

      // 1. DOLPHIN (GameCube / Wii)
      if (key.includes('dolphin') || key.includes('wii') || key.includes('gamecube') || key.includes('ngc')) {
        const portableFile = path.join(emuDir, 'portable.txt');
        if (!fs.existsSync(portableFile)) {
          fs.writeFileSync(portableFile, '', 'utf8');
        }

        const userConfigDir = path.join(emuDir, 'User', 'Config');
        if (!fs.existsSync(userConfigDir)) {
          fs.mkdirSync(userConfigDir, { recursive: true });
        }

        const iniPath = path.join(userConfigDir, 'Dolphin.ini');
        let iniContent = '';
        if (fs.existsSync(iniPath)) {
          iniContent = fs.readFileSync(iniPath, 'utf8');
        }

        if (!iniContent.includes('[Display]')) iniContent += '\n[Display]\n';
        if (iniContent.includes('Fullscreen = False')) {
          iniContent = iniContent.replace(/Fullscreen\s*=\s*False/gi, 'Fullscreen = True');
        } else if (!iniContent.includes('Fullscreen = True')) {
          iniContent = iniContent.replace('[Display]', '[Display]\nFullscreen = True\nRenderToMain = False\n');
        }

        if (!iniContent.includes('[Interface]')) iniContent += '\n[Interface]\n';
        if (!iniContent.includes('ConfirmStop = False')) {
          iniContent = iniContent.replace('[Interface]', '[Interface]\nConfirmStop = False\nUsePanicHandlers = False\nHideCursor = True\n');
        }

        fs.writeFileSync(iniPath, iniContent.trim() + '\n', 'utf8');
      }

      // 2. PCSX2 (PlayStation 2)
      if (key.includes('ps2') || key.includes('playstation 2')) {
        const portableFile = path.join(emuDir, 'portable.ini');
        if (!fs.existsSync(portableFile)) {
          fs.writeFileSync(portableFile, '', 'utf8');
        }

        const inisDir = path.join(emuDir, 'inis');
        if (!fs.existsSync(inisDir)) {
          fs.mkdirSync(inisDir, { recursive: true });
        }

        const pcsx2Ini = path.join(inisDir, 'PCSX2.ini');
        let pcsx2Content = '';
        if (fs.existsSync(pcsx2Ini)) {
          pcsx2Content = fs.readFileSync(pcsx2Ini, 'utf8');
        }

        if (!pcsx2Content.includes('[UI]')) pcsx2Content += '\n[UI]\n';
        if (!pcsx2Content.includes('StartFullscreen = true')) {
          pcsx2Content = pcsx2Content.replace('[UI]', '[UI]\nStartFullscreen = true\nConfirmShutdown = false\nInhibitScreensaver = true\nHideMouseCursor = true\n');
        }

        fs.writeFileSync(pcsx2Ini, pcsx2Content.trim() + '\n', 'utf8');
      }

      // 3. XEMU (Xbox Original)
      if (key.includes('xemu') || (key.includes('xbox') && !key.includes('360'))) {
        const xemuToml = path.join(emuDir, 'xemu.toml');
        let tomlContent = '';
        if (fs.existsSync(xemuToml)) {
          tomlContent = fs.readFileSync(xemuToml, 'utf8');
        } else {
          tomlContent = '[general]\nshow_welcome = false\n[display.window]\nfullscreen = true\n';
        }

        if (tomlContent.includes('fullscreen = false')) {
          tomlContent = tomlContent.replace('fullscreen = false', 'fullscreen = true');
        }

        fs.writeFileSync(xemuToml, tomlContent, 'utf8');
      }

      // 4. XENIA (Xbox 360)
      if (key.includes('360') || key.includes('xenia')) {
        const xeniaConfig = path.join(emuDir, 'xenia-canary.config.toml');
        if (fs.existsSync(xeniaConfig)) {
          let c = fs.readFileSync(xeniaConfig, 'utf8');
          if (c.includes('fullscreen = false')) {
            c = c.replace('fullscreen = false', 'fullscreen = true');
            fs.writeFileSync(xeniaConfig, c, 'utf8');
          }
        }
      }
    } catch (err) {
      console.warn('[HeavyEmuLauncher] Aviso ao configurar flags de tela cheia:', err.message);
    }
  }

  /**
   * Carrega a configuração dinâmica do config.json com fallback e suporte a AppData
   */
  loadConfig() {
    let baseConfig = null;
    try {
      if (fs.existsSync(this.configPath)) {
        baseConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (err) {
      console.warn('[HeavyEmuLauncher] Falha ao ler config.json:', err.message);
    }

    if (!baseConfig || !baseConfig.emulators) {
      baseConfig = { emulators: {} };
    }

    // Leitura opcional de emulators.json em AppData/Roaming/nexus-egy
    try {
      const home = process.env.USERPROFILE || 'C:\\Users\\colos';
      const roamingEmu = path.join(home, 'AppData', 'Roaming', 'nexus-egy', 'emulators.json');
      if (fs.existsSync(roamingEmu)) {
        const customMap = JSON.parse(fs.readFileSync(roamingEmu, 'utf8'));
        for (const [k, p] of Object.entries(customMap)) {
          if (p && fs.existsSync(p)) {
            if (!baseConfig.emulators[k]) baseConfig.emulators[k] = {};
            baseConfig.emulators[k].path = p;
          }
        }
      }
    } catch (e) {}

    return baseConfig;
  }

  /**
   * Resolve o executável em TODAS as pastas possíveis do sistema,
   * garantindo que NENHUM emulador deixe de ser encontrado.
   */
  resolveExecutable(rawPath, platformKey) {
    const key = (platformKey || '').toLowerCase();

    const candidates = {
      ps2: {
        dirs: ['pcsx2', 'PCSX2', 'pcsx2-qt', 'pcsx2-v2.9.179-windows-x64-Qt', 'PlayStation 2'],
        exes: ['pcsx2-qt.exe', 'pcsx2.exe', 'pcsx2-qtx64.exe', 'pcsx2-avx2.exe']
      },
      ps3: {
        dirs: ['rpcs3', 'RPCS3', 'rpcs3-v0.0.43-20604-05a9d960_win64_msvc', 'PlayStation 3'],
        exes: ['rpcs3.exe']
      },
      xbox: {
        dirs: ['xemu', 'Xemu', 'xemu-0.8.139-windows-x86_64', 'Xbox', 'Xbox Original'],
        exes: ['xemu.exe']
      },
      xbox360: {
        dirs: ['Xbox 360', 'xbox360', 'xenia', 'Xenia', 'Xenia Canary', 'xenia_canary'],
        exes: ['xenia_canary.exe', 'xenia.exe']
      },
      dolphin: {
        dirs: ['Dolphin', 'dolphin', 'Dolphin-x64', 'dolphin-emu'],
        exes: ['Dolphin.exe', 'dolphin.exe']
      },
      wiiu: {
        dirs: ['Wii U', 'cemu', 'Cemu', 'wiiu'],
        exes: ['Cemu.exe', 'cemu.exe']
      },
      '3ds': {
        dirs: ['Nintendo 3DS', '3ds', 'azahar', 'citra'],
        exes: ['azahar.exe', 'citra-qt.exe', 'citra.exe']
      },
      nds: {
        dirs: ['Nintendo DS', 'nds', 'melonDS'],
        exes: ['melonDS.exe', 'melonds.exe']
      },
      ps1: {
        dirs: ['PlayStation', 'duckstation', 'DuckStation', 'ps1', 'psx'],
        exes: ['duckstation-qt-x64-ReleaseLTCG.exe', 'duckstation-qt-x64-Release.exe', 'duckstation.exe', 'duckstation-qt.exe']
      },
      saturn: {
        dirs: ['Saturn', 'ymir', 'saturn'],
        exes: ['ymir-sdl3.exe', 'ymir.exe']
      },
      dreamcast: {
        dirs: ['Dreamcast', 'flycast', 'dreamcast'],
        exes: ['flycast.exe']
      }
    };

    let targetGroup = null;
    if (key.includes('ps2') || key.includes('playstation 2')) targetGroup = candidates.ps2;
    else if (key.includes('ps3') || key.includes('playstation 3')) targetGroup = candidates.ps3;
    else if (key.includes('360') || key.includes('xenia')) targetGroup = candidates.xbox360;
    else if (key.includes('xbox')) targetGroup = candidates.xbox;
    else if (key.includes('wiiu') || key.includes('wii u') || key.includes('cemu')) targetGroup = candidates.wiiu;
    else if (key.includes('dolphin') || key.includes('gamecube') || key.includes('wii') || key.includes('ngc')) targetGroup = candidates.dolphin;
    else if (key.includes('3ds') || key.includes('azahar')) targetGroup = candidates['3ds'];
    else if (key.includes('nds') || key.includes('melonds')) targetGroup = candidates.nds;
    else if (key.includes('ps1') || key.includes('psx') || key.includes('duckstation')) targetGroup = candidates.ps1;
    else if (key.includes('saturn') || key.includes('ymir')) targetGroup = candidates.saturn;
    else if (key.includes('dreamcast') || key.includes('flycast')) targetGroup = candidates.dreamcast;

    // Se o rawPath já existe no disco, usa diretamente
    if (rawPath && fs.existsSync(rawPath)) {
      return rawPath;
    }
    if (rawPath) {
      const rel = path.resolve(__dirname, rawPath);
      if (fs.existsSync(rel)) return rel;
    }

    if (!targetGroup) return rawPath || '';

    // Raízes onde os emuladores podem estar
    const home = process.env.USERPROFILE || 'C:\\Users\\colos';
    const localApp = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    const searchRoots = [
      path.join(localApp, 'Programs', 'nexus-egy', 'emulators'),
      'C:\\Users\\colos\\AppData\\Local\\Programs\\nexus-egy\\emulators',
      path.join(__dirname, 'emulators'),
      path.join(__dirname, '..', 'emulators'),
      path.join(__dirname, '..', '..', 'emulators'),
      path.join(home, 'Desktop', 'Emuladores', 'AA'),
      path.join(home, 'Desktop', 'Emuladores'),
      'C:\\Users\\colos\\Desktop\\Emuladores\\AA',
      'C:\\Users\\colos\\Desktop\\Emuladores',
      path.join(home, 'Documents', 'antigravity', 'Nexus Egy 1.0.0', 'nexus-egy', 'emulators'),
      path.join(home, 'Downloads', 'Emuladores')
    ];

    for (const root of searchRoots) {
      if (!fs.existsSync(root)) continue;

      // 1. Busca direta nas subpastas conhecidas
      for (const d of targetGroup.dirs) {
        const fullDir = path.join(root, d);
        if (fs.existsSync(fullDir)) {
          for (const exe of targetGroup.exes) {
            const p = path.join(fullDir, exe);
            if (fs.existsSync(p)) return p;
          }
        }
      }

      // 2. Busca recursiva (2 níveis)
      try {
        const entries = fs.readdirSync(root, { withFileTypes: true });
        for (const ent of entries) {
          if (ent.isDirectory()) {
            const sub = path.join(root, ent.name);
            for (const exe of targetGroup.exes) {
              const p = path.join(sub, exe);
              if (fs.existsSync(p)) return p;
            }
            try {
              const subEntries = fs.readdirSync(sub, { withFileTypes: true });
              for (const subEnt of subEntries) {
                if (subEnt.isDirectory()) {
                  for (const exe of targetGroup.exes) {
                    const p2 = path.join(sub, subEnt.name, exe);
                    if (fs.existsSync(p2)) return p2;
                  }
                }
              }
            } catch (e2) {}
          }
        }
      } catch (e) {}
    }

    return rawPath ? (path.isAbsolute(rawPath) ? rawPath : path.resolve(__dirname, rawPath)) : '';
  }

  /**
   * Obtém a configuração de chamada CLI para o emulador solicitado
   */
  getLaunchConfig(platform, romPath) {
    const config = this.loadConfig();
    const key = (platform || '').toLowerCase().trim();

    let emuConfig = null;
    let defaultArgs = [];
    if (key.includes('ps2') || key.includes('playstation 2')) {
      emuConfig = config.emulators?.ps2 || { name: 'PCSX2 (PlayStation 2)', path: './emulators/pcsx2/pcsx2-qt.exe' };
      defaultArgs = ['--fullscreen', '--nogui', '--batch', '--'];
    } else if (key.includes('ps3') || key.includes('playstation 3')) {
      emuConfig = config.emulators?.ps3 || { name: 'RPCS3 (PlayStation 3)', path: './emulators/rpcs3/rpcs3.exe' };
      defaultArgs = ['--no-gui'];
    } else if (key.includes('360') || key.includes('xenia')) {
      emuConfig = config.emulators?.xbox360 || { name: 'Xenia (Xbox 360)', path: './emulators/Xbox 360/xenia_canary.exe' };
      defaultArgs = ['--fullscreen'];
    } else if (key.includes('xbox')) {
      emuConfig = config.emulators?.xbox || { name: 'Xemu (Xbox Original)', path: './emulators/xemu/xemu.exe' };
      defaultArgs = ['-full-screen', '-dvd_path'];
    } else if (key.includes('gamecube') || key.includes('ngc')) {
      emuConfig = config.emulators?.gamecube || { name: 'Dolphin (GameCube)', path: './emulators/Dolphin/Dolphin.exe' };
      defaultArgs = ['-b', '-e'];
    } else if (key.includes('wiiu') || key.includes('wii u') || key.includes('cemu')) {
      emuConfig = config.emulators?.wiiu || { name: 'Cemu (Wii U)', path: './emulators/Wii U/Cemu.exe' };
      defaultArgs = ['-f', '-g'];
    } else if (key.includes('wii') || key.includes('dolphin')) {
      emuConfig = config.emulators?.wii || config.emulators?.gamecube || { name: 'Dolphin (Nintendo Wii)', path: './emulators/Dolphin/Dolphin.exe' };
      defaultArgs = ['-b', '-e'];
      emuConfig = config.emulators?.wiiu || { name: 'Cemu (Wii U)', path: './emulators/Wii U/Cemu.exe' };
      defaultArgs = ['-f', '-g'];
    } else if (key.includes('3ds') || key.includes('azahar')) {
      emuConfig = config.emulators?.['3ds'] || { name: 'Azahar (Nintendo 3DS)', path: './emulators/Nintendo 3DS/azahar.exe' };
      defaultArgs = [];
    } else if (key.includes('nds') || key.includes('melonds')) {
      emuConfig = config.emulators?.nds || { name: 'MelonDS (Nintendo DS)', path: './emulators/Nintendo DS/melonDS.exe' };
      defaultArgs = ['-f'];
    } else if (key.includes('ps1') || key.includes('psx') || key.includes('duckstation')) {
      emuConfig = config.emulators?.ps1 || { name: 'DuckStation (PlayStation)', path: './emulators/PlayStation/duckstation-qt-x64-Release.exe' };
      defaultArgs = ['-fullscreen', '--'];
    } else if (key.includes('saturn') || key.includes('ymir')) {
      emuConfig = config.emulators?.saturn || { name: 'Ymir (Sega Saturn)', path: './emulators/Saturn/ymir-sdl3.exe' };
      defaultArgs = [];
    } else if (key.includes('dreamcast') || key.includes('flycast')) {
      emuConfig = config.emulators?.dreamcast || { name: 'Flycast (Dreamcast)', path: './emulators/Dreamcast/flycast.exe' };
      defaultArgs = [];
    }

    if (!emuConfig) {
      throw new Error(`Plataforma pesada "${platform}" não reconhecida no HeavyEmuLauncher.`);
    }

    const exePath = this.resolveExecutable(emuConfig.path, key);

    if (exePath && fs.existsSync(exePath)) {
      this.ensureDirectFullscreenConfig(key, exePath);
    }

    const resolvedRom = path.resolve(romPath);
    const configuredArgs = emuConfig.args && emuConfig.args.length > 0 ? emuConfig.args : defaultArgs;
    const args = [...configuredArgs, resolvedRom];

    return {
      name: emuConfig.name,
      exe: exePath,
      args: args
    };
  }

  /**
   * Inicia o emulador em processo filho desacoplado (Kiosk/Fullscreen Direto)
   */
  launch(platform, romPath) {
    return new Promise((resolve, reject) => {
      try {
        if (this.activeProcess && !this.activeProcess.killed) {
          return reject(new Error('Já existe uma sessão de emulador em execução. Encerre o jogo atual antes de abrir outro.'));
        }

        const launchCfg = this.getLaunchConfig(platform, romPath);

        if (!launchCfg.exe || !fs.existsSync(launchCfg.exe)) {
          const msg = `O executável do emulador (${launchCfg.name}) não foi encontrado em:\n${launchCfg.exe || 'pasta emulators/'}\n\nColoque os arquivos do emulador na pasta indicada ou edite o arquivo config.json.`;
          return reject(new Error(msg));
        }

        if (!fs.existsSync(romPath)) {
          return reject(new Error(`O arquivo do jogo (ROM/ISO) não foi encontrado no caminho especificado:\n${romPath}`));
        }

        console.log(`[HeavyEmuLauncher] Iniciando ${launchCfg.name} em Tela Cheia Direta...`);
        console.log(`[HeavyEmuLauncher] Executável: ${launchCfg.exe}`);
        console.log(`[HeavyEmuLauncher] Argumentos: ${launchCfg.args.join(' ')}`);

        const workingDir = path.dirname(launchCfg.exe);

        const child = spawn(launchCfg.exe, launchCfg.args, {
          cwd: workingDir,
          detached: true,
          stdio: 'ignore',
          windowsHide: false
        });
        child.unref();

        this.activeProcess = child;
        this.activeGameInfo = {
          platform,
          romPath,
          startedAt: Date.now(),
          pid: child.pid
        };

        child.on('error', (err) => {
          console.error('[HeavyEmuLauncher] Falha no processo filho:', err);
          this.activeProcess = null;
          this.activeGameInfo = null;
          if (this.onProcessExit) this.onProcessExit({ error: err.message });
        });

        child.on('exit', (code, signal) => {
          console.log(`[HeavyEmuLauncher] Sessão encerrada. PID: ${child.pid}, Código: ${code}, Sinal: ${signal}`);
          this.activeProcess = null;
          this.activeGameInfo = null;
          if (this.onProcessExit) this.onProcessExit({ code, signal });
        });

        resolve({
          pid: child.pid,
          name: launchCfg.name,
          platform,
          rom: romPath
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  killActiveSession() {
    if (this.activeProcess && !this.activeProcess.killed) {
      try {
        process.kill(this.activeProcess.pid);
        this.activeProcess = null;
        this.activeGameInfo = null;
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  getStatus() {
    return {
      running: !!(this.activeProcess && !this.activeProcess.killed),
      game: this.activeGameInfo
    };
  }
}

module.exports = new HeavyEmuLauncher();
