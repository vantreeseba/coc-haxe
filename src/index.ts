import {commands, ExtensionContext, LanguageClient, ServerOptions, workspace, services, TransportKind, LanguageClientOptions, WorkspaceConfiguration, ProvideCompletionItemsSignature} from 'coc.nvim'
import {TextDocument, Position, CompletionItem, CompletionList, InsertTextFormat, DocumentSelector} from 'vscode-languageserver-protocol'
// import {CompletionContext} from 'vscode-languageserver-protocol'
// import {CancellationToken} from 'vscode-jsonrpc'
import {Command, RestartClientCommand} from './commands'
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
  const config = c.get('haxe') as any
  const enable = config.enable
  if (enable === false) return
  let file: string
  if (config.useInternal) {
    file = requireFunc.resolve('../bin/server')
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
      execArgv: config.execArgv || []
    }
  }

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.[tj]s', true, false, true)
    },
    outputChannelName: 'haxe',
    initializationOptions: {
      displayArguments: ["build.hxml"],
      config: getConfig(c)
    },
    // middleware: {
      // provideCompletionItem: (
        // document: TextDocument,
        // position: Position,
        // context: CompletionContext,
        // token: CancellationToken,
        // next: ProvideCompletionItemsSignature
      // ) => {
        // return Promise.resolve(next(document, position, context, token)).then((res: CompletionItem[] | CompletionList) => {
          // let doc = workspace.getDocument(document.uri)
          // if (!doc || !res) return []
          // let items: CompletionItem[] = res.hasOwnProperty('isIncomplete') ? (res as CompletionList).items : res as CompletionItem[]
          // let pre = doc.getline(position.line).slice(0, position.character)
          // // searching for class name
          // if (/(^|\s)\.\w*$/.test(pre)) {
            // items = items.filter(o => o.label.startsWith('.'))
            // items.forEach(fixItem)
          // }
          // if (context.triggerCharacter == ':'
            // || /\:\w*$/.test(pre)) {
            // items = items.filter(o => o.label.startsWith(':'))
            // items.forEach(fixItem)
          // }
          // return items
        // })
      // }
    // }
  }

  let client = new LanguageClient('haxe', 'Haxe Language Server', serverOptions, clientOptions)
  workspace.showMessage('Haxe language server client starting.', 'more')
  client.onReady().then((x) => {
    workspace.showMessage('Haxe language server client started.', 'more')
    registerCustomClientNotificationHandlers(client)
  }).catch(_e => {
    // noop
  })


  function registCommand(cmd: Command): void {
    let { id, execute } = cmd
    subscriptions.push(commands.registerCommand(id as string, execute, cmd))
  }


  subscriptions.push(
    services.registLanguageClient(client)
  )

  registCommand(new RestartClientCommand(client))

  languages.registerCodeActionProvider(
        languageIds,
        new QuickfixProvider(client),
        'tsserver',
        [CodeActionKind.QuickFix]))
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

function fixItem(item: CompletionItem): void {
  item.data = item.data || {}
  item.data.abbr = item.label
  item.label = item.label.slice(1)
  item.textEdit = null
  item.insertTextFormat = InsertTextFormat.PlainText
}
