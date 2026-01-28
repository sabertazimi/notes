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

## Initialize

```bash
uv init hello-app
uv init --package hello-package
uv init --lib hello-lib
uv init --script hello-script.py --python 3.14
```

## Packages

Install packages:

```bash
uv pip install requests
uv pip install --system pandas
uv pip list
uv pip list --outdated
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

## Execution

Toolchain execution:

```bash
uv tool install black
uv tool run black ./myfile.py

uvx pycowsay 'hello world!'
uvx ruff format ./myscript.py
uvx python@3.13.2 -c "print('hello world')"
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

Monorepo support:

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

```bash
# Initialize package
uv init packages/bash-agent

# Run package
uv run --package bash-agent

# Add package as workspace dependency
uv add bash-agent --workspace
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

## Library

- [FastAPI](https://github.com/fastapi/fastapi):
  High-performance web framework.
- [Uvicorn](https://github.com/Kludex/uvicorn):
  ASGI web server.
- [IPython](https://github.com/ipython/ipython):
  Productive interactive computing.
- [Extract](https://github.com/google/langextract):
  Extracting structured information from unstructured text using LLMs.
- [Snooper](https://github.com/cool-RR/PySnooper):
  Poor man's debugger.
