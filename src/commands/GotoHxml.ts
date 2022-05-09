import { LanguageClient, workspace, window } from 'coc.nvim';
import path from 'path';
import Command from './Command';

export default class HaxeGotoHxmlCommand implements Command {
  public readonly id = 'haxe.goToHxml';

  public constructor(private readonly client: LanguageClient) {}

  public async execute(): Promise<void> {
    let hxml = workspace.getConfiguration('haxe').hxml;
    let doc = workspace.workspaceFolder;
    await goToProjectConfig(path.join(doc.uri, hxml));
  }
}

async function goToProjectConfig(uri: string): Promise<void> {
  window.showMessage('HXML: ' + uri);
  await workspace.openResource(uri);
}
