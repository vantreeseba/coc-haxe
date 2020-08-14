import {LanguageClient, workspace} from 'coc.nvim'
import Command from './Command';

export default class HaxeChangeHxmlCommand implements Command {
  public readonly id = 'haxe.changeHxml'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public async execute(hxml: string): Promise<void> {
    // var config = {settings: {haxe: {hxml}}};
    // this.client.sendNotification("workspace/didChangeConfiguration", config);
    this.client.sendNotification("haxe/didChangeDisplayArguments", [hxml]);
    // workspace.showMessage("Changed hxml to: " + hxml);
  }
}

