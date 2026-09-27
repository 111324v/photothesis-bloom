// 跨平台：从原型目录（../皮克敏bloom）同步 Web 内容到 ios-app/www
import { cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, '..', '皮克敏bloom');
const dest = join(root, 'www');

const EXCLUDE_DIRS = ['node_modules', 'www', 'ios', 'android', '.git', 'scripts',
  '_check', '_design', '.playwright-cli', '参考图', '植物素材', 'cutout', 'pots'];
const EXCLUDE_EXT = ['.md', '.ps1', '.blend'];
const EXCLUDE_PREFIX = ['Strawberry_', '生成花盆3D渲染图'];
const EXCLUDE_FILES = ['strawberry.glb', '水壶.glb', '花盆1.glb', '花盆2.glb', '花盆3.glb', '花盆4.glb',
  'stamp_postcard.svg', '云朵.png', '云朵2.png', '云朵3.png',
  '3.1 返回.svg', '手势.svg', '草地.svg', '面性叶子形钻石水晶.svg',
  'appstore_1024.png', 'raw_2048.png'];

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });

cpSync(src, dest, {
  recursive: true,
  filter: (p) => {
    const norm = p.replaceAll('\\', '/');
    const parts = norm.split('/');
    const base = parts[parts.length - 1];
    if (parts.some((seg) => EXCLUDE_DIRS.includes(seg))) return false;
    if (EXCLUDE_EXT.some((e) => base.endsWith(e))) return false;
    if (EXCLUDE_PREFIX.some((pre) => base.startsWith(pre))) return false;
    if (EXCLUDE_FILES.includes(base)) return false;
    return true;
  },
});
console.log('web synced: ../皮克敏bloom -> www');
