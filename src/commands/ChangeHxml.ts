import {LanguageClient, workspace, Command} from 'coc.nvim';

export default class HaxeChangeHxmlCommand implements Command {
  public readonly title = 'haxe.changeHxml';
  public readonly command = 'haxe.changeHxml';

  public constructor(private readonly client: LanguageClient) {
    this.client = client
  }

  public async execute(hxml: string): Promise<void> {
    workspace.getConfiguration('haxe').update('hxml', hxml);
    this.client.sendNotification('haxe/didChangeDisplayArguments', {
      arguments: [hxml],
    });
  }
}
