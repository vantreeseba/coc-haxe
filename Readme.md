# coc-haxe

Haxe language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

Language server features provided by [haxe-language-server](https://github.com/vshaxe/haxe-language-server).

## Looking for haxe highlighting in neovim?
check out: https://github.com/vantreeseba/tree-sitter-haxe

## Install

In your vim/neovim, run command:

```
:CocInstall coc-haxe
```

## Configuration options

- "haxe.useModule":

      Use the haxe language server module. (Non module not supported ATM),  default: `true`

- "haxe.modulePath":

      Use haxe language server module at given path.,  default: `../bin/server`

- "haxe.hxml":

      The HXML file to use for building the project.,  default: `build.hxml`


Trigger completion in `coc-settings.json` to get full list of options.

## Commands

- `haxe.goToHxml` jump to the current hxml in the configuration. 
- `haxe.changeHxml some.hxml` tell haxe language server to use another hxml.
- `haxe.restart` restarts the coc client for haxe language server. 
- `haxe.printConfig` prints the current haxe language server config. 

## License

MIT
