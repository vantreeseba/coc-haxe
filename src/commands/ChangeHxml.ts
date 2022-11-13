import {LanguageClient, workspace, window, Command} from 'coc.nvim';

export default class HaxeChangeHxmlCommand implements Command {
  public readonly title = 'haxe.changeHxml';
  public readonly command = 'haxe.changeHxml';

  public constructor(private readonly client: LanguageClient) {
    this.client = client
  }

  public async execute(): Promise<void> {
    const hxmlFiles = await workspace.findFiles('*.hxml')
    const fileNames = hxmlFiles.map(x => x.path);

    window.showQuickpick(fileNames, 'Select Haxe Configuration').then(x => {
      const hxml = fileNames[x]
      workspace.getConfiguration('haxe').update('hxml', hxml);
      this.client.sendNotification('haxe/didChangeDisplayArguments', {
        arguments: [hxml],
      });
    })
  }
}
