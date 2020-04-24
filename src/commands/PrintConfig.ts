import {LanguageClient, workspace} from 'coc.nvim'
import Command from './Command'

export default class RestartClientCommand implements Command {
  public readonly id = 'haxe.printConfig'

  public constructor(
    private readonly client: LanguageClient
  ) {
  }

  public execute(): void {
    workspace.showMessage(JSON.stringify(workspace.getConfiguration('haxe')));
  }
}


