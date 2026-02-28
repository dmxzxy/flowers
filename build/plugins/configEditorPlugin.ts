/**
 * Vite 插件：配置编辑器 API
 *
 * 功能：
 * - /__editor      → 提供配置编辑器页面
 * - GET  /__api/config → 读取编辑器 JSON 状态
 * - POST /__api/config → 保存 JSON 状态 + 写入 TypeScript 配置文件
 *
 * 配置文件写入后 Vite HMR 会自动热更新游戏页面
 */
import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export function configEditorPlugin(): Plugin {
  let root: string;
  let srcDir: string;

  return {
    name: 'config-editor',

    configResolved(config) {
      root = config.root;
      srcDir = path.resolve(root, 'src');
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // ────── 提供编辑器 HTML ──────
        if (url === '/__editor' || url === '/__editor/') {
          const htmlPath = path.resolve(root, '..', 'tools', 'config-editor', 'index.html');
          if (!fs.existsSync(htmlPath)) {
            res.statusCode = 404;
            res.end('Editor HTML not found at: ' + htmlPath);
            return;
          }
          const html = fs.readFileSync(htmlPath, 'utf-8');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        }

        // ────── 读取配置状态 ──────
        if (url === '/__api/config' && req.method === 'GET') {
          const statePath = path.resolve(srcDir, 'config', '.editor-state.json');
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(statePath)) {
            res.end(fs.readFileSync(statePath, 'utf-8'));
          } else {
            res.end(JSON.stringify({ _empty: true }));
          }
          return;
        }

        // ────── 保存配置并写入 TS 文件 ──────
        if (url === '/__api/config' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const { state, files } = JSON.parse(body);

              // 保存编辑器 JSON 快照
              const statePath = path.resolve(srcDir, 'config', '.editor-state.json');
              fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8');

              // 写入 TypeScript 配置文件
              const fileMap: Record<string, string> = {
                'game.config.ts': path.resolve(srcDir, 'config', 'game.config.ts'),
                'flower.config.ts': path.resolve(srcDir, 'config', 'flower.config.ts'),
                'types/index.ts': path.resolve(srcDir, 'types', 'index.ts'),
              };

              const written: string[] = [];
              for (const [key, filePath] of Object.entries(fileMap)) {
                if (files[key]) {
                  fs.writeFileSync(filePath, files[key], 'utf-8');
                  written.push(key);
                }
              }

              console.log(`\x1b[35m[config-editor]\x1b[0m ✅ 已写入: ${written.join(', ')}`);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true, written }));
            } catch (e: any) {
              console.error(`\x1b[35m[config-editor]\x1b[0m ❌ 保存失败:`, e);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, message: e.message || String(e) }));
            }
          });
          return;
        }

        next();
      });

      // 启动时打印编辑器入口地址
      const printUrl = () => {
        const addr = server.httpServer?.address();
        if (addr && typeof addr === 'object') {
          const host = addr.address === '::' || addr.address === '0.0.0.0' ? 'localhost' : addr.address;
          console.log(`\x1b[35m[config-editor]\x1b[0m 🌸 配置编辑器: http://${host}:${addr.port}/__editor`);
        }
      };
      server.httpServer?.on('listening', printUrl);
    },
  };
}
