import * as vscode from 'vscode';
import * as fs from 'fs';
import { promisify } from 'util';
import { getAllFiles, getDirectoryTree } from './fileUtils';
import { combineFilesToMarkdown } from './markdownGenerator';
import { selectOutputType, outputMarkdown } from './outputHandler';
import { OutputType } from './types';

const stat = promisify(fs.stat);

/**
 * 拡張機能のアクティベート
 * @param context 拡張機能のコンテキスト
 */
export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('coding-utility.combineFiles', async (uri?: vscode.Uri) => {
    try {
      const folderUri = await selectFolder(uri);
      if (!folderUri) {
        return;
      }

      const outputType = await selectOutputType();
      if (!outputType) {
        return;
      }

      await processDirectory(folderUri, outputType);
    } catch (error) {
      vscode.window.showErrorMessage(`エラーが発生しました: ${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

/**
 * フォルダを選択する
 * @param uri コンテキストメニューから渡されるURI（オプション）
 * @returns 選択されたフォルダのURI、またはundefined
 */
async function selectFolder(uri?: vscode.Uri): Promise<vscode.Uri | undefined> {
  let folderUri: vscode.Uri | undefined = uri;

  if (!folderUri) {
    const selected = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'フォルダを選択'
    });

    if (!selected || selected.length === 0) {
      return undefined;
    }

    folderUri = selected[0];
  }

  const stats = await stat(folderUri.fsPath);
  if (!stats.isDirectory()) {
    vscode.window.showErrorMessage('ディレクトリを選択してください');
    return undefined;
  }

  return folderUri;
}

/**
 * ディレクトリを処理してマークダウンを生成・出力する
 * @param folderUri フォルダのURI
 * @param outputType 出力先の種類
 */
async function processDirectory(folderUri: vscode.Uri, outputType: OutputType): Promise<void> {
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'ファイルを結合中...',
      cancellable: false
    },
    async (progress) => {
      progress.report({ increment: 0, message: 'ファイルを読み込んでいます...' });

      // ファイルツリーを取得
      const tree = await getDirectoryTree(folderUri.fsPath);
      progress.report({ increment: 30, message: 'ファイルツリーを生成しました' });

      // すべてのファイルを取得
      const files = await getAllFiles(folderUri.fsPath);
      progress.report({ increment: 60, message: `${files.length}個のファイルを処理しました` });

      // マークダウンに変換
      const content = combineFilesToMarkdown(files, tree, folderUri.fsPath);
      progress.report({ increment: 80, message: 'マークダウンを生成しました' });

      // 出力
      await outputMarkdown(content, outputType, folderUri.fsPath);
      progress.report({ increment: 100, message: '完了しました！' });
    }
  );
}

/**
 * 拡張機能のディアクティベート
 */
export function deactivate(): void {}
