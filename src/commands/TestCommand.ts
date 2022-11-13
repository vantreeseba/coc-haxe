import {LanguageClient, window, Command, workspace} from 'coc.nvim';

export default class TestCommand implements Command {
  public readonly title = 'haxe.test';
  public readonly command = 'haxe.test';

  public constructor(private readonly client: LanguageClient) {
    this.client = client
  }

  public async execute(): Promise<void> {
    const hxmlFiles = await workspace.findFiles('*.hxml')

    //     console.log("hi", hxmlFiles)
    const fileNames = hxmlFiles.map(x => x.path);

    window.showQuickpick(fileNames, 'Select Haxe Configuration').then(x => {
      window.showInformationMessage(`chose: ${hxmlFiles[x]}`)
    })

    //     window.showMessage('test command ran.');
  }
}
