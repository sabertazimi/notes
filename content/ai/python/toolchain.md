---
sidebar_position: 1
tags: [AI, Language, Python, Toolchain, UV]
---

# Toolchain

## Installation

```bash
scoop install main/uv
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc
echo 'eval "$(uvx --generate-shell-completion bash)"' >> ~/.bashrc
```

```bash
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"
rm ~/.local/bin/uv ~/.local/bin/uvx
```

## Mirrors

```bash
# Python mirror
export UV_PYTHON_INSTALL_MIRROR="https://gh-proxy.com/github.com/indygreg/python-build-standalone/releases/download"
# PyPI mirror
export UV_DEFAULT_INDEX="https://mirrors.aliyun.com/pypi/simple"
```

## Python

Install Python:

```bash
uv python install 3.14
uv python list
uvx python@3.14 -c "print('hello world')"
```

## Initialization

```bash
uv init hello-app
uv init --package hello-package
uv init --lib hello-lib
uv init --script hello-script.py --python 3.14
```

## Dependencies

Manage dependencies:

```bash
uv add 'requests==2.31.0' # 增加依赖
uv add -r requirements.txt # Import from requirements files
uv lock --upgrade-package requests # 更新项目依赖
uv remove requests # 删除项目依赖

uv sync
uv tree --outdated
uv tree --depth 2
uv run main.py
```

:::tip[Distribution and Import]

Python 中存在两个不同的[包名](https://packaging.python.org/en/latest/discussions/distribution-package-vs-import-package)：

| 概念     | 英文术语             | 示例            | 用途                  |
| -------- | -------------------- | --------------- | --------------------- |
| 分发包名 | Distribution Package | `python-dotenv` | `uv add xxx`          |
| 导入包名 | Import Package       | `dotenv`        | `from xxx import ...` |

安装包后, `site-packages` 目录会包含两类文件夹:

- `*.dist-info/` 目录名对应 **PyPI 包名**
- 源码目录名对应**导入名**
- `top_level.txt` 文件记录了导入名映射

```bash
# 查看包安装位置和版本
uv pip show python-dotenv

# 查看依赖树
uv tree
```

- [PEP 427](https://peps.python.org/pep-0427): Wheel 格式规范（定义 `.dist-info`）.
- [PEP 503](https://peps.python.org/pep-0503): 包名规范化.
- `.dist-info` [目录结构](https://packaging.python.org/en/latest/specifications/recording-installed-packages).

:::

## Lockfile

Create lockfile:

```bash
uv lock
```

## Virtual Environment

Manage virtual environments:

```bash
# 创建并激活虚拟环境
uv venv
source .venv/bin/activate

# 退出虚拟环境
deactivate

# 强制安装基础包（如 pip, setuptools, wheel）
uv venv --seed
```

## Scripts

Run standalone scripts:

```bash
uv init --script example.py --python 3.13
uv add --index "https://mirrors.aliyun.com/pypi/simple" --script example.py 'requests<3' 'rich'
uv run example.py
```

## Tools

### Execution

```bash
uv tool install black
uv tool run black ./myfile.py

uvx pycowsay 'hello world!'
uvx python@3.13.2 -c "print('hello world')"
```

### Development

Hot reload:

```bash
uv tool install --editable packages/agent-cli
```

## Project

```toml
[project]
name = "project"
version = "0.1.0"
requires-python = ">=3.12.0"
dependencies = [ "torch>=2.6.0" ]

[tool.uv.sources]
torch = [
  { index = "pytorch-cpu", marker = "sys_platform != 'linux'" },
  { index = "pytorch-cu124", marker = "sys_platform == 'linux'" },
]

[[tool.uv.index]]
name = "pytorch-cpu"
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
explicit = true

[[tool.uv.index]]
name = "pytorch-cu124"
url = "https://mirror.sjtu.edu.cn/pytorch-wheels/cu124"
explicit = true
```

## Workspace

### Monorepo

```toml
[project]
name = "albatross"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "bird-feeder",
  "tqdm>=4,<5",
]

[tool.uv.sources]
bird-feeder = { workspace = true }

[tool.uv.workspace]
members = [ "packages/*" ]
exclude = [ "packages/seeds" ]
```

```bash
albatross
├── packages
│   ├── bird-feeder
│   │   ├── pyproject.toml
│   │   └── src
│   │       └── bird_feeder
│   │           ├── __init__.py
│   │           └── foo.py
│   └── seeds
│       ├── pyproject.toml
│       └── src
│           └── seeds
│               ├── __init__.py
│               └── bar.py
├── pyproject.toml
├── README.md
├── uv.lock
└── src
    └── albatross
        └── main.py
```

### Package

```bash
# Initialize package
uv init --package packages/bash-agent

# Add workspace package as dependency
uv add --workspace bash-agent

# Run package
uv run bash-agent
```

```toml
[project]
name = "bash-agent"
version = "0.1.0"
description = "Minimal Claude Code."
readme = "README.md"
requires-python = ">=3.13"

[project.scripts]
bash-agent = "bash_agent:main"

[build-system]
requires = [ "uv_build>=0.9.27,<0.10.0" ]
build-backend = "uv_build"
```

### Command

```bash
uv add --package bash-agent anthropic python-dotenv
```

## Caching

```bash
uv cache dir
uv cache clean
uv cache prune
```

## Dockerfile

```Dockerfile
FROM python:3.12-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ENV UV_SYSTEM_PYTHON=1

# Copy the project into the image
ADD . /app

WORKDIR /app

# Install dependencies
RUN uv sync --locked

# Install requirements
COPY requirements.txt .
RUN uv pip install -r requirements.txt

CMD ["uv", "run", "my_app"]
```

## Linter

```bash
uv add --dev pyright ruff
```

```toml
[tool.pyright]
typeCheckingMode = "strict"
include = [ "packages" ]
extraPaths = [ "packages/agent-cli/src" ]

[tool.ruff.lint]
select = [
  "E", # pycodestyle
  "F", # Pyflakes
  "UP", # pyupgrade
  "B", # flake8-bugbear
  "SIM", # flake8-simplify
  "I", # isort
]
ignore = [ "E501" ] # 忽略行长度限制
```

```bash
uvx ruff check
uvx ruff format ./script.py
```

## Library

### ASGI

- [FastAPI](https://github.com/fastapi/fastapi):
  High-performance web framework.
- [Uvicorn](https://github.com/Kludex/uvicorn):
  ASGI web server.

### HTTP

- [HTTPX](https://github.com/encode/httpx):
  Next generation HTTP client.
- [Requests](https://github.com/psf/requests):
  HTTP client for humans.
- [DDGS](https://github.com/deedy5/ddgs):
  DuckDuckGo search.
- [Markdownify](https://github.com/matthewwithanm/python-markdownify):
  Convert HTML to Markdown.

### UI

- [Rich](https://github.com/Textualize/rich):
  Rich text and beautiful formatting for terminal.
- [Textual](https://github.com/Textualize/textual):
  Build sophisticated user interfaces.
- [Progress](https://github.com/tqdm/tqdm):
  Fast, Extensible Progress Bar for CLI.
- [IPython](https://github.com/ipython/ipython):
  Productive interactive computing.
- [Art](https://github.com/sepandhaghighi/art):
  ASCII art.

### AI

- [Extract](https://github.com/google/langextract):
  Extracting structured information from unstructured text using LLMs.
- [Toad](https://github.com/batrachianai/toad):
  Unified client for terminal agents.

### Debugging

- [Snooper](https://github.com/cool-RR/PySnooper):
  Poor man's debugger.

### Testing

- [Pytest](https://github.com/pytest-dev/pytest):
  Testing framework.
- [Coverage](https://github.com/pytest-dev/pytest-cov):
  Coverage reporting.
