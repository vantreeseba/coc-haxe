import { LanguageClient, workspace, window, Command, TextEdit } from 'coc.nvim';

export default class HaxeFormatAllCommand implements Command {
  public readonly title = 'haxe.FormatAll';
  public readonly command = 'haxe.FormatAll';

  public constructor(private readonly client: LanguageClient) {
    this.client = client;
  }

  public async execute(): Promise<void> {
    // TODO setup glob properly to recurse, but have ignores.
    const hx = await workspace.findFiles('**/*.hx');

    await Promise.all(
      hx.map(async (file) => {
        await workspace.openTextDocument(file.fsPath);

        const response: TextEdit[] = await this.client.sendRequest('textDocument/formatting', {
          textDocument: { uri: file.toString() },
          options: {
            tabSize: 2,
            insertSpaces: true,
          },
        });

        workspace.getDocument(file.fsPath).applyEdits(response);
      }),
    );
  }
}
