import { LanguageClient, workspace, window, Command, TextEdit } from 'coc.nvim';

export default class HaxeFormatOpenCommand implements Command {
  public readonly title = 'haxe.FormatOpen';
  public readonly command = 'haxe.FormatOpen';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

  public async execute(): Promise<void> {
    const hx = workspace.documents.filter((x) => x.filetype == 'haxe');

    await Promise.all(
      hx.map(async (file) => {
        const response: TextEdit[] = await this.client.sendRequest('textDocument/formatting', {
          textDocument: { uri: file.uri.toString() },
          options: {
            tabSize: 2,
            insertSpaces: true,
          },
        });

        file.applyEdits(response);
      }),
    );
  }
}
