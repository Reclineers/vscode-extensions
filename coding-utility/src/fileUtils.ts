import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { FileInfo, DirectoryEntry } from './types';
import { LANGUAGE_MAP, EXCLUDED_DIRECTORIES, EXCLUDED_FILES } from './constants';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

/**
 * ファイル拡張子から言語を取得する
 * @param filePath ファイルパス
 * @returns プログラミング言語名
 */
export function getLanguageFromExtension(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath);

  // ファイル名全体でマッチング（例: Dockerfile, Makefile）
  if (LANGUAGE_MAP[basename]) {
    return LANGUAGE_MAP[basename];
  }

  // 拡張子でマッチング
  return LANGUAGE_MAP[ext] || 'others';
}

/**
 * ディレクトリまたはファイルを除外するかどうかを判定
 * @param name ファイルまたはディレクトリ名
 * @param isDirectory ディレクトリかどうか
 * @returns 除外する場合はtrue
 */
function shouldExclude(name: string, isDirectory: boolean): boolean {
  if (isDirectory) {
    return EXCLUDED_DIRECTORIES.includes(name);
  }

  // ファイルの場合
  for (const pattern of EXCLUDED_FILES) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      if (regex.test(name)) {
        return true;
      }
    } else if (name === pattern) {
      return true;
    }
  }

  return false;
}

/**
 * ディレクトリ配下のすべてのファイル情報を取得する
 * @param dirPath ディレクトリパス
 * @returns ファイル情報の配列
 */
export async function getAllFiles(dirPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  /**
   * ディレクトリを再帰的に走査する
   * @param currentPath 現在のパス
   */
  async function traverse(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath);

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const stats = await stat(fullPath);

      if (shouldExclude(entry, stats.isDirectory())) {
        continue;
      }

      if (stats.isDirectory()) {
        await traverse(fullPath);
      } else if (stats.isFile()) {
        try {
          const content = await readFile(fullPath, 'utf8');
          const relativePath = path.relative(dirPath, fullPath);
          const language = getLanguageFromExtension(fullPath);

          files.push({
            absolutePath: fullPath,
            relativePath,
            content,
            language
          });
        } catch (error) {
          console.error(`ファイル読み込みエラー ${fullPath}:`, error);
        }
      }
    }
  }

  await traverse(dirPath);
  return files;
}

/**
 * ディレクトリツリー構造を生成する
 * @param dirPath ディレクトリパス
 * @returns ディレクトリツリー
 */
export async function getDirectoryTree(dirPath: string): Promise<DirectoryEntry> {
  const rootName = path.basename(dirPath);

  /**
   * ディレクトリエントリを再帰的に構築する
   * @param currentPath 現在のパス
   * @param name エントリ名
   * @returns ディレクトリエントリ
   */
  async function buildTree(currentPath: string, name: string): Promise<DirectoryEntry> {
    const stats = await stat(currentPath);
    const relativePath = path.relative(dirPath, currentPath);

    if (!stats.isDirectory()) {
      return {
        name,
        isDirectory: false,
        relativePath
      };
    }

    const children: DirectoryEntry[] = [];
    const entries = await readdir(currentPath);

    for (const entry of entries) {
      if (shouldExclude(entry, true)) {
        continue;
      }

      const fullPath = path.join(currentPath, entry);
      const childStats = await stat(fullPath);

      if (shouldExclude(entry, childStats.isDirectory())) {
        continue;
      }

      const child = await buildTree(fullPath, entry);
      children.push(child);
    }

    // ディレクトリを先に、ファイルを後に並べ、それぞれアルファベット順にソート
    children.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    });

    return {
      name,
      isDirectory: true,
      relativePath,
      children
    };
  }

  return buildTree(dirPath, rootName);
}
