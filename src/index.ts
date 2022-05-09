import {
  commands,
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  TransportKind,
  LanguageClientOptions,
  WorkspaceConfiguration,
  window
} from 'coc.nvim'
import {DocumentSelector} from 'vscode-languageserver-protocol'
import Command from './commands/Command'
import Commands from './commands'
import fs from 'fs'
declare var __webpack_require__: any
declare var __non_webpack_require__: any
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require

const sections = ['haxe']

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
  let modulePath: string

  if (haxeConfig.useModule) {
    modulePath = requireFunc.resolve(haxeConfig.modulePath)
    if (!fs.existsSync(modulePath)) {
      window.showMessage(`haxe server module not found!`, 'error')
      return
    }
  } else {
    window.showMessage('External server not supported yet.', 'error')
    return
  }

  const selector: DocumentSelector = [{
    language: 'haxe',
    scheme: 'file'
  }, {
    language: 'hxml',
    scheme: 'file'
  }]

  let serverOptions: ServerOptions = {
    module: modulePath,
    transport: TransportKind.stdio,
    options: {
      cwd: workspace.root,
      execArgv: haxeConfig.execArgv || []
    }
  }

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.hx*', false, false, false)
    },
    outputChannelName: 'haxe',
    initializationOptions: {
      displayArguments: [haxeConfig.hxml],
      config: getConfig(c)
    },
  }

  let client = new LanguageClient('haxe', 'Haxe Language Server', serverOptions, clientOptions)
  client.onReady().then(() => {
    registerCustomClientNotificationHandlers(client)
  }).catch(_e => {
    // noop
    window.showMessage('Haxe language server client failed.', 'more')
  })

  function registerCommand(cmd: Command): void {
    let {id, execute} = cmd
    subscriptions.push(commands.registerCommand(id as string, execute, cmd))
  }

  Commands.forEach(cmd => {
    var c = new cmd(client)
    window.showMessage('registering: ' + c.id);
    registerCommand(c)
  })

  subscriptions.push(
    services.registLanguageClient(client)
  )
}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', (msg: string) => {
    window.showMessage(msg, 'more')
  })
  client.onNotification('$/displayWarning', (msg: string) => {
    window.showMessage(msg, 'warning')
  })
  client.onNotification('$/displayError', (msg: string) => {
    window.showMessage(msg, 'error')
  })
}
