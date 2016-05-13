# Awesome-Stars

[![Starring](https://img.shields.io/badge/repos-starring-a5f2d5.svg)](https://github.com/stars)

> Repo for Managing Personal GitHub Stars

## Get Starring Repos Data

-   Curl GitHub API

```shell
$ curl 'https://api.github.com/users/sabertazimi/starred?direction=asc&page=1&per_page=10000' | grep -E 'full_name|svn_url' | wc -l
$ curl 'https://api.github.com/users/sabertazimi/starred?direction=asc&page=1&per_page=10000' | grep -E 'full_name|svn_url' >> StarringRepos.md
```

-   Tidy Up Data

```shell
:%s/"full_name": "//g
:%s/"svn_url": "//g
qq
70@q
```

## Starring Repos List

### Awesome

#### Awesome List

-   [sindresorhus/awesome](https://github.com/sindresorhus/awesome)
-   [bayandin/awesome-awesomeness](https://github.com/bayandin/awesome-awesomeness)
-   [t3chnoboy/awesome-awesome-awesome](https://github.com/t3chnoboy/awesome-awesome-awesome)

#### Awesome Language

-   [alebcay/awesome-shell](https://github.com/alebcay/awesome-shell)
-   [sorrycc/awesome-javascript](https://github.com/sorrycc/awesome-javascript)
-   [stoeffel/awesome-fp-js](https://github.com/stoeffel/awesome-fp-js)
-   [sindresorhus/awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs)
-   [enaqx/awesome-react](https://github.com/enaqx/awesome-react)
-   [sindresorhus/awesome-electron](https://github.com/sindresorhus/awesome-electron)
-   [krispo/awesome-haskell](https://github.com/krispo/awesome-haskell)
-   [isRuslan/awesome-elm](https://github.com/isRuslan/awesome-elm)

#### Awesome Learning

-   [prakhar1989/awesome-courses](https://github.com/prakhar1989/awesome-courses)
-   [papers-we-love/papers-we-love](https://github.com/papers-we-love/papers-we-love)
-   [lyfeyaj/awesome-resources](https://github.com/lyfeyaj/awesome-resources)
-   [watson/awesome-computer-history](https://github.com/watson/awesome-computer-history)

#### Awesome Others

-   [tastejs/awesome-app-ideas](https://github.com/tastejs/awesome-app-ideas)
-   [aharris88/awesome-cli-apps](https://github.com/aharris88/awesome-cli-apps)
-   [lukasz-madon/awesome-remote-job](https://github.com/lukasz-madon/awesome-remote-job)
-   [aharris88/awesome-static-website-services](https://github.com/aharris88/awesome-static-website-services)

### Language

#### Haskell

-   [ghcjs/ghcjs](https://github.com/ghcjs/ghcjs)

#### Shell

-   [NARKOZ/hacker-scripts](https://github.com/NARKOZ/hacker-scripts)
-   [mathiasbynens/dotfiles](https://github.com/mathiasbynens/dotfiles)

### Editor

#### Vim

-   [spf13/spf13-vim](https://github.com/spf13/spf13-vim)
-   [exvim/main](https://github.com/exvim/main)

### Documentation

-   [boennemann/badges](https://github.com/boennemann/badges)

#### Template

-   [evangoer/pandoc-ebook-template](https://github.com/evangoer/pandoc-ebook-template)

#### Markdown

-   [verbose/verb](https://github.com/verbose/verb)
-   [chjj/marked](https://github.com/chjj/marked)

### Font-End

#### Standard

##### W3C Standard

-   [whatwg/html](https://github.com/whatwg/html)
-   [whatwg/javascript](https://github.com/whatwg/javascript)

##### New Standard

-   [tc39/ecma262](https://github.com/tc39/ecma262)
-   [tc39/test262](https://github.com/tc39/test262)

##### WebAssembly Standard

-   [WebAssembly/design](https://github.com/WebAssembly/design)

##### Modular Standard

-   [umdjs/umd](https://github.com/umdjs/umd)

#### Utils

-   [babel/babel](https://github.com/babel/babel)
-   [mohebifar/lebab](https://github.com/mohebifar/lebab)

#### Libraries

-   [Yomguithereal/baobab](https://github.com/Yomguithereal/baobab)
-   [eduardolundgren/tracking.js](https://github.com/eduardolundgren/tracking.js)

#### Frameworks

-   [riot/riot](https://github.com/riot/riot)

#### Demo

-   [nolanlawson/pokedex.org](https://github.com/nolanlawson/pokedex.org)
-   [jaywcjlove/FED](https://github.com/jaywcjlove/FED)

#### JS

-   [davidedc/Algebrite](https://github.com/davidedc/Algebrite)
-   [creationix/js-git](https://github.com/creationix/js-git)

### Back-End

#### Platform

-   [docker/docker](https://github.com/docker/docker)
-   [mattermost/platform](https://github.com/mattermost/platform)
-   [RocketChat/Rocket.Chat](https://github.com/RocketChat/Rocket.Chat)
-   [sandstorm-io/sandstorm](https://github.com/sandstorm-io/sandstorm)

#### Nodejs System

-   [rickyrauch/Balloons.IO](https://github.com/rickyrauch/Balloons.IO)
-   [cnodejs/nodeclub](https://github.com/cnodejs/nodeclub)
-   [NodeOS/NodeOS](https://github.com/NodeOS/NodeOS)

### CS

#### Git

-   [nvie/gitflow](https://github.com/nvie/gitflow)
-   [tiimgreen/github-cheat-sheet](https://github.com/tiimgreen/github-cheat-sheet)

#### Search

-   [elastic/elasticsearch](https://github.com/elastic/elasticsearch)

#### Compiler

#### ML

-   [Rochester-NRT/AlphaGo](https://github.com/Rochester-NRT/AlphaGo)

### API

-   [mailru/FileAPI](https://github.com/mailru/FileAPI)
-   [toddmotto/public-apis](https://github.com/toddmotto/public-apis)

### Utils

#### Download

-   [soimort/you-get](https://github.com/soimort/you-get)

#### Workflow

-   [hzlzh/AlfredWorkflow.com](https://github.com/hzlzh/AlfredWorkflow.com)

### Testing and Analysis

#### Data

-   [firehol/netdata](https://github.com/firehol/netdata)

#### C

-   [svn2github/valgrind](https://github.com/svn2github/valgrind)
-   [brendangregg/perf-tools](https://github.com/brendangregg/perf-tools)

#### Linux

-   [allinurl/goaccess](https://github.com/allinurl/goaccess)

#### Web Analysis

-   [brendangregg/FlameGraph](https://github.com/brendangregg/FlameGraph)

#### Web Testing

-   [yahoo/fake-server](https://github.com/yahoo/fake-server)

## License

MIT [@sabertazimi](https://github.com/sabertazimi/)
