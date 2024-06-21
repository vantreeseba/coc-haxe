import { window, workspace } from 'coc.nvim';
import HaxeCommand from './HaxeCommand';

export default class CompileCommand extends HaxeCommand {
  public readonly title = 'haxe.compile';
  public readonly command = 'haxe.compile';

  public async execute(): Promise<void> {
    let hxml = workspace.getConfiguration('haxe').hxml;
    let doc = workspace.workspaceFolder;

    if (!hxml) {
      hxml = await this.pickHxml();
    }

    if (doc) {
      window.showMessage('compiling with: ' + hxml);

      window.openTerminal('haxe ' + hxml, {
        cwd: workspace.root,
        autoclose: true,
      });
    }
  }
}
