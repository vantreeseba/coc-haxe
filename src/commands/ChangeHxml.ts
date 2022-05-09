import { LanguageClient, workspace, window } from 'coc.nvim';
import Command from './Command';

export default class HaxeChangeHxmlCommand implements Command {
  public readonly id = 'haxe.changeHxml';

  public constructor(private readonly client: LanguageClient) {}

  public async execute(hxml: string): Promise<void> {
    workspace.getConfiguration('haxe').update('hxml', hxml);
    this.client.sendNotification('haxe/didChangeDisplayArguments', {
      arguments: [hxml],
    });
  }
}
