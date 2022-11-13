import {LanguageClient, window, Command} from 'coc.nvim';

export default class TestCommand implements Command {
  public readonly title = 'haxe.test';
  public readonly command = 'haxe.test';

  public constructor(private readonly client: LanguageClient) {
    this.client = client
  }

  public async execute(): Promise<void> {
    window.showMessage('test command ran.');
  }
}
