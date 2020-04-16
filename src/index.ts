import {commands, ExtensionContext, LanguageClient, ServerOptions, workspace, services, TransportKind, LanguageClientOptions, WorkspaceConfiguration} from 'coc.nvim'
import {DocumentSelector} from 'vscode-languageserver-protocol'
import Command from './commands/Command'
import Commands from './commands'
import fs from 'fs'
declare var __webpack_require__: any
declare var __non_webpack_require__: any
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require

const sections = [];

function getConfig(config: WorkspaceConfiguration): any {
  let res = {}
  for (let section of sections) {
    let o = config.get<any>(section)
    res[section] = o || {}
  }
  return res
}

export async function activate(context: ExtensionContext): Promise<void> {
  let {subscriptions} = context
  let c = workspace.getConfiguration()
  const haxeConfig = c.get('haxe') as any
  const enable = haxeConfig.enable
  if (enable === false) return
  let file: string

  if (haxeConfig.useModule) {
    file = requireFunc.resolve(haxeConfig.modulePath)
    if (!fs.existsSync(file)) {
      workspace.showMessage(`haxe server module not found!`, 'error')
      return
    }
  } else {
    workspace.showMessage('External server not supported yet.', 'error')
    return;
  }

  const selector: DocumentSelector = [{
    language: 'haxe',
    scheme: 'file'
  }]

  let serverOptions: ServerOptions = {
    module: file,
    transport: TransportKind.stdio,
    options: {
      cwd: workspace.root,
      execArgv: haxeConfig.execArgv || []
    }
  }

  workspace.showMessage("Started server with: " + JSON.stringify(haxeConfig), 'more');

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.hx', false, false, false)
    },
    outputChannelName: 'haxe',
    initializationOptions: {
      displayArguments: [haxeConfig.hxml],
      config: getConfig(c)
    },
  }

  let client = new LanguageClient('haxe', 'Haxe Language Server', serverOptions, clientOptions)
  workspace.showMessage('Haxe language server client starting.', 'more')
  client.onReady().then(() => {
    workspace.showMessage('Haxe language server client started.', 'more')
    registerCustomClientNotificationHandlers(client)
  }).catch(_e => {
    // noop
  })

  function registerCommand(cmd: Command): void {
    let {id, execute} = cmd
    subscriptions.push(commands.registerCommand(id as string, execute, cmd))
  }

  Commands.forEach(cmd => registerCommand(new cmd(client)))

  subscriptions.push(
    services.registLanguageClient(client)
  )

  // languages.registerCodeActionProvider(
  // languageIds,
  // new QuickfixProvider(client),
  // 'tsserver',
  // [CodeActionKind.QuickFix]);
}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', (msg: string) => {
    workspace.showMessage(msg, 'more')
  })
  client.onNotification('$/displayWarning', (msg: string) => {
    workspace.showMessage(msg, 'warning')
  })
  client.onNotification('$/displayError', (msg: string) => {
    workspace.showMessage(msg, 'error')
  })
}
