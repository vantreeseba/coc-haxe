import {LanguageClient, workspace} from 'coc.nvim'
import {CancellationToken, CodeAction, CodeActionContext, CodeActionKind, Diagnostic, Range, TextDocument} from 'vscode-languageserver-protocol'

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
    // this.client.restart();
    workspace.showMessage('projects reloaded')
  }
}

class ApplyFixAllCodeAction implements Command {
  public static readonly ID = '_haxe.applyFixAllCodeAction'
  public readonly id = ApplyFixAllCodeAction.ID

  constructor(
    private readonly client: LanguageClient,
  ) {}

  public async execute(
  ): Promise<void> {
  }
}
