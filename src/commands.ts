import {LanguageClient, workspace} from 'coc.nvim'

export interface Command {
  readonly id: string | string[]
  execute(...args: any[]): void | Promise<any>
}

export class RestartClientCommand implements Command {
  public readonly id = 'haxe.restart'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public execute(): void {
    workspace.showMessage('projects reloaded')
  }
}
