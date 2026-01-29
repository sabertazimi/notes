---
sidebar_position: 13
tags: [AI, Language, Python, I/O, CLI, Process, Bash]
---

# Command Line

## Input

`input(prompt)`: read a line from the user.

## Subprocess

### Environment Variables

`subprocess.run()` 默认继承父进程所有环境变量 (`VIRTUAL_ENV`、`PATH` etc.):

```python
subprocess.run(["bash", "-c", "echo $VIRTUAL_ENV"], capture_output=True, text=True)
```

通过 `env` 自定义环境变量:

```python
# 隔离：清空环境
subprocess.run(["bash", "-c", command], env={})

# 自定义环境
env = {
    "PATH": "/usr/bin:/bin",
    "HOME": os.environ.get("HOME", ""),
}

# 加载 ~/.bashrc（让 alias/function 生效）
env["BASH_ENV"] = str(Path.home() / ".bashrc")

subprocess.run(["bash", "-c", command], env=env)
```

### Non-Interactive Shell

`bash -c "command"` 是 non-interactive shell, 不加载用户配置文件:

```bash
echo $-  # hBc (不含 'i')
```

| Shell 类型             | 加载的配置文件                                   |
| ---------------------- | ------------------------------------------------ |
| Interactive login      | `/etc/profile` → `~/.bash_profile` → `~/.bashrc` |
| Interactive non-login  | `~/.bashrc`                                      |
| Non-interactive (`-c`) | 无                                               |

| 特性     | Non-Interactive       |
| -------- | --------------------- |
| Alias    | ❌ `~/.bashrc` 未加载 |
| Function | ❌ `~/.bashrc` 未加载 |
| 环境变量 | ✅ 从父进程继承       |

## Click

```python
import click

from caesar_encryption import encrypt

@click.command()
@click.option(
    '--input_file',
    type=click.File('r'),
    help='File in which there is the text you want to encrypt/decrypt.'
         'If not provided, a prompt will allow you to type the input text.',
)
@click.option(
    '--output_file',
    type=click.File('w'),
    help='File in which the encrypted / decrypted text will be written.'
         'If not provided, the output text will just be printed.',
)
@click.option(
    '--decrypt/--encrypt',
    '-d/-e',
    help='Whether you want to encrypt the input text or decrypt it.'
)
@click.option(
    '--key',
    '-k',
    default=1,
    help='The numeric key to use for the caesar encryption / decryption.'
)
def caesar(input_file, output_file, decrypt, key):
    if input_file:
        text = input_file.read()
    else:
        text = click.prompt('Enter a text', hide_input=not decrypt)
    if decrypt:
        key = -key
    cypherText = encrypt(text, key)
    if output_file:
        output_file.write(cypherText)
    else:
        click.echo(cypherText)

if __name__ == '__main__':
    caesar()
```

## Progress

```python
import click
import enchant

from tqdm import tqdm

from caesar_encryption import encrypt

@click.command()
@click.option(
    '--input_file',
    type=click.File('r'),
    required=True,
)
@click.option(
    '--output_file',
    type=click.File('w'),
    required=True,
)
def caesar_breaker(input_file, output_file):
    cypherText = input_file.read()
    english_dictionary = enchant.Dict("en_US")
    best_number_of_english_words = 0
    for key in tqdm(range(26)):
        plaintext = encrypt(cypherText, -key)
        number_of_english_words = 0
        for word in plaintext.split(' '):
            if word and english_dictionary.check(word):
                number_of_english_words += 1
        if number_of_english_words > best_number_of_english_words:
            best_number_of_english_words = number_of_english_words
            best_plaintext = plaintext
            best_key = key
    click.echo(
        f'The most likely encryption key is {best_key}. It gives the following plaintext:\n\n'
        f'{best_plaintext[:1000]}...'
    )
    output_file.write(best_plaintext)

if __name__ == '__main__':
    caesar_breaker()
```
