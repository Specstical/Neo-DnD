import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

function serverBaseDir() {
  return path.basename(process.cwd()) === 'server'
    ? process.cwd()
    : path.join(process.cwd(), 'server');
}

export async function loadModels() {
  const modelsDir = path.join(serverBaseDir(),'data','models');
  if (!fs.existsSync(modelsDir)) return;

  for (const file of fs.readdirSync(modelsDir)) {
    if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
    const full = path.join(modelsDir, file);
    await import(pathToFileURL(full).href);
  }
}