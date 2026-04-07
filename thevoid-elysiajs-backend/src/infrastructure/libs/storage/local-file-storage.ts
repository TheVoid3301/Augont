import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { env } from '../../config/env';

export class LocalFileStorage {
  private readonly rootPath = resolve(env.UPLOAD_ROOT);

  buildRelativePath(fileMd5: string, fileName: string): string {
    const part1 = fileMd5.slice(0, 2);
    const part2 = fileMd5.slice(2, 4);
    return join(part1, part2, fileName).replaceAll('\\', '/');
  }

  getAbsolutePath(relativePath: string): string {
    return resolve(this.rootPath, relativePath);
  }

  async exists(relativePath: string): Promise<boolean> {
    const absolutePath = this.getAbsolutePath(relativePath);
    try {
      const fileInfo = await stat(absolutePath);
      return fileInfo.isFile();
    } catch {
      return false;
    }
  }

  async save(relativePath: string, content: Buffer): Promise<void> {
    const absolutePath = this.getAbsolutePath(relativePath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content);
  }
}
