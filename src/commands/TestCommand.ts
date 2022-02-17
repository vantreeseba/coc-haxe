import {LanguageClient, workspace} from 'coc.nvim'
import path from 'path';
import Command from './Command';

export default class TestCommand implements Command {
  public readonly id = 'haxe.test'

  public constructor(
    private readonly client: LanguageClient
  ) {}

  public async execute(): Promise<void> {
    workspace.showMessage('test command ran.');
  }
}
