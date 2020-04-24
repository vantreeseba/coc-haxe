import {LanguageClient, workspace} from 'coc.nvim'
import Command from './Command';

export default class HaxeChangeHxmlCommand implements Command {
  public readonly id = 'haxe.changeHxml'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public async execute(hxml: string): Promise<void> {
    var props = {
      "haxe.hxml": hxml
    };
    workspace.configurations.updateUserConfig(props);
    this.client.sendNotification("haxe/didChangeDisplayArguments", [hxml]);
    // setTimeout(() => {
    //   this.client.stop().then(() => {
    //     this.client.restart();
    //   });
    //   workspace.showMessage("Changed hxml to: " + hxml);
    // }, 5000)
    //
  }
}

