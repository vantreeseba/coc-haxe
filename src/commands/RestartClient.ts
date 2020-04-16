import {LanguageClient, workspace} from 'coc.nvim'
import Command from './Command'

export default class RestartClientCommand implements Command {
  public readonly id = 'haxe.restart'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public execute(): void {
    workspace.showMessage('projects reloaded')
  }
}


