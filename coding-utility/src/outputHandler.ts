import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { OutputType } from './types';

const writeFile = promisify(fs.writeFile);

/**
 * 出力先選択のオプション
 */
const OUTPUT_OPTIONS = [
  { label: '📄 ファイルに保存', value: 'file' as OutputType },
  { label: '📋 クリップボードにコピー', value: 'clipboard' as OutputType },
  { label: '📝 新しいタブで開く', value: 'newTab' as OutputType }
];

/**
 * ユーザーに出力先を選択させる
 * @returns 選択された出力先、またはundefined
 */
export async function selectOutputType(): Promise<OutputType | undefined> {
  const selected = await vscode.window.showQuickPick(OUTPUT_OPTIONS, {
    placeHolder: '出力先を選択してください'
  });

  return selected?.value;
}

/**
 * マークダウンを指定された方法で出力する
 * @param content 出力する内容
 * @param outputType 出力先の種類
 * @param baseDir 基準ディレクトリ
 */
export async function outputMarkdown(content: string, outputType: OutputType, baseDir: string): Promise<void> {
  switch (outputType) {
    case 'file': {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const defaultFileName = `combined_${path.basename(baseDir)}_${timestamp}.md`;
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(baseDir, defaultFileName)),
        filters: {
          Markdown: ['md']
        }
      });

      if (uri) {
        await writeFile(uri.fsPath, content, 'utf8');
        vscode.window.showInformationMessage(`ファイルを保存しました: ${uri.fsPath}`);
      }
      break;
    }

    case 'clipboard': {
      await vscode.env.clipboard.writeText(content);
      vscode.window.showInformationMessage('クリップボードにコピーしました！');
      break;
    }

    case 'newTab': {
      const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'markdown'
      });
      await vscode.window.showTextDocument(doc);
      break;
    }
  }
}
