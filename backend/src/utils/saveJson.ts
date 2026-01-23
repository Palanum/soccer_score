import fs from 'fs';
import path from 'path';

export function saveJson(filename: string, data: unknown) {
  const dir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, filename);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}
