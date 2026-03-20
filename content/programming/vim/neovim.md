---
sidebar_position: 20
tags: [Programming, Vim, Neovim]
---

# Neovim

```bash
sudo pacman -S neovim
brew install neovim
winget install Neovim.Neovim
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

Config `LazyVim` extras plugins [`~/.config/nvim/lazyvim.json`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lazyvim.json),
installed in `~/.local/share/nvim/lazy/LazyVim/lua/lazyvim/plugins/extras`.

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

- `K`: `vim.lsp.buf.hover()` show types.

## Linter

Config ESLint LSP server
[`~/.config/nvim/lua/plugins/lsp.lua`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lua/plugins/lsp.lua):

- `<Sapce>xq`: show quick fix list.
- `]q`: jump to next quick fix.
- `<Space>xx`: show diagnostics list.
- `]d`: jump to next diagnostic.
- `<C-w>d`: show diagnostics under the cursor.

## Spell

:::tip[Grammar]

`:LspInstall harper_ls` Grammarly LSP with `<Leader>ca` LSP code action.

:::

### Option

Enable spell options
[`~/.config/nvim/lua/config/options.lua`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lua/config/options.lua):

```lua
vim.opt.spelllang = { "en", "cjk" }
vim.opt.spell = true
vim.opt.spelloptions = "camel"
```

### Dictionary

- `zg` 添加到字典 (`~/.config/nvim/spell/en.utf-8.add` 或 `~/.vim/spell/en.utf-8.add`).
- Rebuild dictionary with `mkspell!`
  [`~/.config/nvim/lua/config/keymaps.lua`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lua/config/keymaps.lua).

## Markdown

关闭 render [`~/.config/nvim/lua/plugins/markdown.lua`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lua/plugins/markdown.lua)
和 conceal [`~/.config/nvim/lua/config/autocmds.lua`](https://github.com/sabertazimi/dotfiles/blob/main/dot_config/nvim/lua/config/autocmds.lua).

## Clipboard

```bash
sudo pacman -S wl-clipboard
```

```vim
:checkhealth vim.provider
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

## Telescope

`<Esc>`/`<C-[` enter normal mode:

- `?`: help menu.
- `<M-w>`: cycle window.
- `<C-Q>`: send to [quick fix](./toolchain.md#quick-fix) list.

:::tip[Quick Traverse]

Use `<C-Q>` to send to quick fix list,
then use `]q` to quick traverse.

:::

## Debugging

- `:help` 显示文档: e.g. `:help vim.opt`.
- `:Inspect` (`<Space>ui`) 显示 highlight group.
- `:messages` 显示日志信息.
