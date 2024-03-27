import { LanguageClient, window, Command } from 'coc.nvim';

export default class RestartClientCommand implements Command {
  public readonly title = 'haxe.restart';
  public readonly command = 'haxe.restart';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

  public execute(): void {
    this.client.stop().then(() => {
      this.client.restart();
      window.showMessage('projects reloaded');
    });
  }
}
