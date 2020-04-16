import {LanguageClient, workspace} from 'coc.nvim'
// import { URI } from 'vscode-uri';
import path from 'path';

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

export class HaxeGotoHxmlCommand implements Command {
  public readonly id = 'haxe.goToHxml'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public async execute(): Promise<void> {
    let hxml = workspace.getConfiguration('haxe').hxml;
    let doc = workspace.workspaceFolder
    await goToProjectConfig(path.join(doc.uri,hxml))
  }
}

async function goToProjectConfig(uri: string): Promise<void> {
  workspace.showMessage('HXML: ' + uri)
  await workspace.openResource(uri)
}
