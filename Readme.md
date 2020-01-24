# coc-haxe

Haxe language server extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

Using [haxe-language-server](https://github.com/vshaxe/haxe-language-server).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-haxe
```

## Features

Language server features provided by [haxe-language-server](https://github.com/vshaxe/haxe-language-server).

## Configuration options

- "haxe.useModule":

      Use the haxe language server module. (Non module not supported ATM),  default: `true`

- "haxe.modulePath":

      Use haxe language server module at given path.,  default: `../bin/server`

- "haxe.hxml":

      The HXML file to use for building the project.,  default: `build.hxml`


Trigger completion in `coc-settings.json` to get full list of options.

## License

MIT
