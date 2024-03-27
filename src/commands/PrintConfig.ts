import { LanguageClient, workspace, window, Command } from 'coc.nvim';

export default class RestartClientCommand implements Command {
  public readonly title = 'haxe.printConfig';
  public readonly command = 'haxe.printConfig';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

  public execute(): void {
    var config = JSON.stringify(workspace.getConfiguration('haxe'));
    window.showMessage(config);
  }
}
