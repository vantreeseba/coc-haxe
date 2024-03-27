import { LanguageClient, workspace, window, Command } from 'coc.nvim';
import path from 'path';

export default class HaxeGotoHxmlCommand implements Command {
  public readonly title = 'haxe.goToHxml';
  public readonly command = 'haxe.goToHxml';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

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
