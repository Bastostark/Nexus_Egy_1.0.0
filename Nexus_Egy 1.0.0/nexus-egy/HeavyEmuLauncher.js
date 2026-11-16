/**
 * HeavyEmuLauncher.js
 * Módulo de Process Spawning para emuladores standalone pesados (PS2, PS3, Xbox, GameCube, Wii).
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
        // Modo portátil para isolar configurações
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

        // Garante Fullscreen = True e sem diálogos de confirmação
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
      if (key.includes('xemu') || key.includes('xbox')) {
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
    } catch (err) {
      console.warn('[HeavyEmuLauncher] Aviso ao configurar flags de tela cheia:', err.message);
    }
  }

  /**
   * Carrega a configuração dinâmica do config.json com caminhos padrão relativos à pasta emulators/
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const raw = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[HeavyEmuLauncher] Falha ao ler config.json, usando defaults:', err.message);
    }

    return {
      emulators: {
        ps2: {
          name: 'PCSX2 (PlayStation 2)',
          path: './emulators/pcsx2/pcsx2-qt.exe',
          args: ['--fullscreen', '--nogui', '--batch', '--']
        },
        ps3: {
          name: 'RPCS3 (PlayStation 3)',
          path: './emulators/rpcs3/rpcs3.exe',
          args: ['--no-gui']
        },
        xbox: {
          name: 'Xemu (Xbox Original)',
          path: './emulators/xemu/xemu.exe',
          args: ['-full-screen', '-dvd_path']
        },
        gamecube: {
          name: 'Dolphin (GameCube)',
          path: './emulators/dolphin/Dolphin.exe',
          args: ['-b', '-e']
        },
        wii: {
          name: 'Dolphin (Nintendo Wii)',
          path: './emulators/dolphin/Dolphin.exe',
          args: ['-b', '-e']
        }
      }
    };
  }

  /**
   * Resolve o executável com prioridade ABSOLUTA para a pasta ./emulators do projeto.
   * Faz busca recursiva inteligente para nunca deixar o usuário desamparado.
   */
  resolveExecutable(rawPath, platformKey) {
    const key = (platformKey || '').toLowerCase();
    const emuRoot = path.join(__dirname, 'emulators');

    const candidates = {
      ps2: {
        dirs: ['pcsx2', 'PCSX2', 'pcsx2-qt'],
        exes: ['pcsx2-qt.exe', 'pcsx2.exe', 'pcsx2-qtx64.exe', 'pcsx2-avx2.exe']
      },
      ps3: {
        dirs: ['rpcs3', 'RPCS3'],
        exes: ['rpcs3.exe']
      },
      xbox: {
        dirs: ['xemu', 'Xemu'],
        exes: ['xemu.exe']
      },
      dolphin: {
        dirs: ['dolphin', 'Dolphin', 'Dolphin-x64', 'dolphin-emu'],
        exes: ['Dolphin.exe', 'dolphin.exe']
      }
    };

    let targetGroup = null;
    if (key.includes('ps2') || key.includes('playstation 2')) targetGroup = candidates.ps2;
    else if (key.includes('ps3') || key.includes('playstation 3')) targetGroup = candidates.ps3;
    else if (key.includes('xbox')) targetGroup = candidates.xbox;
    else if (key.includes('dolphin') || key.includes('gamecube') || key.includes('wii') || key.includes('ngc')) targetGroup = candidates.dolphin;

    // 1. PRIORIDADE MÁXIMA: Checar na pasta ./emulators do próprio Nexus Egy
    if (targetGroup && fs.existsSync(emuRoot)) {
      // 1.1 Direto nas subpastas conhecidas
      for (const d of targetGroup.dirs) {
        const fullDir = path.join(emuRoot, d);
        if (fs.existsSync(fullDir)) {
          for (const exe of targetGroup.exes) {
            const p = path.join(fullDir, exe);
            if (fs.existsSync(p)) return p;
          }
        }
      }

      // 1.2 Varredura recursiva de 2 níveis dentro de ./emulators
      try {
        const entries = fs.readdirSync(emuRoot, { withFileTypes: true });
        for (const ent of entries) {
          if (ent.isDirectory()) {
            const sub = path.join(emuRoot, ent.name);
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

    // 2. Se o caminho do config.json existir (relativo ou absoluto)
    if (rawPath) {
      if (fs.existsSync(rawPath)) return rawPath;
      const rel = path.resolve(__dirname, rawPath);
      if (fs.existsSync(rel)) return rel;
    }

    // 3. Fallback: procurar no Desktop\Emuladores do usuário
    const home = process.env.USERPROFILE || 'C:\\Users\\colos';
    const desktopEmus = path.join(home, 'Desktop', 'Emuladores');
    if (targetGroup && fs.existsSync(desktopEmus)) {
      try {
        const subdirs = fs.readdirSync(desktopEmus);
        for (const d of subdirs) {
          const subPath = path.join(desktopEmus, d);
          for (const exe of targetGroup.exes) {
            const p = path.join(subPath, exe);
            if (fs.existsSync(p)) return p;
          }
        }
      } catch (err) {}
    }

    // 4. Fallback no Desktop geral
    const desktop = path.join(home, 'Desktop');
    if (targetGroup && fs.existsSync(desktop)) {
      try {
        for (const d of targetGroup.dirs) {
          const subPath = path.join(desktop, d);
          for (const exe of targetGroup.exes) {
            const p = path.join(subPath, exe);
            if (fs.existsSync(p)) return p;
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
      emuConfig = config.emulators?.ps2;
      defaultArgs = ['--fullscreen', '--nogui', '--batch', '--'];
    } else if (key.includes('ps3') || key.includes('playstation 3')) {
      emuConfig = config.emulators?.ps3;
      defaultArgs = ['--no-gui'];
    } else if (key.includes('xbox')) {
      emuConfig = config.emulators?.xbox;
      defaultArgs = ['-full-screen', '-dvd_path'];
    } else if (key.includes('gamecube') || key.includes('ngc')) {
      emuConfig = config.emulators?.gamecube;
      defaultArgs = ['-b', '-e'];
    } else if (key.includes('wii') || key.includes('dolphin')) {
      emuConfig = config.emulators?.wii || config.emulators?.gamecube;
      defaultArgs = ['-b', '-e'];
    }

    if (!emuConfig) {
      throw new Error(`Plataforma pesada "${platform}" não reconhecida no HeavyEmuLauncher.`);
    }

    const exePath = this.resolveExecutable(emuConfig.path, key);

    // Aplica configuração de tela cheia direta sem GUI prévia
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
