import { FileInfo, DirectoryEntry } from './types';

/**
 * ファイル情報からマークダウンのコードブロックを生成する
 * @param file ファイル情報
 * @returns マークダウン形式の文字列
 */
function generateCodeBlock(file: FileInfo): string {
  return `\`\`\`${file.language}:${file.relativePath}\n${file.content}\n\`\`\`\n`;
}

/**
 * ディレクトリツリーを文字列形式に変換する
 * @param tree ディレクトリツリー
 * @param prefix プレフィックス（インデント用）
 * @param isLast 最後の要素かどうか
 * @returns ツリー形式の文字列
 */
function treeToString(tree: DirectoryEntry, prefix = '', isLast = true): string {
  const lines: string[] = [];
  const connector = isLast ? '└── ' : '├── ';
  const icon = tree.isDirectory ? '📁 ' : '📄 ';

  lines.push(prefix + connector + icon + tree.name);

  if (tree.children) {
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    tree.children.forEach((child, index) => {
      const isLastChild = index === tree.children!.length - 1;
      lines.push(treeToString(child, childPrefix, isLastChild));
    });
  }

  return lines.join('\n');
}

/**
 * ファイル情報の配列をマークダウンに変換する
 * @param files ファイル情報の配列
 * @param tree ディレクトリツリー
 * @param baseDir 基準ディレクトリのパス
 * @returns マークダウン形式の文字列
 */
export function combineFilesToMarkdown(files: FileInfo[], tree: DirectoryEntry, baseDir: string): string {
  const chunks: string[] = [];

  // ヘッダー
  chunks.push(`# ディレクトリ: ${tree.name}\n`);
  chunks.push(`生成日時: ${new Date().toLocaleString('ja-JP')}\n`);
  chunks.push(`ファイル数: ${files.length}\n`);
  chunks.push('\n---\n');

  // ファイルツリー
  chunks.push('## ファイルツリー\n');
  chunks.push('```plaintext');
  chunks.push(tree.name);
  if (tree.children && tree.children.length > 0) {
    tree.children.forEach((child, index) => {
      const isLast = index === tree.children!.length - 1;
      chunks.push(treeToString(child, '', isLast));
    });
  }
  chunks.push('```\n');
  chunks.push('\n---\n');

  // ファイル内容
  chunks.push('## ファイル内容\n');

  // ファイルパスでソート
  const sortedFiles = [...files].sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  for (const file of sortedFiles) {
    chunks.push(`### 📄 ${file.relativePath}\n`);
    chunks.push(generateCodeBlock(file));
    chunks.push('\n');
  }

  return chunks.join('\n');
}
