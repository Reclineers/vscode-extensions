/**
 * 出力先の種類
 */
export type OutputType = 'file' | 'clipboard' | 'newTab';

/**
 * ファイル情報
 */
export interface FileInfo {
  /** ファイルの絶対パス */
  absolutePath: string;
  /** 基準ディレクトリからの相対パス */
  relativePath: string;
  /** ファイルの内容 */
  content: string;
  /** プログラミング言語 */
  language: string;
}

/**
 * ディレクトリエントリ（ファイルツリー用）
 */
export interface DirectoryEntry {
  /** エントリ名 */
  name: string;
  /** ディレクトリかどうか */
  isDirectory: boolean;
  /** 子要素（ディレクトリの場合） */
  children?: DirectoryEntry[];
  /** 相対パス */
  relativePath: string;
}
