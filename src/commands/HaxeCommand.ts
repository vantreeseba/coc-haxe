import { LanguageClient, workspace, window, Command } from 'coc.nvim';

export default class HaxeCommand implements Command {
  public title = '_';
  public command = '_';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

  public async pickHxml() {
    // TODO setup glob properly to recurse, but have ignores.
    const hxmlFiles = await workspace.findFiles('*.hxml');
    const fileNames = hxmlFiles.map((x) => workspace.getRelativePath(x.path));

    const picked = await window.showQuickPick(fileNames, {
      title: 'Select HXML File',
      matchOnDescription: true,
    });

    if (picked == -1) {
      window.showInformationMessage('Did not change chosen hxml.');
      return;
    }

    const hxml = picked;
    workspace.getConfiguration('haxe').update('hxml', hxml);

    this.client.sendNotification('haxe/didChangeDisplayArguments', {
      arguments: [hxml],
    });
    window.showInformationMessage('Changed hxml to: ' + hxml);

    return hxml;
  }
}
