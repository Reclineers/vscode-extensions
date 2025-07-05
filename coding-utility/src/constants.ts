/**
 * ファイル拡張子とプログラミング言語のマッピング
 */
export const LANGUAGE_MAP: { [key: string]: string } = {
  // JavaScript/TypeScript
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'javascript',
  '.tsx': 'typescript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',

  // Web
  '.html': 'html',
  '.htm': 'html',
  '.xml': 'xml',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.vue': 'vue',
  '.svelte': 'svelte',

  // データ形式
  '.json': 'json',
  '.jsonc': 'jsonc',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.toml': 'toml',
  '.ini': 'ini',
  '.cfg': 'ini',
  '.conf': 'ini',
  '.properties': 'properties',

  // プログラミング言語
  '.py': 'python',
  '.java': 'java',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.c': 'c',
  '.h': 'c',
  '.hpp': 'cpp',
  '.rb': 'ruby',
  '.go': 'go',
  '.php': 'php',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.rs': 'rust',
  '.dart': 'dart',
  '.lua': 'lua',
  '.r': 'r',
  '.R': 'r',
  '.m': 'objective-c',
  '.mm': 'objective-c',
  '.scala': 'scala',

  // シェルスクリプト
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.fish': 'bash',
  '.ps1': 'powershell',
  '.psm1': 'powershell',
  '.psd1': 'powershell',
  '.bat': 'batch',
  '.cmd': 'batch',

  // マークアップ
  '.md': 'markdown',
  '.markdown': 'markdown',
  '.rst': 'restructuredtext',
  '.tex': 'latex',

  // データベース
  '.sql': 'sql',

  // 設定ファイル
  '.dockerfile': 'dockerfile',
  '.Dockerfile': 'dockerfile',
  '.makefile': 'makefile',
  '.Makefile': 'makefile',
  '.mk': 'makefile',
  '.cmake': 'cmake',
  '.CMakeLists.txt': 'cmake',
  '.gradle': 'gradle',
  '.groovy': 'groovy',
  '.jenkinsfile': 'groovy',
  '.Jenkinsfile': 'groovy',

  // その他の言語
  '.vb': 'vb',
  '.vbs': 'vbscript',
  '.pas': 'pascal',
  '.pp': 'pascal',
  '.d': 'd',
  '.pl': 'perl',
  '.pm': 'perl',
  '.t': 'perl',
  '.jl': 'julia',
  '.elm': 'elm',
  '.clj': 'clojure',
  '.cljs': 'clojure',
  '.cljc': 'clojure',
  '.edn': 'clojure',
  '.ex': 'elixir',
  '.exs': 'elixir',
  '.erl': 'erlang',
  '.hrl': 'erlang',
  '.fs': 'fsharp',
  '.fsx': 'fsharp',
  '.fsi': 'fsharp',
  '.ml': 'ocaml',
  '.mli': 'ocaml',
  '.nim': 'nim',
  '.nims': 'nim',
  '.hs': 'haskell',
  '.lhs': 'haskell',
  '.pug': 'pug',
  '.jade': 'pug'
};

/**
 * 除外するディレクトリ名のパターン
 */
export const EXCLUDED_DIRECTORIES = [
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'out',
  '.vscode-test',
  '__pycache__',
  '.pytest_cache',
  '.next',
  '.nuxt',
  'target',
  'bin',
  'obj'
];

/**
 * 除外するファイル名のパターン
 */
export const EXCLUDED_FILES = [
  '.DS_Store',
  'Thumbs.db',
  '*.pyc',
  '*.pyo',
  '*.class',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib'
];
