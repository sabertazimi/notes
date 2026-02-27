---
sidebar_position: 1
tags: [Programming, Linux, Git]
---

# Configuration

- `/etc/gitconfig`.
- `~/.gitconfig` 或 `~/.config/git/config`.
- `repo/.git/config`.

## Setup

[Configure git](https://blog.gitbutler.com/how-git-core-devs-configure-git):

```bash
git config --global user.name "sabertazimi"
git config --global user.email sabertazimi@gmail.com
git config --global core.autocrlf false
git config --global core.editor nvim
git config --global credential.helper store
git config --global color.ui true
git config --global commit.template ~/.gitmsg.md
```

```bash
git config --global init.defaultBranch main
git config --global merge.conflictstyle diff3
git config --global push.default simple
git config --global push.autoSetupRemote true
git config --global pull.rebase true
git config --global fetch.prune true
git config --global fetch.pruneTags true
git config --global fetch.all true
git config --global rebase.autoSquash true
git config --global rebase.autoStash true
git config --global rebase.updateRefs true
```

```bash
git config --global diff.algorithm histogram
git config --global diff.colorMoved plain
git config --global diff.mnemonicPrefix true
git config --global diff.renames true
```

```bash
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.dark true
git config --global delta.line-numbers true
git config --global delta.side-by-side true
git config --global merge.conflictStyle zdiff3
```

```bash
git config --global alias.s "status"
git config --global alias.c "commit --verbose"
git config --global alias.a "add"
git config --global alias.rs "restore --staged"
git config --global alias.st "stash"
git config --global alias.pr "pull --rebase"
git config --global alias.d '!sh -c "git diff --cached | cat"'
```

```bash
git config --global help.autocorrect 10
```

## GPG

[Generate new GPG key](https://docs.github.com/authentication/managing-commit-signature-verification/generating-a-new-gpg-key):

```bash
# Generate GPG key
gpg --full-generate-key
# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Export GPG public key as an ASCII armored version
gh auth refresh -s write:gpg_key
gpg --armor --export <pub-keyID> | gh gpg-key add --title "Arch Linux" -

# Export GPG private key as an ASCII armored version
# gpg --armor --export-secret-key sabertazimi@gmail.com -w0

# Git global configuration for GPG signature commits
git config --global commit.gpgsign true
git config --global gpg.program gpg
git config --global user.signingkey <pub-keyID>

# Import GitHub `git log --show-signature` signature
curl https://github.com/web-flow.gpg | gpg --import
# gpg --sign-key <GitHub-keyID>
gpg --sign-key B5690EEEBB952194

# Log git signature
git log --show-signature

# WSL2 fix: Add to ~/.zshrc
export GPG_TTY=$(tty)

# Single signature commit
git commit -S -m "..."
```

[Update existing GPG key](https://inspirezone.tech/using-gpg-keys-on-github):

```bash
gpg --edit-key <pub-keyID>
> expire
> passwd
> save
```

After this
[update](https://github.blog/changelog/2022-05-31-improved-verification-of-historic-git-commit-signatures)
commits signed with expired GPG key (before it expired)
no longer become `unverified` state.

```bash
git config --global commit.gpgsign true
git config --global gpg.program gpg
git config --global user.signingkey <pub-keyID>
```

## Proxy

```bash
# GitHub proxy.
git config --global url."https://ghfast.top/https://github.com/".insteadOf "https://github.com/"

# Socks5 proxy.
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'

# Post buffer configuration.
git config --global http.postbuffer 524288000
git config --global https.postbuffer 1048576000
```

:::caution[DNS Pollution]

To fix `SSL_ERROR_SYSCALL in connection to github.com:443`:

- Ensure git configuration correct.
- Ensure socks5 proxy stay working.
- Change DNS server configuration (`8.8.8.8`).

:::

## List

```bash
git config --list
git --help
man git-xxx
git help
git help config
```

## Ignore File

文件 `.gitignore` 的格式规范如下：

- 所有空行或者以 # 开头的行都会被 Git 忽略.
- 可以使用标准的 glob 模式 (简化正则表达式) 匹配.
- 匹配模式可以以 `/` 开头防止递归.
- 匹配模式可以以 `/` 结尾指定目录.
- 要跟踪指定模式以外的文件或目录, 可以在模式前加上惊叹号 `!` 取反.
- GitHub gitignore [style](https://github.com/github/gitignore).

```bash
# no .a files
*.a

# but do track lib.a, even though you're ignoring .a files above
!lib.a

# only ignore the TODO file in the current directory, not subDir/TODO
/TODO

# ignore all files in the build/ directory
build/

# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt

# ignore all .pdf files in the doc/ directory
doc/**/*.pdf
```
