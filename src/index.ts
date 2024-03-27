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
  window,
} from 'coc.nvim';
import Commands from './commands';
import fs from 'fs';

const sections = ['haxe'];

function getConfig(config: WorkspaceConfiguration): any {
  let res = {};
  for (let section of sections) {
    let o = config.get<any>(section);
    res[section] = o || {};
  }
  return res;
}

function resolveServerModule(config: WorkspaceConfiguration): string {
  if (config.useModule) {
    let modulePath = require.resolve(config.modulePath);
    if (!fs.existsSync(modulePath)) {
      const err = 'Haxe server module not found!';
      window.showErrorMessage(err);
      throw new Error(err);
    }
    return modulePath;
  } else {
    const err = 'External haxe server not supported yet.';
    window.showErrorMessage(err);
    throw new Error(err);
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  let { subscriptions } = context;
  const config = workspace.getConfiguration('haxe');
  if (config.enable === false) return;

  let serverOptions: ServerOptions = {
    module: resolveServerModule(config),
    transport: TransportKind.stdio,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || [],
    },
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: ['haxe', 'hxml'],
    synchronize: {
      configurationSection: sections,
      fileEvents: workspace.createFileSystemWatcher('**/*.hx*', false, false, false),
    },
    outputChannelName: 'haxe',
    initializationOptions: {
      displayArguments: [config.hxml],
      config: getConfig(config),
    },
  };

  let client = new LanguageClient('haxe', 'Haxe Language Server', serverOptions, clientOptions);
  subscriptions.push(services.registLanguageClient(client));

  Commands.forEach((cmd) => {
    var c = new cmd(client);
    window.showInformationMessage(`registering: ${c.title}`);
    subscriptions.push(commands.registerCommand(c.title, c.execute, c));
  });

  client
    .onReady()
    .then(() => {
      registerCustomClientNotificationHandlers(client);
    })
    .catch((_e) => {
      // noop
      window.showInformationMessage('Haxe language server client failed.');
    });
}

function registerCustomClientNotificationHandlers(client: LanguageClient): void {
  client.onNotification('$/displayInfo', window.showInformationMessage);
  client.onNotification('$/displayWarning', window.showWarningMessage);
  client.onNotification('$/displayError', window.showErrorMessage);
}
