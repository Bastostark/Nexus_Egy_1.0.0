/**
 * HeavyEmuLauncher.js
 * Módulo isolado de Process Spawning para emuladores standalone pesados (PS2, PS3, Xbox).
 * Gerencia ciclo de vida, flags de tela cheia/kiosk e carregamento dinâmico via config.json.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class HeavyEmuLauncher {
  constructor() {
    this.configPath = path.join(__dirname, 'config.json');
    this.activeProcess = null;
    this.activeGameInfo = null;
  }

  /**
   * Carrega a configuração dinâmica do config.json com fallback seguro
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
          path: './emulators/pcsx2/pcsx2.exe',
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
   * Resolve o caminho do executável (aceita relativo ou absoluto)
   * e verifica variantes conhecidas (ex: pcsx2-qtx64.exe)
   */
  resolveExecutable(rawPath, platformKey) {
    let resolved = path.isAbsolute(rawPath) ? rawPath : path.resolve(__dirname, rawPath);

    if (fs.existsSync(resolved)) return resolved;

    // Se o executável direto não for achado, testa variantes conhecidas no diretório
    const dir = path.dirname(resolved);
    if (fs.existsSync(dir)) {
      if (platformKey === 'ps2') {
        const altQt = path.join(dir, 'pcsx2-qtx64.exe');
        if (fs.existsSync(altQt)) return altQt;
        const altAvx = path.join(dir, 'pcsx2-avx2.exe');
        if (fs.existsSync(altAvx)) return altAvx;
      }
    }

    return resolved;
  }

  /**
   * Obtém a configuração de chamada CLI para o emulador solicitado
   */
  getLaunchConfig(platform, romPath) {
    const config = this.loadConfig();
    const key = (platform || '').toLowerCase().trim();

    let emuConfig = null;
    if (key.includes('ps2') || key.includes('playstation 2')) {
      emuConfig = config.emulators?.ps2;
    } else if (key.includes('ps3') || key.includes('playstation 3')) {
      emuConfig = config.emulators?.ps3;
    } else if (key.includes('xbox')) {
      emuConfig = config.emulators?.xbox;
    } else if (key.includes('gamecube') || key.includes('ngc')) {
      emuConfig = config.emulators?.gamecube;
    } else if (key.includes('wii')) {
      emuConfig = config.emulators?.wii;
    }

    if (!emuConfig) {
      throw new Error(`Plataforma pesada "${platform}" não reconhecida no HeavyEmuLauncher.`);
    }

    const exePath = this.resolveExecutable(emuConfig.path, key);
    const resolvedRom = path.resolve(romPath);
    const args = [...(emuConfig.args || []), resolvedRom];

    return {
      name: emuConfig.name,
      exe: exePath,
      args: args
    };
  }

  /**
   * Inicia o emulador em processo filho desacoplado (Kiosk/Fullscreen)
   */
  launch(platform, romPath) {
    return new Promise((resolve, reject) => {
      try {
        if (this.activeProcess && !this.activeProcess.killed) {
          return reject(new Error('Já existe uma sessão de emulador em execução. Encerre o jogo atual antes de abrir outro.'));
        }

        const launchCfg = this.getLaunchConfig(platform, romPath);

        if (!fs.existsSync(launchCfg.exe)) {
          const msg = `O executável do emulador (${launchCfg.name}) não foi encontrado em:\n${launchCfg.exe}\n\nColoque os arquivos do emulador na pasta indicada ou edite o arquivo config.json.`;
          return reject(new Error(msg));
        }

        if (!fs.existsSync(romPath)) {
          return reject(new Error(`O arquivo do jogo (ROM/ISO) não foi encontrado no caminho especificado:\n${romPath}`));
        }

        console.log(`[HeavyEmuLauncher] Iniciando ${launchCfg.name}...`);
        console.log(`[HeavyEmuLauncher] Executável: ${launchCfg.exe}`);
        console.log(`[HeavyEmuLauncher] Argumentos: ${launchCfg.args.join(' ')}`);

        const workingDir = path.dirname(launchCfg.exe);

        const child = spawn(launchCfg.exe, launchCfg.args, {
          cwd: workingDir,
          detached: false,
          stdio: 'ignore',
          windowsHide: false
        });

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
        });

        child.on('exit', (code, signal) => {
          console.log(`[HeavyEmuLauncher] Sessão encerrada. PID: ${child.pid}, Código: ${code}, Sinal: ${signal}`);
          this.activeProcess = null;
          this.activeGameInfo = null;
        });

        resolve({
          status: 'running',
          platform,
          name: launchCfg.name,
          pid: child.pid
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Força o encerramento do emulador caso necessário
   */
  killActiveSession() {
    if (this.activeProcess) {
      try {
        this.activeProcess.kill();
        this.activeProcess = null;
        this.activeGameInfo = null;
        return true;
      } catch (err) {
        console.error('[HeavyEmuLauncher] Falha ao encerrar processo:', err);
      }
    }
    return false;
  }

  /**
   * Status atual da sessão
   */
  getStatus() {
    return {
      running: !!(this.activeProcess && !this.activeProcess.killed),
      gameInfo: this.activeGameInfo
    };
  }
}

module.exports = new HeavyEmuLauncher();
