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

function resolveServerModule(config) {
  if (config.useModule) {
    let modulePath = requireFunc.resolve(config.modulePath)
    if (!fs.existsSync(modulePath)) {
      window.showErrorMessage('Haxe server module not found!')
      return
    }
    return modulePath
  } else {
    window.showErrorMessage('External server not supported yet.')
    return
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  let {subscriptions} = context
  const config = workspace.getConfiguration('haxe')
  if (config.enable === false) return

  const selector = [{
    language: 'haxe',
    scheme: 'file',
    //     pattern: '*.hx'
  }, {
    language: 'hxml',
    scheme: 'file',
    //     pattern: '*.hxml'
  }]

  let serverOptions: ServerOptions = {
    module: resolveServerModule(config),
    transport: TransportKind.stdio,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || []
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
      displayArguments: [config.hxml],
      config: getConfig(config)
    },
  }

  let client = new LanguageClient('haxe', 'Haxe Language Server', serverOptions, clientOptions)
  subscriptions.push(
    services.registLanguageClient(client)
  )

  Commands.forEach(cmd => {
    var c = new cmd(client)
    window.showInformationMessage(`registering: ${c.title}`);
    subscriptions.push(commands.registerCommand(c.title, c.execute, c))
  })

  client.onReady().then(() => {
    registerCustomClientNotificationHandlers(client)
  }).catch(_e => {
    // noop
    window.showInformationMessage('Haxe language server client failed.')
  })



}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', window.showInformationMessage)
  client.onNotification('$/displayWarning', window.showWarningMessage)
  client.onNotification('$/displayError', window.showErrorMessage)
}
