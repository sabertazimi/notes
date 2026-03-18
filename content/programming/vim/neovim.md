---
sidebar_position: 20
tags: [Programming, Vim, Neovim]
---

# Neovim

```bash
brew install neovim
winget install Neovim.Neovim
sudo apt install neovim
```

## `LazyVim`

[`LazyVim`](https://github.com/LazyVim/LazyVim) setup:

```bash
mv ~/.config/nvim{,.bak}
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
git clone --depth=1 https://github.com/LazyVim/starter ~/.config/nvim
```

## `AstroNvim`

[`AstroNvim`](https://github.com/AstroNvim/AstroNvim) setup:

```bash
mv ~/.config/nvim{,.bak}
mv ~/.local/share/nvim{,.bak}
mv ~/.local/state/nvim{,.bak}
mv ~/.cache/nvim{,.bak}
git clone --depth=1 https://github.com/AstroNvim/template ~/.config/nvim
```

## Extras Plugins

`LazyVim` extras plugins (`~/.config/nvim/lazyvim.json`):

```json
{
  "extras": [
    "lazyvim.plugins.extras.editor.aerial",
    "lazyvim.plugins.extras.lang.go",
    "lazyvim.plugins.extras.lang.json",
    "lazyvim.plugins.extras.lang.markdown",
    "lazyvim.plugins.extras.lang.python",
    "lazyvim.plugins.extras.lang.rust",
    "lazyvim.plugins.extras.lang.tailwind",
    "lazyvim.plugins.extras.lang.toml",
    "lazyvim.plugins.extras.lang.typescript",
    "lazyvim.plugins.extras.lang.yaml",
    "lazyvim.plugins.extras.linting.eslint"
  ],
  "install_version": 8,
  "version": 8
}
```

`LazyVim` extras plugins 位于 `~/.local/share/nvim/lazy/LazyVim/lua/lazyvim/plugins/extras`.

## Community Plugins

`AstroNvim` community plugins (`~/.config/nvim/lua/community.lua`):

```lua
return {
  "AstroNvim/astrocommunity",
  { import = "astrocommunity.pack.lua" },
  { import = "astrocommunity.colorscheme.catppuccin" },
  { import = "astrocommunity.completion.copilot-lua-cmp" },
  -- import/override with your plugins folder
}
```

See plugins list on [Astro Community](https://github.com/AstroNvim/astrocommunity).

## Language Server

[LSP Config](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md):

```vim
:LspInstall typescript
```

:::tip[Logs]

`:Inspect` 显示 highlight group, `:messages` 显示日志信息.

:::

## ESLint

Configuration (`~/.config/nvim/lua/plugins/lsp.lua`):

```lua
return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        eslint = {
          filetypes = {
            "javascript",
            "javascriptreact",
            "typescript",
            "typescriptreact",
            "vue",
            "html",
            "markdown",
            "json",
            "jsonc",
            "yaml",
            "toml",
            "xml",
            "graphql",
            "astro",
            "svelte",
            "css",
            "less",
            "scss",
          },
        },
      },
    },
  },
}
```

## Spell

`zg` 添加到字典 (`~/.config/nvim/spell/en.utf-8.add` 或 `~/.vim/spell/en.utf-8.add`).

Key binding to rebuild dictionary (`~/.config/nvim/lua/config/keymaps.lua`):

```lua
local wk = require("which-key")

local spell_lang = "en"
local spell_file = vim.fn.stdpath("config") .. "/spell/" .. spell_lang .. ".utf-8.add"

wk.add({
  {
    "<leader>um",
    function()
      vim.cmd("mkspell! " .. spell_file)
      vim.notify("Spell dictionary rebuilt: " .. spell_file, vim.log.levels.INFO)
    end,
    desc = "Rebuild Spell Dictionary",
    icon = "󰓫 ",
  },
})
```

Spell options (`~/.config/nvim/lua/config/options.lua`):

```lua
vim.opt.spelllang = { "en", "cjk" }
vim.opt.spell = true
vim.opt.spelloptions = "camel"
```

:::tip[Grammar]

`:LspInstall harper_ls` Grammarly LSP with `<Leader>ca` LSP code action.

:::

## Markdown

关闭 render 和 conceal.

`~/.config/nvim/lua/plugins/markdown.lua`:

```lua
return {
  {
    "MeanderingProgrammer/render-markdown.nvim",
    opts = {
      enabled = false,
    },
  },
}
```

`~/.config/nvim/lua/config/autocmds.lua`:

```lua
vim.api.nvim_create_autocmd("FileType", {
  pattern = { "markdown" },
  callback = function()
    vim.opt_local.conceallevel = 0
  end,
})
```

## Clipboard

```bash
sudo pacman -S wl-clipboard
# :checkhealth vim.provider
```

## `flash.nvim`

[`flash.nvim`](https://github.com/folke/flash.nvim) key bindings:

| Key | Command                  |
| :-- | :----------------------- |
| `s` | Search character         |
| `f` | Find character forwards  |
| `F` | Find character backwards |
| `t` | Til character forwards   |
| `T` | Til character backwards  |
